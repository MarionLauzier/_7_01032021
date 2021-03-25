const Gag = require("../models/gag");
const Comment = require("../models/comment");

module.exports = (req, res, next) => {
	//for updates or deleting of comments or gags, the object is found first based on the url params and the userid of the object is checked against the userid of the token to allow to get to the controller.
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
			if (
				object.userId == req.tokenUserId ||
				// an exception is allowed in case of a delete for the users with admin rights
				(req.method == "DELETE" && req.tokenIsAdmin)
			) {
				//the object is directly passed on the controller to avoid a new search in the database
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
