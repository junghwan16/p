const knex = require("../db/knex");

module.exports = {
	/**
	 * Create a new user.
	 * @param {Object} user - The user object.
	 * @returns {Promise<Object>} Resolves to the created user object.
	 */
	async createUser(user) {
		const [id] = await knex("users").insert(user);
		return this.findUserById(id);
	},

	/**
	 * Find a user by username.
	 * @param {string} username - The username to search for.
	 * @returns {Promise<Object|null>} Resolves to the user object if found, else null.
	 */
	async findUserByUsername(username) {
		return knex("users").where({ username }).first();
	},

	/**
	 * Find a user by id.
	 * @param {number} id - The id of the user.
	 * @returns {Promise<Object|null>} Resolves to the user object if found, else null.
	 */
	async findUserById(id) {
		return knex("users").where({ id }).first();
	},
};
