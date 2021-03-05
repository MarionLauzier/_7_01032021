const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(
			token,
			"GroupomaniaGAG_RandomTokenSecretKey"
		);

		const userId_decoded = decodedToken.userId;
		req.tokenUserId = userId_decoded;
		req.tokenIsAdmin = decodedToken.isAdmin;
		const bodyUserId = req.body.userId;
		if (bodyUserId && bodyUserId != userId_decoded) {
			throw "Invalid user ID";
		} else {
			next();
		}
	} catch (error) {
		res.status(401).json({ error: error || "Invalid request !" });
	}
};
