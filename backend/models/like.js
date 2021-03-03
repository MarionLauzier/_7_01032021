const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("../config/db-config");
const User = require("./user");
const Gag = require("./gag");

class Like extends Model {}
Like.init(
	{
		_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		isLiked: { type: DataTypes.BOOLEAN, allowNull: false },
		userId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: { model: User, key: "_id" },
		},
		gagId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: { model: Gag, key: "_id" },
		},
	},
	{ sequelize: db, modelName: "Like", tableName: "Likes" }
);
//Sequelize automatically adds the timestamps column createdAt and updatedAt

module.exports = Like;
