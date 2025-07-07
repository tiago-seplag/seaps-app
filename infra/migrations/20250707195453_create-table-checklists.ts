import type { Knex } from "knex";

const TABLE_NAME = "checklists";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
    table.string("sid").notNullable();
    table.uuid("organization_id").notNullable();
    table.uuid("model_id").notNullable();
    table.uuid("property_id").notNullable();
    table.uuid("user_id").notNullable();
    table.uuid("finished_by");
    table.float("score", 3);
    table.integer("classification");
    table
      .enu("status", ["OPEN", "CLOSED"], {
        useNative: true,
        enumName: "checklist_status_enum",
      })
      .defaultTo("OPEN");
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("finished_at");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.foreign("organization_id").references("id").inTable("organizations");
    table.foreign("model_id").references("id").inTable("models");
    table.foreign("property_id").references("id").inTable("properties");
    table.foreign("user_id").references("id").inTable("users");
    table.foreign("finished_by").references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
}
