import { labelCases } from "../../../../utils";
import { DataTypes } from "sequelize";
import { sequelize } from ".";
// * Models import
import {
  User,
  user_schema,
  user_table,
} from "../../../../modules/users/infrastructure/models/sequelize";

const joinTableNames: any = {};
const joinTableSchema: any = {};

const createJoinTable = (A: any, B: any) => {
  A = A.tableName || A;
  B = B.tableName || B;

  const join_table_name = `${labelCases(A).CP}_${labelCases(B).CP}`;
  joinTableNames[`${labelCases(join_table_name).LP}_table`] = join_table_name;

  const join_table_schema = {
    uuid: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    [`${labelCases(A).LS}UUID`]: {
      field: `${labelCases(A).LS}_uuid`,
      unique: false,
      allowNull: false,
      type: DataTypes.STRING,
      references: {
        model: labelCases(A).CP,
        key: "uuid",
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      },
    },
    [`${labelCases(B).LS}UUID`]: {
      field: `${labelCases(B).LS}_uuid`,
      unique: false,
      allowNull: false,
      type: DataTypes.STRING,
      references: {
        model: labelCases(B).CP,
        key: "uuid",
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      },
    },
  };
  joinTableSchema[`${labelCases(join_table_name).LP}_schema`] =
    join_table_schema;

  return {
    [join_table_name]: sequelize.define(join_table_name, join_table_schema, {
      createdAt: false,
      updatedAt: false,
    }),
  };
};

export const models: any = {
  User,
};

export const tableNames = {
  user_table,
  ...joinTableNames,
};

export const tableSchemas = {
  user_schema,
  ...joinTableSchema,
};

// export default models;
