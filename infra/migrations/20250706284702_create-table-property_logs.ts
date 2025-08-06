import type { Knex } from "knex";

const TABLE_NAME = "property_logs";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
    table.uuid("user_id");
    table
      .enu("status", ["PENDING", "APPROVED", "REJECTED"], {
        useNative: true,
        enumName: "property_status",
        existingType: true,
      })
      .defaultTo("PENDING");
    table.string("action").notNullable();
    table.string("observation");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.foreign("user_id").references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
}
