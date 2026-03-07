import { DataTypes } from "sequelize";
import {QueryInterface} from "sequelize"
import { LinkStatus } from "../models/index";

 async function up({ context: queryInterface }: {context: QueryInterface }) {
  await queryInterface.createTable("links", {
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
        model: "users",
        key: "id",
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoice_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(LinkStatus)),
      allowNull: false,
      defaultValue: LinkStatus.ACTIVE,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
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

 async function down({ context: queryInterface }: {context: QueryInterface }) {
  await queryInterface.dropTable("links")
}

export { up, down };
