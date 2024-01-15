const { v4: uuid } = require("uuid");

const users = new Array();

class User {
	constructor(sessionID) {
		this.token = uuid();
		this.sessionID = sessionID;
	}
};

module.exports = new Proxy(users, {
	get(target, prop) {
		const methods = {
			"create": sessionID => {
				const user = new User(sessionID);
				users.push(user);
				return user;
			},
			"list": () => {
				return target;
			}
		};
		if(Object.keys(methods).includes(prop)) {
			return (...args) => methods[prop](...args);
		}
	}
});
