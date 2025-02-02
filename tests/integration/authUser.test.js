const request = require("supertest");
const cheerio = require("cheerio");
const app = require("../../app");
const knex = require("../../db/knex");

describe("Auth 및 User 기능 통합 테스트", () => {
	beforeAll(async () => {
		await knex.migrate.latest();
	});

	beforeEach(async () => {
		await knex("users").truncate();
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

	test("GET /auth/register - 회원가입 페이지 렌더링", async () => {
		const res = await request(app).get("/auth/register");
		expect(res.statusCode).toBe(200);
		expect(res.text).toContain("회원가입");
	});

	test("POST /auth/register - 사용자 등록 성공", async () => {
		const res = await request(app)
			.post("/auth/register")
			.send(userData)
			.expect(302) // 리다이렉션 확인
			.expect("Location", "/"); // 홈으로 리다이렉트
	});

	test("POST /auth/register - 중복 사용자 등록 실패", async () => {
		// 먼저 사용자 등록
		await request(app).post("/auth/register").send(userData);

		// 동일한 사용자 다시 등록 시도
		const res = await request(app).post("/auth/register").send(userData);

		expect(res.statusCode).toBe(200); // 에러와 함께 렌더링
		const $ = cheerio.load(res.text);
		expect($(".error").text()).toContain("이미 존재하는 사용자입니다");
	});

	test("GET /auth/login - 로그인 페이지 렌더링", async () => {
		const res = await request(app).get("/auth/login");
		expect(res.statusCode).toBe(200);
		expect(res.text).toContain("로그인");
	});

	test("POST /auth/login - 로그인 성공", async () => {
		// 먼저 사용자 등록
		await request(app).post("/auth/register").send(userData);

		// 로그인 시도
		const res = await request(app)
			.post("/auth/login")
			.send(userData)
			.expect(302) // 리다이렉션 확인
			.expect("Location", "/"); // 홈으로 리다이렉트
	});

	test("POST /auth/login - 잘못된 비밀번호로 로그인 실패", async () => {
		// 먼저 사용자 등록
		await request(app).post("/auth/register").send(userData);

		// 잘못된 비밀번호로 로그인
		const res = await request(app).post("/auth/login").send({
			email: userData.email,
			password: "wrongpassword",
		});

		expect(res.statusCode).toBe(200);
		const $ = cheerio.load(res.text);
		expect($(".error").text()).toContain(
			"이메일 또는 비밀번호가 일치하지 않습니다",
		);
	});

	test("POST /auth/logout - 로그아웃 성공", async () => {
		// 먼저 로그인
		const agent = request.agent(app);
		await agent.post("/auth/register").send(userData);

		// 로그아웃
		const res = await agent
			.post("/auth/logout")
			.expect(302)
			.expect("Location", "/auth/login");
	});
});
