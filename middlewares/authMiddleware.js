module.exports = (req, res, next) => {
	if (!req.session.user) return res.redirect("/auth/login");
	res.locals.user = req.session.user; // 뷰에서 사용하기 위해 res.locals에 저장
	next();
};
