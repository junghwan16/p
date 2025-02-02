const { z } = require("zod");

const registerSchema = z.object({
	username: z.string().min(1, { message: "username은 필수입니다." }),
	password: z.string().min(6, { message: "password는 6자 이상이어야 합니다." }),
	email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
});

const loginSchema = z.object({
	email: z.string().min(1, { message: "email은 필수입니다." }),
	password: z.string().min(1, { message: "password는 필수입니다." }),
});

module.exports = { registerSchema, loginSchema };
