module.exports = {
	development: {
		client: "sqlite3",
		connection: {
			filename: "./db/dev.sqlite3",
		},
		migrations: {
			directory: "./db/migrations",
		},
		useNullAsDefault: true,
	},

	test: {
		client: "sqlite3",
		connection: {
			filename: "./db/test.sqlite3",
		},
		migrations: {
			directory: "./db/migrations",
		},
		useNullAsDefault: true,
	},

	production: {
		client: "sqlite3",
		connection: {
			filename: process.env.SQLITE_FILENAME || "./db/prod.sqlite3",
		},
		migrations: {
			directory: "./db/migrations",
		},
		useNullAsDefault: true,
	},
};
