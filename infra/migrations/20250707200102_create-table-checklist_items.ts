import type { Knex } from "knex";

const TABLE_NAME = "checklist_items";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
    table.string("sid").notNullable();
    table.uuid("checklist_id").notNullable();
    table.uuid("item_id").notNullable();
    table.integer("score").nullable();
    table.string("observation")
    table.string("image")
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.foreign("checklist_id").references("id").inTable("checklists");
    table.foreign("item_id").references("id").inTable("items");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
}
