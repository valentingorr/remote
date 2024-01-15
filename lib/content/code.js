const length = 4;
const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

module.exports = () => {
	let code = "";
	for (let i = 0; i < length; i++) {
		code += nums[Math.floor(Math.random() * nums.length)];
	}
	return code;
}
