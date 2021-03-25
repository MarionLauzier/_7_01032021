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
		//in case of a file provided in the body the content of the body cannot be accessed before the multer, hence the authentification of the userId contained in the body is performed here and prevent the storage of the file if the userid does not match the token's userid.
		const bodyUserId = JSON.parse(req.body.gag).userId;
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
