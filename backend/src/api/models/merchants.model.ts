import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db/postgres";
import { hash } from "bcryptjs";
export enum UserRoles {
  MERCHANT = "merchant",
  ADMIN = "admin", // for the admin u would create their own table but for simplicity thus combination
}
export class Merchant extends Model {
  declare id: string;
  declare business_name: string;
  declare email: string;
  declare password: string;
  declare phone_number: string;
  declare role: UserRoles;
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
      type: DataTypes.ENUM(...Object.values(UserRoles)),
      allowNull: false,
      defaultValue: UserRoles.MERCHANT,
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
