require("dotenv").config()

process.env.mode =
	process.env.mode === "production" ? "production" : "development";
process.env.port =
	process.env.port || 3000;

const path = require("node:path");
const os = require("node:os");
// const fs = require("node:fs");

const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "./public/static/")));

app.get("/" , (req, res) => {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});

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
	console.log("server listening on port ", process.env.port)
});
