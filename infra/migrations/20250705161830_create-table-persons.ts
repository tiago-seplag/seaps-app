import type { Knex } from "knex";

const TABLE_NAME = "persons";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
    table.uuid("organization_id").notNullable();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("phone");
    table.string("role");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.foreign("organization_id").references("id").inTable("organizations");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
}
