const multer = require("multer");

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
		const bodyUserId = JSON.parse(req.body.gag).UserId; //u
		if (bodyUserId && req.tokenUserId == bodyUserId) {
			callback(null, true);
		}
		if (bodyUserId && req.tokenUserId != bodyUserId) {
			req.UserIsNotValid = "Invalid User ID!";
			callback(null, false);
		}
		callback(null, false);
	},
}).single("image");
