const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("auth");
});

router.post("/", [
	body("code").isLength({ min: 4, max: 4 }).withMessage("Code must be 4 digits long."),
	body("code").isNumeric().withMessage("Code must be numeric."),
], (req, res) => {
		console.log(req.body);
		// const errors = validationResult(req);
		// console.log(errors);
		res.json({ status: "ok" });
});

module.exports = router;
