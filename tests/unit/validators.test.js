const {
	registerSchema,
	loginSchema,
} = require("../../validators/authValidator");

describe("Auth Validators", () => {
	describe("registerSchema", () => {
		test("유효한 입력값 검증", () => {
			const validData = {
				username: "testuser",
				password: "password123",
			};
			const result = registerSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		test("짧은 비밀번호 검증", () => {
			const invalidData = {
				username: "testuser",
				password: "123",
			};
			const result = registerSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			expect(result.error.errors[0].message).toBe(
				"password는 6자 이상이어야 합니다.",
			);
		});

		test("빈 username 검증", () => {
			const invalidData = {
				username: "",
				password: "password123",
			};
			const result = registerSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			expect(result.error.errors[0].message).toBe("username은 필수입니다.");
		});
	});

	describe("loginSchema", () => {
		test("유효한 로그인 데이터 검증", () => {
			const validData = {
				username: "testuser",
				password: "password123",
			};
			const result = loginSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		test("빈 필드 검증", () => {
			const invalidData = {
				username: "",
				password: "",
			};
			const result = loginSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			expect(result.error.errors).toHaveLength(2);
		});
	});
});
