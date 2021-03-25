const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const passwordValidator = require("password-validator");
const Gag = require("../models/gag");
const Comment = require("../models/comment");
const Like = require("../models/like");
var passwordCheck = new passwordValidator();
// strength parameters of password
passwordCheck
	.is()
	.min(8) // Minimum length 8
	.is()
	.max(30) // Maximum length 30
	.has()
	.uppercase() // Must have uppercase letters
	.has()
	.lowercase() // Must have lowercase letters
	.has()
	.digits() // Must have digit
	.has()
	.symbols() // Must have symbol
	.has()
	.not()
	.spaces(); // Should not have spaces

// Manage Sign up of a new user
exports.signup = (req, res, next) => {
	// use of a work email ending with @groupomania.com
	if (!req.body.email.endsWith("@groupomania.com")) {
		return res.status(400).json({
			error: "Email adress is not valid! Please use your work email!",
		});
	} else {
		//check strength of password and hashing password
		if (passwordCheck.validate(req.body.password)) {
			bcrypt
				.hash(req.body.password, 10)
				.then((hash) => {
					//creating and saving the new user to the database
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

//Manage login of a User
exports.login = (req, res, next) => {
	//Find user in the database with the provided email
	User.findOne({ where: { email: req.body.email } }).then((user) => {
		if (user === null) {
			return res.status(401).json({ error: "User not found!" });
		}
		//checking the password
		bcrypt.compare(req.body.password, user.password).then((valid) => {
			if (!valid) {
				return res.status(401).json({ error: "Incorrect Password!" });
			}
			//sending back response the user containing its id, its admin rights, its token
			res.status(200).json({
				userId: user._id,
				isAdmin: user.isAdmin,
				token: jwt.sign(
					{ userId: user._id, isAdmin: user.isAdmin },
					"GroupomaniaGAG_RandomTokenSecretKey",
					{ expiresIn: "12h" }
				),
			});
		});
	});
};

// manage the removal of a user
exports.unsuscribe = (req, res, next) => {
	//user must be logged in in order to unsuscribe, hence his request will arrive with an authorization token
	if (req.tokenUserId == req.params.userid) {
		//deleting gags of the user
		Gag.destroy({ where: { userId: req.params.userid }, individualHooks: true })
			.then(() =>
				//deleting comments of the user
				Comment.destroy({
					where: { userId: req.params.userid },
					individualHooks: true,
				})
					.then(() =>
						//deleting likes of the user
						Like.destroy({
							where: { userId: req.params.userid },
							individualHooks: true,
						})
							.then(() =>
								//deleting the user itself
								User.destroy({ where: { _id: req.params.userid } })
									.then(() =>
										res.status(200).json({ message: "Account deleted!" })
									)
									.catch((error) => res.status(400).json({ error }))
							)
							.catch((error) => res.status(400).json({ error }))
					)
					.catch((error) => res.status(400).json({ error }))
			)
			.catch((error) => res.status(400).json({ error }));
	} else {
		return res
			.status(401)
			.json({ error: "You are not allowed to delete this profile!" });
	}
	//comments and likes associated to destroyed gags are deleted by cascade
};

//get user profile : infos and the 10 most recent associated gags
exports.getProfile = (req, res, next) => {
	let fields = ["pseudo", "departement", "createdAt"];
	if (req.params.userid == req.tokenUserId) {
		fields.unshift("email");
	}
	User.findByPk(req.params.userid, {
		attributes: fields,
		include: {
			model: Gag,
			required: false,
			order: [["createdAt", "DESC"]],
			limit: 10,
			include: [
				{ model: User, attributes: ["pseudo"] },
				{
					model: Like,
					where: { userId: req.tokenUserId },
					attributes: ["isLiked"],
					required: false,
				},
			],
		},
	})
		.then((profile) => res.status(201).json(profile))
		.catch((error) => res.status(404).json({ error }));
};
