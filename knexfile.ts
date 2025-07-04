import { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config({
  path: [".env", "../.env"],
  quiet: true,
});

const config: Knex.Config = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 7 },
  migrations: {
    directory: "./infra/migrations/",
  },
  seeds: {
    directory: "./infra/seeds",
  },
};

export default config;
