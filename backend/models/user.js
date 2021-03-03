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
		pseudo: { type: DataTypes.STRING(20), allowNull: false, unique: true },
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: { isEmail: true },
		},
		password: { type: DataTypes.STRING, allowNull: false },
		departement: { type: DataTypes.STRING(20) },
		isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
	},
	{ sequelize: db, modelName: "User", tableName: "Users" }
);
//Sequelize automatically adds the timestamp columns createdAt and updatedAt

module.exports = User;
