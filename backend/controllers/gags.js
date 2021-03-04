const Gag = require("../models/gag");
const Like = require("../models/like");
const Comment = require("../models/comment");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { restore } = require("../models/gag");

exports.addGag = (req, res, next) => {
	const GagObject = JSON.parse(req.body.gag);
	//console.log(GagObject);
	delete GagObject._id;
	Gag.create({
		...GagObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
		likes: 0,
		dislikes: 0,
		nbComments: 0,
	})
		.then(() => res.status(201).json({ message: "Gag created !" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.updateGag = (req, res, next) => {
	const gagObject = req.file
		? {
				...JSON.parse(req.body.gag),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };
	const gag = req.gag;
	const oldImage = gag.imageUrl.split("/images/")[1];
	//mise à jour de l'objet
	gag
		.update({ ...gagObject, _id: req.params.id })
		.then(() => {
			//suppression de l'ancienne photo dans le cas ou une nouvelle est chargée
			if (req.file) {
				fs.unlink(`images/${oldImage}`, (err) => {
					if (err) throw err;
				});
			}
			res.status(200).json({ message: "Gag modified !" });
		})
		.catch((error) => res.status(400).json({ error }));
};

exports.deleteGag = (req, res, next) => {
	const gag = req.gag;
	const filename = gag.imageUrl.split("/images/")[1];
	//delete the image file
	fs.unlink(`images/${filename}`, () => {
		//delete the gag from the database
		gag
			.destroy()
			.then(() => res.status(200).json({ message: "Gag deleted !" }))
			.catch((error) => res.status(400).json({ error }));
	});
};

exports.likeGag = (req, res, next) => {};
exports.commentGag = (req, res, next) => {
	delete req.body._id;
	Comment.create({
		...req.body,
		gagId: req.params.id,
	})
		.then(() => res.status(201).json({ message: "Comment created !" }))
		.catch((error) => res.status(400).json({ error }));
};
exports.updateCommGag = (req, res, next) => {};
exports.deleteCommGag = (req, res, next) => {};

//récupération d'un gag
exports.getTheGag = (req, res, next) => {
	Gag.findByPk(req.params.id)
		.then((gag) => res.status(200).json(gag))
		.catch((error) => res.status(404).json({ error }));
};
// récupération de tous les Gag
exports.getAllGags = (req, res, next) => {
	Gag.findAll()
		.then((gags) => res.status(200).json(gags))
		.catch((error) => res.status(404).json({ error }));
};
