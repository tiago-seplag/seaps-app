/* eslint-disable @typescript-eslint/no-explicit-any */
import knex from "knex";
import type { Knex as KnexType } from "knex";
import config from "../knexfile";
import { paginate } from "./extends/pagination";
import { nest } from "./extends/nest";

if (!(globalThis as any).__knex_paginate_attached__) {
  paginate();
  (globalThis as any).__knex_paginate_attached__ = true;
}

if (!(globalThis as any).__knex_nest_attached__) {
  nest();
  (globalThis as any).__knex_nest_attached__ = true;
}

const db: KnexType = knex(config);

export { db };
