import { DataTypes } from "sequelize";
import { QueryInterface } from "sequelize";
import { paymentStatusSchema } from "@shared/schemas/validators";

async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.createTable("payments", {
    id: {
      type: DataTypes.STRING,
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
    client_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "clients",
        key: "id",
      },
    },

    link_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "links",
        key: "id",
      },
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mpesa_ref: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },

    checkout_request_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(...Object.values(paymentStatusSchema.enum)),
      allowNull: false,
      defaultValue: paymentStatusSchema.enum.Pending,
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
  await queryInterface.dropTable("payments");
}

export { up, down };
