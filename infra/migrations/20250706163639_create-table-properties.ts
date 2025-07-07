import type { Knex } from "knex";

const TABLE_NAME = "properties";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
    table.uuid("organization_id").notNullable();
    table.uuid("person_id").notNullable();
    table.string("name").notNullable();
    table.string("address");
    table
      .enu("role", ["OWN", "RENTED", "GRANT"], {
        enumName: "property_types",
        useNative: true,
      })
      .defaultTo("OWN")
      .notNullable();
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.foreign("organization_id").references("id").inTable("organizations");
    table.foreign("person_id").references("id").inTable("persons");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
}
