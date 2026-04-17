import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db/postgres";
import { hash } from "bcryptjs";
import { userRoleSchema, type UserRole } from "@paylink/shared";

export class Merchant extends Model {
  declare id: string;
  declare business_name: string;
  declare email: string;
  declare password: string;
  declare phone_number: string;
  declare role: UserRole;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  public static async hashPassword(instance: Merchant) {
    if (instance.changed("password")) {
      instance.password = await hash(instance.password, 12);
    }
  }

  public static async validatePassword() {}

  public override toJSON(showHidden = false): object {
    const attributes = { ...this.get() } as any;

    // if(!showHidden) {
    //   delete attributes.email
    // }

    delete attributes.email;

    delete attributes.password;

    return attributes;
  }
}

Merchant.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    business_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    role: {
      type: DataTypes.ENUM(...Object.values(userRoleSchema.enum)),
      allowNull: false,
      defaultValue: userRoleSchema.enum.Merchant,
    },
  },
  {
    tableName: "merchants",
    sequelize,

    indexes: [
      {
        unique: true,
        fields: ["email", "business-name"],
      },
    ],
  },
);

// hash password for new users and updating users
Merchant.beforeCreate(Merchant.hashPassword);
Merchant.beforeUpdate(Merchant.hashPassword);
