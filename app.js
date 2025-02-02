const express = require("express");
const app = express();
const logger = require("./logger/logger");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/user", userRouter);

// 에러 발생 시 로그 기록 후 응답
app.use((err, req, res, next) => {
	logger.error(err);
	res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
