const userModel = require("../models/userModel");

exports.getProfile = async (req, res) => {
	if (!req.user) return res.status(401).json({ message: "인증 필요" });

	const user = await userModel.findUserById(req.user.id);
	if (!user)
		return res.status(404).json({ message: "사용자를 찾을 수 없습니다" });

	res.json({
		id: user.id,
		username: user.username,
		email: user.email,
	});
};

exports.updateProfile = async (req, res) => {
	const { email } = req.body;
	await userModel.updateUser(req.user.id, { email });

	res.json({ message: "프로필 업데이트 성공" });
};

exports.deleteUser = async (req, res) => {
	await userModel.deleteUser(req.user.id);

	res.json({ message: "계정 삭제 완료" });
};
