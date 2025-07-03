import knex from "knex";
import type { Knex as KnexType } from "knex";
import config from "../knexfile";
import { paginate } from "./extends/pagination";
import { nest } from "./extends/nest";

paginate();
nest();

const db: KnexType = knex(config);

export { db };
