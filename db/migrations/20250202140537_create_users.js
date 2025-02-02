/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
	knex.schema.createTable("users", (table) => {
		table.increments("id").primary();
		table.string("email").unique().notNullable();
		table.string("username").notNullable();
		table.string("password").notNullable();
		table.timestamps(true, true);
	});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("users");
