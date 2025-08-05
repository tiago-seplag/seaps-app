import type { Knex } from "knex";

const TABLE_NAME = "organization_users";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
    table.uuid("organization_id");
    table.uuid("user_id");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.foreign("organization_id").references("id").inTable("organizations");
    table.foreign("user_id").references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
}
