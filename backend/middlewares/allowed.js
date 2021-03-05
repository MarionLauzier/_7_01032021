const { createPool } = require("mysql2/promise");
const Gag = require("../models/gag");
const Comment = require("../models/comment");

module.exports = (req, res, next) => {
	let table, param;
	if (req.path.includes("comment")) {
		table = Comment;
		param = req.params.comid;
	} else {
		table = Gag;
		param = req.params.id;
	}
	table
		.findByPk(param)
		.then((object) => {
			//console.log(object.userId);
			if (
				object.userId == req.tokenUserId ||
				(req.method == "DELETE" && req.tokenIsAdmin)
			) {
				req.object = object;
				next();
			} else {
				return res
					.status(403)
					.json({ error: "You are not authorized to modify this gag!" });
			}
		})
		.catch((error) => res.status(404).json({ error }));
};
