import { configEnvSchema } from "@paylink/shared";
import { DataTypes } from "sequelize";
import { QueryInterface } from "sequelize";

async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.createTable("configs", {
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
      defaultValue: configEnvSchema.enum.Sandbox,
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
  await queryInterface.dropTable("configs");
}

export { up, down };
