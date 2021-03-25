const jwt = require("jsonwebtoken");

//first middleware for all gags routes
module.exports = (req, res, next) => {
	try {
		//check the validity and decode the token
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(
			token,
			"GroupomaniaGAG_RandomTokenSecretKey"
		);

		const userId_decoded = decodedToken.userId;
		// create two req variables to pass on token data to the following middlewares
		req.tokenUserId = userId_decoded;
		req.tokenIsAdmin = decodedToken.isAdmin;
		// in case of userId provided in the body of the request it should be identical to the one contained in the token
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
