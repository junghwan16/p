const userRepository = require("../repositories/userRepository");

exports.getProfile = async (req, res) => {
	if (!req.session.user) {
		return res.redirect("/auth/login");
	}

	try {
		const user = await userRepository.getUserById(req.session.user.id);
		if (!user) {
			return res.redirect("/auth/login");
		}

		res.render("user/profile");
	} catch (error) {
		res.render("user/profile", {
			error: "프로필을 불러오는 중 오류가 발생했습니다",
		});
	}
};

exports.deleteUser = async (req, res) => {
	try {
		await userRepository.deleteUser(req.session.user.id);
		req.session.destroy();
		res.redirect("/auth/login");
	} catch (error) {
		res.render("user/profile", { error: "계정 삭제 중 오류가 발생했습니다" });
	}
};
