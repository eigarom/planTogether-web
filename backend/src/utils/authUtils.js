const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function generateToken(user) {
	return jwt.sign({
		email: user.email,
		userId: user.userId,
		familyId: user.familyId
	}, process.env.JWT_SECRET);
}

async function isValidPassword(password, user) {
	return await bcrypt.compare(password, user.password);
}

async function hashPassword(password) {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
}

module.exports = {
	generateToken,
	isValidPassword,
	hashPassword
};
