const Gag = require("../models/gag");

module.exports = (req, res, next) => {
	Gag.findByPk(req.params.id).then((gag) => {
		if (
			gag.userId == req.tokenUserId ||
			(req.method == "DELETE" && req.tokenIsAdmin)
		) {
			req.gag = gag;
			next();
		} else {
			return res
				.status(403)
				.json({ error: "You are not authorized to modify this gag!" });
		}
	});
};
