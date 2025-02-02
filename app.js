const express = require("express");
const session = require("express-session");
const path = require("node:path");
const app = express();
const logger = require("./logger/logger");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: process.env.SESSION_SECRET || "your-secret-key",
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 1000 * 60 * 60, // 1시간
		},
	}),
);

app.use("/auth", authRouter);
app.use("/user", userRouter);

// 에러 발생 시 로그 기록 후 응답
app.use((err, req, res, next) => {
	logger.error(err);
	res.status(500).json({ message: "서버 에러" });
});

module.exports = app;
