const path = require("node:path");

process.env.mode =
	process.env.mode === "production" ? "production" : "development";

module.exports = {
	entry: {
		index: "./src/index.js",
		auth: "./src/auth.js",
	},
	mode: process.env.mode,
	target: "web",
	devtool: "inline-source-map",
	watch: process.env.mode === "development",
	watchOptions: {
		ignored: [
			"./index.js",
			"./package.json",
			"./package-lock.json",
			"**/modules",
			"**/node_modules",
		],
	},
	stats: "errors-only",
	output: {
		path: path.resolve(__dirname, "public/static/bundle/"),
		filename: "[name].bundle.js",
		publicPath: "/bundle/"
	},
	module: {
		rules: [
			{
				test: /\.s?[ac]ss$/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader"
				]
			},
		]
	}
}
