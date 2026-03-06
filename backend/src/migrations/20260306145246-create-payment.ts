import { DataTypes } from "sequelize";
import {QueryInterface} from "sequelize"
import { PaymentStatus } from "../models/index";

async function up({ context: queryInterface }: {context: QueryInterface }) {
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
        model: "users",
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

    short_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    invoice_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PaymentStatus)),
      allowNull: false,
      defaultValue: PaymentStatus.Pending,
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
  await queryInterface.dropTable("payments")
}

export { up, down };
