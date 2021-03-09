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
			onDelete: "restrict",
		},
		gagId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: { model: Gag, key: "_id" },
			onDelete: "cascade",
		},
	},
	{
		hooks: {
			afterCreate: (like, options) => {
				let count;
				if (like.isLiked) {
					count = "likes";
				} else {
					count = "dislikes";
				}
				Gag.increment(count, { where: { _id: like.gagId } });
			},
			beforeDestroy: (like, options) => {
				let count;
				if (like.isLiked) {
					count = "likes";
				} else {
					count = "dislikes";
				}
				Gag.decrement(count, { where: { _id: like.gagId } });
			},
		},
		sequelize: db,
		modelName: "Like",
		tableName: "Likes",
	}
);
//Sequelize automatically adds the timestamp columns createdAt and updatedAt

module.exports = Like;
