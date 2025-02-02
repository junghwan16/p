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

exports.updateProfile = async (req, res) => {
	try {
		const { username } = req.body;
		await userRepository.updateUser(req.session.user.id, { username });
		req.session.user.username = username; // 세션 정보 업데이트

		// HTMX 요청인 경우 partial만 렌더링
		if (req.header("HX-Request")) {
			return res.render("user/partials/profile-form", {
				user: req.session.user,
				success: "프로필이 성공적으로 업데이트되었습니다",
			});
		}

		// 일반 요청인 경우 전체 페이지 렌더링
		res.render("user/profile", {
			user: req.session.user,
			success: "프로필이 성공적으로 업데이트되었습니다",
		});
	} catch (error) {
		const errorMsg = "프로필 업데이트 중 오류가 발생했습니다";
		if (req.header("HX-Request")) {
			return res.render("user/partials/profile-form", {
				user: req.session.user,
				error: errorMsg,
			});
		}
		res.render("user/profile", {
			user: req.session.user,
			error: errorMsg,
		});
	}
};

exports.deleteUser = async (req, res) => {
	try {
		await userRepository.deleteUser(req.session.user.id);
		req.session.destroy();
		res.redirect("/auth/login");
	} catch (error) {
		res.render("user/profile", {
			user: req.session.user,
			error: "계정 삭제 중 오류가 발생했습니다",
		});
	}
};
