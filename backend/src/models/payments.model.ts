import { sequelize } from "../config/db/postgres";
import {DataTypes, Model} from "sequelize"

export enum PaymentStatus {
  Pending = "Pending",
  Successful = "Success",
  Failed = "Failed",
}

export  class Payment extends Model {
  declare id?: string;
  declare client_id: string;
  declare merchant_id: string;
  declare short_code: string;
  declare mpesa_ref: string;
  declare invoice_no: string;
  declare amount: number;
  declare status: PaymentStatus;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

Payment.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }, 
    merchant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "merchants",
            key: "id"
        }
    }, 
    client_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "clients",
            key: "id"
        }
    }, 
    
    short_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
    amount:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    mpesa_ref:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
    },
    invoice_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(...Object.values(PaymentStatus)),
        allowNull: false,
        defaultValue: PaymentStatus.Pending
    }
 
}, {
    tableName: "payments",
    sequelize,
    indexes: [{
        unique: true,
        fields: ["payment_ref", "mpesa_ref"]
    }]
})