const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("../config/db-config");
const User = require("./user");
const fs = require("fs");

class Gag extends Model {}
Gag.init(
	{
		_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		description: { type: DataTypes.STRING },
		imageUrl: { type: DataTypes.STRING, allowNull: false },
		userId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: { model: User, key: "_id" },
			onDelete: "restrict",
		},
		// compteurs à garder ou pas ... comment mettre à jour avec unsuscribe par ex.
		likes: { type: DataTypes.INTEGER.UNSIGNED },
		dislikes: { type: DataTypes.INTEGER.UNSIGNED },
		nbComments: { type: DataTypes.INTEGER.UNSIGNED },
	},
	{
		hooks: {
			beforeDestroy: (gag, options) => {
				const filename = gag.imageUrl.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {});
			},
		},
		sequelize: db,
		modelName: "Gag",
		tableName: "Gags",
	}
);
//Sequelize automatically adds the timestamp columns createdAt and updatedAt

module.exports = Gag;
