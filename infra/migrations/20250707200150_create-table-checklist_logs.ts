import type { Knex } from "knex";

const TABLE_NAME = "checklist_logs";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
    table.uuid("checklist_id");
    table.uuid("checklist_item_id");
    table.uuid("user_id");
    table.string("action").notNullable();
    table.string("old_value");
    table.string("new_value");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.foreign("checklist_id").references("id").inTable("checklists");
    table
      .foreign("checklist_item_id")
      .references("id")
      .inTable("checklist_items");
    table.foreign("user_id").references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
}
