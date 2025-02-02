const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const SALT_ROUNDS = 10;

exports.register = async (req, res) => {
	const { email, username, password } = req.body;

	const existingUser = await userModel.findUserByEmail(email);
	if (existingUser) {
		res.status(400).json({ message: "이미 존재하는 사용자" });
		return;
	}

	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	const newUser = await userModel.createUser({
		username,
		password: hashedPassword,
		email,
	});

	res.status(201).json({
		id: newUser.id,
		username: newUser.username,
		email: newUser.email,
	});
};

exports.login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400).json({ message: "필수 파라미터 누락" });
		return;
	}

	const user = await userModel.findUserByEmail(email);
	if (!user) {
		res.status(400).json({ message: "이메일 또는 비밀번호 오류" });
		return;
	}

	const isValid = await bcrypt.compare(password, user.password);
	if (!isValid) {
		res.status(400).json({ message: "이메일 또는 비밀번호 오류" });
		return;
	}

	const token = jwt.sign(
		{ id: user.id, username: user.username, email: user.email },
		SECRET_KEY,
		{
			expiresIn: "1h",
		},
	);
	res.json({ token });
};
