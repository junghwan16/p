const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");

const SALT_ROUNDS = 10;

exports.getLoginPage = (req, res) => {
	res.render("auth/login");
};

exports.getRegisterPage = (req, res) => {
	res.render("auth/register");
};

exports.register = async (req, res) => {
	const { email, username, password } = req.body;

	try {
		const existingUser = await userRepository.getUserByEmail(email);
		if (existingUser) {
			return res.render("auth/register", {
				error: "이미 존재하는 사용자입니다",
			});
		}

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		const newUser = await userRepository.createUser({
			email,
			username,
			password: hashedPassword,
		});

		req.session.user = {
			id: newUser.id,
			email: newUser.email,
			username: newUser.username,
		};
		res.redirect("/");
	} catch (error) {
		res.render("auth/register", { error: "회원가입 중 오류가 발생했습니다" });
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await userRepository.getUserByEmail(email);
		if (!user) {
			return res.render("auth/login", {
				error: "이메일 또는 비밀번호가 일치하지 않습니다",
			});
		}

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return res.render("auth/login", {
				error: "이메일 또는 비밀번호가 일치하지 않습니다",
			});
		}

		req.session.user = {
			id: user.id,
			username: user.username,
			email: user.email,
		};
		res.redirect("/");
	} catch (error) {
		res.render("auth/login", { error: "로그인 중 오류가 발생했습니다" });
	}
};

exports.logout = (req, res) => {
	req.session.destroy();
	res.redirect("/auth/login");
};
