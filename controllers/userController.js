exports.getProfile = async (req, res) => {
	if (!req.user) return res.status(401).json({ message: "인증 필요" });

	return res.json({ id: req.user.id, username: req.user.username });
};
