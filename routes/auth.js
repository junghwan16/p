const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validate = require("../validators/validate");
const { registerSchema, loginSchema } = require("../validators/authValidator");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
