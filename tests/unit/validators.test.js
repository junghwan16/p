const {
	registerSchema,
	loginSchema,
} = require("../../validators/authValidator");

describe("Auth Validators", () => {
	describe("registerSchema", () => {
		test("유효한 입력값 검증", () => {
			const validData = {
				email: "test@example.com",
				username: "testuser",
				password: "password123",
			};
			const result = registerSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		test("짧은 비밀번호 검증", () => {
			const invalidData = {
				email: "test@example.com",
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
				email: "test@example.com",
				username: "",
				password: "password123",
			};
			const result = registerSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			expect(result.error.errors[0].message).toBe("username은 필수입니다.");
		});

		test("잘못된 이메일 형식 검증", () => {
			const invalidData = {
				email: "invalid-email",
				username: "testuser",
				password: "password123",
			};
			const result = registerSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			expect(result.error.errors[0].message).toBe(
				"유효한 이메일 주소를 입력해주세요.",
			);
		});
	});

	describe("loginSchema", () => {
		test("유효한 로그인 데이터 검증", () => {
			const validData = {
				email: "test@example.com",
				password: "password123",
			};
			const result = loginSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		test("빈 필드 검증", () => {
			const invalidData = {
				email: "",
				password: "",
			};
			const result = loginSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			expect(result.error.errors).toHaveLength(2);
			expect(result.error.errors[0].message).toBe("email은 필수입니다.");
			expect(result.error.errors[1].message).toBe("password는 필수입니다.");
		});
	});
});
