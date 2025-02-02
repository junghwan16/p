const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validators/authValidator");

router.get("/login", authController.getLoginPage);
router.post("/login", validate(loginSchema), authController.login);

router.get("/register", authController.getRegisterPage);
router.post("/register", validate(registerSchema), authController.register);

router.post("/logout", authController.logout);

module.exports = router;
