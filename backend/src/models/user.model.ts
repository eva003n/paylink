import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db/postgres";

export enum UserRoles {
  MERCHANT= "merchant",
  ADMIN = "admin"
}
export class User extends Model {
  declare id?: string;
  declare username: string;
  declare clerk_id: string;
 declare role: UserRoles;
  // declare short_code: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    clerk_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRoles)),
      allowNull: false,
      defaultValue: UserRoles.MERCHANT
    },
  },
  {
    tableName: "users",
    sequelize,

    indexes: [
      {
        unique: true,
        fields: ["username", "clerk_id", "email"],
      },
    ],
  },
);
