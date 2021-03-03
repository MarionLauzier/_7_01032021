const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("../config/db-config");

class User extends Model {}
User.init(
	{
		_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		pseudo: { type: DataTypes.STRING(20), allowNull: false },
		email: { type: DataTypes.STRING, allowNull: false },
		password: { type: DataTypes.STRING, allowNull: false },
		departement: { type: DataTypes.STRING(20) },
		isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
	},
	{ sequelize: db, modelName: "User", tableName: "Users" }
);
//Sequelize automatically adds the timestamps column createdAt and updatedAt

module.exports = User;
