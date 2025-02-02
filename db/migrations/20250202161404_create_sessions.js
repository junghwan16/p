/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
  // express-session을 위한 세션 테이블 생성
  return knex.schema.createTable("sessions", (table) => {
    table.string("sid").primary();
    table.json("sess").notNullable();
    table.timestamp("expired").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
  return knex.schema.dropTable("sessions");
};
