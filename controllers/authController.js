const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const SALT_ROUNDS = 10;

exports.register = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(400).json({ message: "필수 파라미터 누락" });
		return;
	}

	const existingUser = await userModel.findUserByUsername(username);
	if (existingUser) {
		res.status(400).json({ message: "이미 존재하는 사용자" });
		return;
	}

	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	const newUser = await userModel.createUser({
		username,
		password: hashedPassword,
	});

	res.status(201).json({ id: newUser.id, username: newUser.username });
};

exports.login = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(400).json({ message: "필수 파라미터 누락" });
		return;
	}

	const user = await userModel.findUserByUsername(username);
	if (!user) {
		res.status(400).json({ message: "아이디 또는 비밀번호 오류" });
		return;
	}

	const isValid = await bcrypt.compare(password, user.password);
	if (!isValid) {
		res.status(400).json({ message: "아이디 또는 비밀번호 오류" });
		return;
	}

	const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
		expiresIn: "1h",
	});
	res.json({ token });
};
