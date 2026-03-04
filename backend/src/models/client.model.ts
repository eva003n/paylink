import { sequelize } from "../config/db/postgres";
import { DataTypes, Model } from "sequelize";

export default class Client extends Model {
  declare id?: string;
  declare merchant_id: string;
  declare name: string;
  declare phone_number: string;
  declare email: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

Client.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    merchant_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "merchants",
        key: "id",
      },
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "clients",
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ["email", "phone_number"],
      },
    ],
  },
);
