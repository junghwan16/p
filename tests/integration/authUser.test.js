const request = require("supertest");
const app = require("../../app");
const knex = require("../../db/knex");

describe("Auth 및 User 기능 통합 테스트", () => {
	beforeAll(async () => {
		await knex.migrate.latest();
	});

	beforeEach(async () => {
		await knex("users").truncate(); // users 테이블 초기화
	});

	afterAll(async () => {
		await knex.migrate.rollback();
		await knex.destroy();
	});

	const userData = {
		username: "testuser",
		password: "testpassword",
		email: "test@example.com",
	};

	async function registerUser(userData) {
		return await request(app).post("/auth/register").send(userData);
	}

	async function loginUser(userData) {
		return await request(app).post("/auth/login").send(userData);
	}

	test("POST /auth/register - 사용자 등록 성공", async () => {
		const res = await registerUser(userData);
		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty("id");
		expect(res.body.username).toBe(userData.username);
		expect(res.body.email).toBe(userData.email);
	});

	test("POST /auth/register - 중복 사용자 등록 실패", async () => {
		// 먼저 사용자 등록
		await registerUser(userData);
		// 동일한 사용자 다시 등록 시도
		const res = await registerUser(userData);
		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("message");
	});

	test("POST /auth/register - 유효하지 않은 입력값으로 등록 실패", async () => {
		const invalidData = {
			username: "",
			password: "123",
		};
		const res = await registerUser(invalidData);
		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("errors");
	});

	test("POST /auth/login - 로그인 성공", async () => {
		// 먼저 사용자 등록
		await registerUser(userData);
		// 로그인 시도
		const res = await loginUser(userData);
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("token");
	});

	test("POST /auth/login - 비밀번호 불일치로 로그인 실패", async () => {
		// 먼저 사용자 등록
		await registerUser(userData);
		// 잘못된 비밀번호로 로그인 시도
		const res = await loginUser({
			email: userData.email,
			password: "wrongpassword",
		});
		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("message");
	});

	test("POST /auth/login - 유효하지 않은 입력값으로 로그인 실패", async () => {
		const invalidData = {
			username: "",
			password: "",
		};
		const res = await loginUser(invalidData);
		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("errors");
	});

	test("GET /user/profile - 토큰 없이 접근 시 인증 실패", async () => {
		const res = await request(app).get("/user/profile");
		expect(res.statusCode).toBe(401);
		expect(res.body).toHaveProperty("message");
	});

	test("GET /user/profile - 토큰 포함 시 사용자 프로필 반환", async () => {
		// 사용자 등록
		await registerUser(userData);
		// 로그인하여 토큰 획득
		const loginRes = await loginUser(userData);
		const token = loginRes.body.token;

		// 프로필 조회
		const res = await request(app)
			.get("/user/profile")
			.set("Authorization", `Bearer ${token}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("id");
		expect(res.body.username).toBe(userData.username);
	});

	test("PUT /user/profile - 프로필 업데이트 성공", async () => {
		// 사용자 등록
		await registerUser(userData);
		// 로그인하여 토큰 획득
		const loginRes = await loginUser(userData);
		const token = loginRes.body.token;

		const updateData = {
			email: "test@example.com",
		};

		const res = await request(app)
			.put("/user/profile")
			.set("Authorization", `Bearer ${token}`)
			.send(updateData);

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("message", "프로필 업데이트 성공");
	});

	test("PUT /user/profile - 인증 없이 프로필 업데이트 실패", async () => {
		const updateData = {
			email: "test@example.com",
		};

		const res = await request(app).put("/user/profile").send(updateData);

		expect(res.statusCode).toBe(401);
		expect(res.body).toHaveProperty("message");
	});

	test("DELETE /user - 계정 삭제 성공", async () => {
		// 사용자 등록
		await registerUser(userData);
		// 로그인하여 토큰 획득
		const loginRes = await loginUser(userData);
		const token = loginRes.body.token;

		const res = await request(app)
			.delete("/user")
			.set("Authorization", `Bearer ${token}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("message", "계정 삭제 완료");

		// 삭제된 계정으로 프로필 접근 시도
		const profileRes = await request(app)
			.get("/user/profile")
			.set("Authorization", `Bearer ${token}`);

		expect(profileRes.statusCode).toBe(404); // 404 Not Found
	});

	test("DELETE /user - 인증 없이 계정 삭제 실패", async () => {
		const res = await request(app).delete("/user");

		expect(res.statusCode).toBe(401);
		expect(res.body).toHaveProperty("message");
	});
});
