import "./style/style.scss";
import "./style/index.scss";

import $  from "jquery";

import { io } from "socket.io-client";

const socket = io();

$("#keys")
	.on("click", "button", function() {
		socket.emit("key", $(this).attr("class"));
	});

let startPosition = { x: 0, y: 0 };
$("#mouse")
	.on("touchstart", "#pad", function(event) {
		startPosition = {
			x: event.touches[0].clientX - ($(this).width() / 2),
			y: event.touches[0].clientY - ($(this).height() / 2)
		};
		console.log("start", startPosition);
	})
	.on("touchmove", "#pad", function(event) {
		const { clientX, clientY } = event.touches[0];
		const direction = {
			x: (clientX - ($(this).width() / 2)) - startPosition.x,
			y: (clientY - ($(this).height() / 2)) - startPosition.y
		};
		console.log("direction", direction);
		socket.emit("mouse-position", { x: direction.x, y: direction.y });
	})
	.on("click", "#pad", function() {
		socket.emit("mouse", "left");
	})
	.on("click", "button", function() {
		socket.emit("mouse", $(this).attr("class"));
	});

$("#keyboard")
	.on("click", "button", function() {
		socket.emit("key", $(this).attr("class"));
	})
	.on("keyup", "input", function(event) {
		let key = $(this).val();
		switch(event.key) {
			case "Enter":
			case "Backspace":
				key = event.key.toLowerCase();
				break;
		};
		console.log(key);
		socket.emit("key", key);
		$(this).val("");
	});
