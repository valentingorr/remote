import "./style/style.scss";
import "./style/auth.scss";

import axios from "axios";

window.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector("form");
	const inputs = Array.from(form.querySelectorAll("form input"));
	for(const input of inputs) {
		const i = parseInt(input.getAttribute("i"));
		input.addEventListener("keyup", () => {
			const next = document.querySelector(`form input[i="${i + 1}"]`);
			if(next) next.focus();
			else document.querySelector("form").submit();
		});
	};

	form.addEventListener("submit", event => {
		event.preventDefault();
		axios({
			method: "post",
			url: "/api/auth",
			data: {
				code: inputs.reduce((c, a) => {
					c += a.value;
					return c;
				}, "")
			}
		})
	});

});
