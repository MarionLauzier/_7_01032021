module.exports = (req, res, next) => {
	const test = JSON.parse(req.body.gag);
	console.log(test);
	next();
};
