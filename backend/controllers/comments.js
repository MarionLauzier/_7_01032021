const Comment = require("../models/comment");
const User = require("../models/user");

//build and save a new comment based on the data received
exports.commentGag = (req, res, next) => {
	delete req.body._id;
	Comment.create({
		...req.body,
		gagId: req.params.id,
	})
		.then(() => res.status(201).json({ message: "Comment is created !" }))
		.catch((error) => res.status(400).json({ error }));
};

//modify and save the new content of the comment
exports.updateCommGag = (req, res, next) => {
	const comment = req.object;
	delete req.body._id;
	comment
		.update({ ...req.body })
		.then(() => {
			res.status(200).json({ message: "Comment is modified !" });
		})
		.catch((error) => res.status(400).json({ error }));
};

//delete a comment from the database
exports.deleteCommGag = (req, res, next) => {
	const comment = req.object;
	comment
		.destroy()
		.then(() => res.status(200).json({ message: "Comment was deleted !" }))
		.catch((error) => res.status(400).json({ error }));
};

//get all comments for a given gag
exports.getAllCommGag = (req, res, next) => {
	Comment.findAll({
		where: { gagId: req.params.id },
		include: { model: User, attributes: ["pseudo"] },
		order: [["createdAt", "DESC"]],
	})
		.then((comments) => res.status(200).json(comments))
		.catch((error) => res.status(400).json({ error }));
};
