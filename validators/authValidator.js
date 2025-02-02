const { z } = require("zod");

const registerSchema = z.object({
	username: z.string().min(1, { message: "username은 필수입니다." }),
	password: z.string().min(6, { message: "password는 6자 이상이어야 합니다." }),
});

const loginSchema = z.object({
	username: z.string().min(1, { message: "username은 필수입니다." }),
	password: z.string().min(1, { message: "password는 필수입니다." }),
});

module.exports = { registerSchema, loginSchema };
