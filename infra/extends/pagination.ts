import knex, { Knex } from "knex";

export function paginate() {
  knex.QueryBuilder.extend(
    "paginate",
    function (
      _currentPage = 1,
      perPage = 10,
      options?: { nest: boolean },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any {
      if (isNaN(perPage)) {
        throw new Error("Paginate error: perPage must be a number.");
      }

      if (isNaN(_currentPage)) {
        throw new Error("Paginate error: currentPage must be a number.");
      }

      let currentPage = Number(_currentPage);

      if (currentPage < 1) {
        currentPage = 1;
      }

      const offset = (currentPage - 1) * perPage;
      const limit = perPage;

      const countQuery = this.client
        .queryBuilder()
        .count("* as total")
        .from(this.clone().clearOrder().offset(0).as("subQuery"))
        .first();

      this.offset(offset).limit(limit);

      return this.client.transaction(
        async (trx: Knex.Transaction) => {
          const result = options?.nest
            ? await this.transacting(trx).nest()
            : await this.transacting(trx);

          const countResult = await countQuery.transacting(trx);
          const total = Number(countResult.total || 0);
          const lastPage = Math.ceil(total / perPage);

          const nextPage =
            currentPage < lastPage ? "?page=" + (currentPage + 1) : null;

          const prevPage =
            currentPage > 1 ? "?page=" + (currentPage - 1) : null;

          const pagination = {
            total,
            current_page: Number(currentPage),
            per_page: Number(perPage),
            last_page: lastPage,
            prev_page: nextPage,
            next_page: prevPage,
          };

          return { pagination, data: result };
        },
        undefined,
        undefined,
      );
    },
  );
}
