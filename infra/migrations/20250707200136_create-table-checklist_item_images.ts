import type { Knex } from "knex";

const TABLE_NAME = "checklist_item_images";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
    table.uuid("checklist_item_id").notNullable();
    table.string("image");
    table.integer("size").comment("Size in bytes");
    table.string("format");
    table.string("observation");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table
      .foreign("checklist_item_id")
      .references("id")
      .inTable("checklist_items");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
}
