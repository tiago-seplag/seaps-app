import type { Knex } from "knex";

const TABLE_NAME = "users";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
    table.string("name").notNullable().unique();
    table.string("email").nullable();
    table.string("password");
    table.string("avatar");
    table
      .enu("role", ["ADMIN", "SUPERVISOR", "EVALUATOR"], {
        enumName: "user_roles",
        useNative: true,
      })
      .notNullable();
    table.boolean("is_active").defaultTo(false);
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
}
