const bcrypt = require("bcrypt");
const User = require("../models/user");
const Gag = require("../models/gag");
const Like = require("../models/like");
const Comment = require("../models/comment");
const jwt = require("jsonwebtoken");
const passwordStrength = require("check-password-strength");

exports.signup = (req, res, next) => {
	if (!req.body.email.endsWith("@groupomania.com")) {
		return res.status(400).json({
			error: "Email adress is not valid! Please use your work email!",
		});
	} else {
		//vérifier la dispo du pseudo
		if (passwordStrength(req.body.password).value == "strong") {
			bcrypt
				.hash(req.body.password, 10)
				.then((hash) => {
					User.create({ ...req.body, password: hash })
						.then(() => res.status(201).json({ message: "User created !" }))
						.catch((error) => res.status(400).json({ error }));
				})
				.catch((error) => res.status(500).json({ error }));
		} else {
			return res.status(400).json({ error: "Password is not strong enough!" });
		}
	}
};
exports.login = (req, res, next) => {
	User.findOne({ where: { email: req.body.email } }).then((user) => {
		if (!user) {
			return res.status(401).json({ error: "User not found!" });
		}
		bcrypt.compare(req.body.password, user.password).then((valid) => {
			if (!valid) {
				return res.status(401).json({ error: "Incorrect Password!" });
			}
			res.status(200).json({
				userId: user._id,
				token: jwt.sign(
					{ userId: user._id, isAdmin: user.isAdmin },
					"GroupomaniaGAG_RandomTokenSecretKey",
					{ expiresIn: "12h" }
				),
			});
		});
	});
};
exports.unsuscribe = (req, res, next) => {
	User.destroy({ where: { _id: req.body.userId } })
		.then(() => res.status(200).json({ message: "Account deleted!" }))
		.catch((error) => res.status(400).json({ error }));
	//delete by cascade all comments, likes, and gags (and comments and likes asoociated to the gag) of the user
};
