export function generateMetaPagination(
  page: number,
  perPage: number,
  total: number,
) {
  let current_page;
  let per_page;

  if (typeof page !== "number" || page < 1) {
    current_page = 1;
  }

  if (typeof perPage !== "number") {
    per_page = 10;
  }

  current_page = page;
  per_page = perPage;

  const last_page = Math.ceil(total / per_page);

  const next_page =
    current_page < last_page ? "?page=" + (current_page + 1) : null;

  const prev_page = current_page > 1 ? "?page=" + (current_page - 1) : null;

  return {
    total,
    current_page,
    last_page,
    per_page,
    prev_page,
    next_page,
  };
}
