const userController = require("../../controllers/userController");

describe("userController", () => {
	let req;
	let res;

	beforeEach(() => {
		req = {};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
	});

	test("인증 미실시 시 401 반환", async () => {
		req.user = undefined;
		await userController.getProfile(req, res);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: "인증 필요" });
	});

	test("인증된 사용자 프로필 반환", async () => {
		req.user = { id: 1, username: "user" };
		await userController.getProfile(req, res);
		expect(res.json).toHaveBeenCalledWith({ id: 1, username: "user" });
	});
});
