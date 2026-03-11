import { DataTypes } from "sequelize";
import { QueryInterface } from "sequelize";
import { UserRoles } from "../models/index";

async function up({ context: queryInterface }: { context: QueryInterface }) {
  queryInterface.createTable("users", {
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

  });
}

async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.dropTable("users");
}

export { up, down };
