const express = require("express");
const session = require("express-session");
const { ConnectSessionKnexStore } = require("connect-session-knex");
const path = require("node:path");
const knex = require('./db/knex');
const logger = require("./logger/logger");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
const store = new ConnectSessionKnexStore({
	knex,
	tablename: "sessions",
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: "keyboard cat",
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		},
		store,
		resave: false,	          // 세션 데이터가 변경되지 않으면 저장하지 않음
		saveUninitialized: true,	// 세션이 필요하기 전까지는 세션을 생성하지 않음
	}),
);

app.get("/", authMiddleware, (req, res) => {
	const n = req.session.views || 0;
	req.session.views = n + 1;
	res.end(`${n} views`);
});

app.use("/auth", authRouter);
app.use("/user", userRouter);

// 에러 발생 시 로그 기록 후 응답
app.use((err, req, res, next) => {
	logger.error(err);
	res.render("error");	// 서버 에러는 별도의 메시지를 보여주지 않는게 좋음.
});

module.exports = app;
