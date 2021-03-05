const multer = require("multer");
var createError = require("http-errors");

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "images");
	},
	filename: (req, file, callback) => {
		callback(null, Date.now() + file.originalname);
	},
});

module.exports = multer({
	storage: storage,
	fileFilter: (req, file, callback) => {
		const bodyUserId = JSON.parse(req.body.gag).userId;
		if (req.tokenUserId == bodyUserId) {
			callback(null, true);
		}
		if (bodyUserId && req.tokenUserId != bodyUserId) {
			//return callback(new Error("Invalid request"));
			return callback(createError(401, "Pas authentifié!"));
		}
		callback(null, false);
	},
}).single("image");
