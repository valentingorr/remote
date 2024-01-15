const fs = require("node:fs");
const path = require("node:path");

module.exports = fs.readdirSync(path.resolve(__dirname, "./content/"))
	.map(file => [
		file.replace(/^(.*)\..*$/, "$1"),
		require(path.resolve(__dirname, `./content/${file}`))
	])
	.reduce((c, a) => {
		c[a[0]] = a[1];
		return c;
	}, {});
