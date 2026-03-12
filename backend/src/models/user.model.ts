import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db/postgres";
import {hash} from "bcryptjs"
export enum UserRoles {
  MERCHANT = "merchant",
  ADMIN = "admin",
}
export class User extends Model {
  declare id: string;
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: UserRoles;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  public static async hashPassword(instance: User) {
    if(instance.changed("password")) {
      instance.password = await hash(instance.password, 12)
    }

  }

  public static async validatePassword() {

  }

  public override toJSON(showHidden = false): object {
    const attributes = {...this.get()} as any

    if(!showHidden) {
      delete attributes.email
    }

    delete attributes.password

    return attributes
    
  }
}

User.init(
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRoles)),
      allowNull: false,
      defaultValue: UserRoles.MERCHANT,
    },
  },
  {
    tableName: "users",
    sequelize,

    indexes: [
      {
        unique: true,
        fields: ["email", "refresh_token"],
      },
    ],
  },
);

// hash password for new users and updating users
User.beforeCreate(User.hashPassword)
User.beforeUpdate(User.hashPassword)