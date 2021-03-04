const bcrypt = require("bcrypt");
const User = require("../models/user");
//a voir si utile
const Gag = require("../models/gag");
const Like = require("../models/like");
const Comment = require("../models/comment");
const jwt = require("jsonwebtoken");
const passwordValidator = require("password-validator");
var passwordCheck = new passwordValidator();
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

exports.signup = (req, res, next) => {
	if (!req.body.email.endsWith("@groupomania.com")) {
		return res.status(400).json({
			error: "Email adress is not valid! Please use your work email!",
		});
	} else {
		if (passwordCheck.validate(req.body.password)) {
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
		if (user === null) {
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
	//user must be logged in in order to unsuscribe, hence his request will arrive with an authorization token
	// const token = req.headers.authorization.split(" ")[1];
	// const decodedToken = jwt.verify(token, "GroupomaniaGAG_RandomTokenSecretKey");
	// const tokenUserId = decodedToken.userId;
	User.destroy({ where: { _id: req.params.userid } })
		.then(() => res.status(200).json({ message: "Account deleted!" }))
		.catch((error) => res.status(400).json({ error }));
	//delete by cascade all comments, likes, and gags (and comments and likes associated to the gag) of the user
};
