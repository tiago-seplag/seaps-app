import type { Knex } from "knex";

const TABLE_NAME = "properties";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
    table.uuid("organization_id").notNullable();
    table.uuid("person_id");
    table.uuid("created_by");
    table
      .enu("type", ["OWN", "RENTED", "GRANT"], {
        enumName: "property_types",
        useNative: true,
      })
      .defaultTo("OWN")
      .notNullable();
    table
      .enu("status", ["PENDING", "APPROVED", "REJECTED"], {
        useNative: true,
        enumName: "property_status",
      })
      .defaultTo("PENDING");
    table.string("name").notNullable();
    table.string("name_normalized");
    table.string("address");
    table.string("cep");
    table.string("state");
    table.string("city");
    table.string("neighborhood");
    table.string("street");
    table.string("coordinates");
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.foreign("organization_id").references("id").inTable("organizations");
    table.foreign("person_id").references("id").inTable("persons");
    table.foreign("created_by").references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
}
