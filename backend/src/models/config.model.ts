import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db/postgres";
import { ConfigEnv, configEnvSchema } from "@shared/schemas/validators";

export class Config extends Model {
  declare id: string;
  declare merchant_id: string;
  declare env: ConfigEnv;
  declare consumer_key: string;
  declare consumer_secret: string;
  declare short_code: string;
  declare pass_Key: string;
  declare callback_url: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

Config.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    merchant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "merchants",
        key: "id",
      },
    },
    env: {
      type: DataTypes.ENUM(...Object.values(configEnvSchema.enum)),
      allowNull: false,
      defaultValue: configEnvSchema.enum.Sandbox
    },
    consumer_key: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    consumer_secret: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    short_code: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    pass_Key: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    callback_url: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
  },
  {
    tableName: "configs",
    sequelize,
    indexes: [
      {
        fields: ["merchant_id"],
        unique: true,
      },
    ],
  },
);
