require("dotenv").config()

process.env.mode =
	process.env.mode === "production" ? "production" : "development";
process.env.port =
	process.env.port || 3000;

const Lib = require("./lib/");

process.env.code = Lib.code();

const path = require("node:path");
const os = require("node:os");
// const fs = require("node:fs");

const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./public/"));
app.use(express.json({ limit: "5mb", urlencoded: false, extended: true, encoding: "utf-8" }));
app.use(express.static(path.join(__dirname, "./public/static/")));

const expire = (1000 * 60 * 60);
const session = require("express-session");
app.use(session({
	cookieName: "secret",
	secret: "1m4Qio5OPd8cMJBEWTKylTaJUZ8hzFv3",
	resave: false,
	saveUninitialized: true,
	httpOnly: true,
	secure: true,
	ephemeral: true,
	expires: new Date(Date.now() + expire),
	cookie: {
		maxAge: expire
	}
}));

app.use((req, res, next) => {
	if(!req.session.user) {
		const user = Lib.users.create(req.sessionID);
		req.session.user = user;
	}
	if(!req.session.user.authenticated && req.url !== "/auth") {
		res.status(301).redirect("/auth");
	} else {
		next();
	}
});

app.get("/" , (req, res) => {
	res.render("index");
});

require("./routes/")(app);

const http = require("node:http").createServer(app);

const { Server } = require("socket.io");
const io = new Server(http);

const robot = require("robotjs");

io.on("connection", socket => {
	socket.on("mouse-position", ({ x, y }) => {
		const intensity = .125;
		const { x: cx, y: cy } = robot.getMousePos();
		const position = { x: ((x * intensity) + cx), y: ((y * intensity) + cy) };
		console.log(position);
		robot.moveMouse(position.x, position.y);
	});
	socket.on("mouse", key => {
		const scrollIntensity = 5;
		switch(key) {
			case "left":
			case "right":
				robot.mouseClick(key);
				break;
			case "up":
				robot.scrollMouse(0, scrollIntensity);
				break;
			case "down":
				robot.scrollMouse(0, -scrollIntensity);
				break;
		}
	});
	socket.on("key", key => {
		try {
			robot.keyTap(key);
		} catch (error) {
			console.log(key);
			console.log(error);
		}
	});
});

const qrCode = require("qrcode");
http.listen(process.env.port, () => {
	if(process.env.mode === "production") {
		const interfaces = Object.keys(os.networkInterfaces())
			.filter(i => i !== "lo");
		const adress = os.networkInterfaces()[interfaces[0]][0].address;
		qrCode.toString(`http://${adress}:${process.env.port}`, { type: "terminal" }, (error, url) => {
			if(error) {
				console.log(error);
				return;
			}
			console.log(url);
		});
	} else {
		console.log("server listening on port ", process.env.port)
	}

	console.log(process.env.code);

});
