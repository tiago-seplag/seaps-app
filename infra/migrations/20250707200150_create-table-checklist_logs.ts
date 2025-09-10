import type { Knex } from "knex";

const TABLE_NAME = "checklist_logs";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
    table.uuid("checklist_id");
    table.uuid("checklist_item_id");
    table.uuid("user_id");
    table
      .enu("status", ["OPEN", "CLOSED", "APPROVED", "REJECTED"], {
        useNative: true,
        enumName: "checklist_status",
        existingType: true,
      })
      .defaultTo("OPEN");
    table.string("action").notNullable();
    table.string("observation");
    table.jsonb("value").defaultTo({});
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
