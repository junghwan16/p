// userRepository.js
const knex = require("../db/knex");

/**
 * 사용자 생성 후 생성된 사용자 반환
 * @param {Object} user - 사용자 정보
 * @returns {Promise<Object>}
 */
const createUser = async (user) => {
	const [id] = await knex("users").insert(user);
	return getUserById(id);
};

/**
 * 이메일로 사용자 조회
 * @param {string} email - 이메일
 * @returns {Promise<Object|null>}
 */
const getUserByEmail = async (email) => {
	return knex("users").where({ email }).first();
};

/**
 * username으로 사용자 조회
 * @param {string} username - 사용자명
 * @returns {Promise<Object|null>}
 */
const getUserByUsername = async (username) => {
	return knex("users").where({ username }).first();
};

/**
 * id로 사용자 조회
 * @param {number} id - 사용자 id
 * @returns {Promise<Object|null>}
 */
const getUserById = async (id) => {
	return knex("users").where({ id }).first();
};

/**
 * 사용자 정보 업데이트 후 업데이트된 사용자 반환
 * @param {number} id - 사용자 id
 * @param {Object} updates - 업데이트 내용
 * @returns {Promise<Object>}
 */
const updateUser = async (id, updates) => {
	await knex("users").where({ id }).update(updates);
	return getUserById(id);
};

/**
 * 사용자 삭제
 * @param {number} id - 사용자 id
 * @returns {Promise<number>}
 */
const deleteUser = async (id) => {
	return knex("users").where({ id }).del();
};

module.exports = {
	createUser,
	getUserByEmail,
	getUserByUsername,
	getUserById,
	updateUser,
	deleteUser,
};
