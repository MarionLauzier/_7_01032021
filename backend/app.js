const express = require("express");

const bodyParser = require("body-parser");

const gagRoutes = require("./routes/gags");
const userRoutes = require("./routes/users");
const path = require("path");
const db = require("./config/db-config");

const app = express();

//connexion et synchronisation de la base de données
db.authenticate()
	.then(() => {
		console.log("Database connected...");
		db.sync().then(() => console.log("Database synchronized..."));
	})
	.catch((err) => console.log("error: " + err));

// paramétrage des en-tête des autorisations
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/gag", gagRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
