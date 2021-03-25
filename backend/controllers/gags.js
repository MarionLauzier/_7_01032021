const User = require("../models/user");
const Gag = require("../models/gag");
const Like = require("../models/like");
const Comment = require("../models/comment");
const Sequelize = require("sequelize");
const fs = require("fs");

// create a new gag object and save it to the database if the userId in the body is valid
exports.addGag = (req, res, next) => {
	if (req.UserIsNotValid) {
		return res.status(401).json({ error: req.UserIsNotValid });
	}
	const GagObject = JSON.parse(req.body.gag);
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

// modify a gag and save the new data
exports.updateGag = (req, res, next) => {
	if (req.UserIsNotValid) {
		return res.status(401).json({ error: req.UserIsNotValid });
	}
	//creation of the new object whether a new image file has been provided or not
	const gagObject = req.file
		? {
				...JSON.parse(req.body.gag),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };
	const gag = req.object;
	//recupération du nom de l'ancienne image
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

//delete a gag from the database (image file is also deleted by Gag model hook function)
exports.deleteGag = (req, res, next) => {
	const gag = req.object;
	gag
		.destroy()
		.then(() => res.status(200).json({ message: "Gag was deleted !" }))
		.catch((error) => res.status(400).json({ error }));
};

//manage addition and removal of likes and dislikes
exports.likeGag = (req, res, next) => {
	// case of a new like or dislike
	if (Math.abs(req.body.like) == 1) {
		let opinion = true;
		if (req.body.like == -1) {
			opinion = false;
		}
		// addition of the opinion in the database in case it does not already exists for the given user and the given gag
		Like.findOrCreate({
			where: { userId: req.body.userId, gagId: req.params.id },
			defaults: { isLiked: opinion },
		})
			.then(([like, created]) => {
				if (created) {
					res.status(201).json({ message: "Your opinion is recorded!" });
				} else {
					res.status(403).json({
						error:
							"Sorry you already gave your opinion on this gag, please cancel it before emitting a new one!",
					});
				}
			})
			.catch((error) => res.status(500).json({ error }));
		//case of cancelling an opinion
	} else if (req.body.like == 0) {
		//remove the Like from the database
		Like.destroy({
			where: { userId: req.body.userId, gagId: req.params.id },
			individualHooks: true,
		})
			.then(() =>
				res.status(200).json({ message: "Your opinion was deleted !" })
			)
			.catch((error) => res.status(400).json({ error }));
	} else {
		return res.status(400).json({ error: "Invalid resquest!" });
	}
};
// récupération d'un gag avec le pseudo  de l'auteur et si l'auteur a déjà émis une opinion sur le gag
exports.getTheGag = (req, res, next) => {
	Gag.findByPk(req.params.id, {
		include: [
			{ model: User, attributes: ["pseudo"] },
			{
				model: Like,
				where: { userId: req.tokenUserId },
				attributes: ["isLiked"],
				required: false,
			},
		],
	})
		.then((gag) => res.status(200).json(gag))
		.catch((error) => res.status(404).json({ error }));
};
// récupération des 10 Gags correspondants aux critères des paramètres, par défault les 10 plus récents
exports.getAllGags = (req, res, next) => {
	//select order of the results based on the user choice
	let customOrder = [["createdAt", "DESC"]];
	switch (req.query.sort) {
		case "popular":
			customOrder.unshift(["likes", "DESC"]);
			break;
		case "unpopular":
			customOrder.unshift(["dislikes", "DESC"]);
			break;
		case "comment":
			customOrder.unshift(["nbcomments", "DESC"]);
			break;
		case "recent":
			break;
		default:
			break;
	}
	// calculate offset of results based on page number
	const offset = req.query.page ? (parseInt(req.query.page) - 1) * 10 : 0;
	// contenu recherché dans la description (recherche FULLTEXT)
	const search = req.query.search
		? Sequelize.literal(
				"MATCH (Gag.description) AGAINST ('" + req.query.search + "')"
		  )
		: {};
	Gag.findAll({
		where: search,
		include: [
			{ model: User, attributes: ["pseudo"] },
			{
				// add whether the current user already liked/disliked or not the gag
				model: Like,
				where: { userId: req.tokenUserId },
				attributes: ["isLiked"],
				required: false,
			},
		],
		order: customOrder,
		limit: 10,
		offset: offset,
	})
		.then((gags) => res.status(200).json(gags))
		.catch((error) => res.status(404).json({ error }));
};
