const fs = require("node:fs");
const path = require("node:path");

module.exports = app => {
	fs.readdirSync(path.resolve(__dirname, "./content/"))
		.map(file => [
			file.replace(/^(.*)\..*$/, "$1"),
			require(path.resolve(__dirname, `./content/${file}`))
		])
		.forEach(content => app.use(`/${content[0]}`, content[1]));
}
