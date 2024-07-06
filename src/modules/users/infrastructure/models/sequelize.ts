import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../../../services/DatabaseServices/SequelizeAdapter/infrastructure";

export const user_table = "Users";
export const user_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  username: {
    unique: true,
    allowNull: false,
    type: DataTypes.STRING,
  },
  email: { allowNull: true, unique: true, type: DataTypes.STRING },
  password: { allowNull: false, type: DataTypes.STRING },
  privilege: { type: DataTypes.ENUM, values: ["user", "admin"] },
  avatar: { type: DataTypes.STRING, allowNull: true },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "created_at",
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "updated_at",
  },
};
// export const User = sequelize.define(user_table, user_schema);
export class User extends Model {
  static associate(models: any) {}
}

User.init(user_schema, { sequelize, modelName: user_table });
