const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthServices {
	static async generateToken(user) {
		return jwt.sign({
			email: user.email,
			userId: user.userId,
			familyId: user.familyId
		}, process.env.JWT_SECRET);
	};

	static async isValidPassword(password, user) {
		return await bcrypt.compare(password, user.password);
	};
}

module.exports = AuthServices;