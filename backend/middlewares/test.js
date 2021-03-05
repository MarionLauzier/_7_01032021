module.exports = (req, res, next) => {
	setTimeout(() => {
		const test = JSON.parse(req.body.gag);
		console.log(test);
		next();
	}, 5000);
};
