import { DataTypes } from "sequelize";
import { QueryInterface } from "sequelize";

async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.createTable("clients", {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
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
  await queryInterface.dropTable("clients");
}

export { up, down };
