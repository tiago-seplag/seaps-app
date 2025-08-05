/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "knex";

type SearchParams = {
  [key: string]: string | string[] | undefined | boolean | SearchParams;
};

interface IPaginateParams {
  perPage: number;
  currentPage: number;
}

interface IPagination<Data> {
  data: Data[];
  pagination: IBasePagination;
}

interface IBasePagination {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  prev_page: number;
  next_page: number;
}

declare module "knex" {
  namespace Knex {
    interface QueryBuilder<TRecord extends object = any, TResult = any> {
      paginate(
        page: number,
        perPage: number,
        options?: { nest?: boolean },
      ): Knex.QueryBuilder<TRecord, IPagination<TRecord[]>>;
    }
    interface QueryBuilder<TRecord extends object = any, TResult = any> {
      paginate<T>(
        page: number,
        perPage: number,
        options?: { nest?: boolean },
      ): Knex.QueryBuilder<TRecord, IPagination<T>>;
    }
    interface QueryBuilder<TRecord extends object = any, TResult = any> {
      nest(): QueryBuilder<TRecord, TResult>;
    }
  }
}