import { PaymentStatus, paymentStatusSchema } from "@paylink/shared"
import { sequelize } from "../config/db/postgres";
import { DataTypes, Model } from "sequelize";

export class Payment extends Model {
  declare id: string;
  declare link_id: string;
  declare merchant_id: string;
  declare client_id: string;
  declare mpesa_ref: string;
  declare checkout_request_id: string;
  declare amount: number;
  declare status: PaymentStatus;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

Payment.init(
  {
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
  },
  {
    tableName: "payments",
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ["checkout_request_id", "mpesa_ref"],
      },
    ],
  },
);
