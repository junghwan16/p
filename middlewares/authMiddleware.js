const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

module.exports = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return res.status(401).json({
				message: "인증 헤더가 없습니다",
			});
		}

		if (!authHeader.startsWith('Bearer ')) {
			return res.status(401).json({
				message: "잘못된 토큰 형식입니다",
			});
		}

		const token = authHeader.split(" ")[1];

		const decoded = jwt.verify(token, SECRET_KEY);

		if (decoded.exp && decoded.exp < Date.now() / 1000) {
			return res.status(401).json({
				message: "만료된 토큰입니다",
			});
		}

		console.log(`인증 성공: 사용자 ID ${decoded.id}`);
		req.user = decoded;
		next();

	} catch (error) {
		console.error('토큰 검증 실패:', error.message);
		return res.status(401).json({
			message: "유효하지 않은 토큰입니다",
			details: error.message
		});
	}
};
