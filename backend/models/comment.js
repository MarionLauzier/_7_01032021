const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("../config/db-config");
const User = require("./user");
const Gag = require("./gag");

class Comment extends Model {}
Comment.init(
	{
		_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		content: { type: DataTypes.STRING, allowNull: false },
		userId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: { model: User, key: "_id" },
			onDelete: "cascade",
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
			beforeDestroy: (comment, options) => {
				Gag.decrement("nbComment", { where: { _id: comment.userId } });
			},
		},
		sequelize: db,
		modelName: "Comment",
		tableName: "Comments",
	}
);
//Sequelize automatically adds the timestamp columns createdAt and updatedAt

module.exports = Comment;
