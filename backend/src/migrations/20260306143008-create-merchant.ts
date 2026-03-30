import { DataTypes } from "sequelize";
import { QueryInterface } from "sequelize";
import { UserRoles } from "../models/index";

async function up({ context: queryInterface }: { context: QueryInterface }) {
  queryInterface.createTable("merchants", {
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
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    business_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRoles)),
      allowNull: false,
      defaultValue: UserRoles.MERCHANT,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
}

async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.dropTable("merchants");
}

export { up, down };
