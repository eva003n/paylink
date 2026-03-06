import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db/postgres";

export enum LinkStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
}

export class Link extends Model {
  declare id: string;
  declare invoice_no: string;
  declare merchant_id: string;
  declare status: LinkStatus;
  declare createdAt: Date;
  declare updatedAt: Date;
}


export default Link.init({
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
        key: "id"
    }
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
    defaultValue: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) // 7 days
  }
},
 {
    tableName: "links",
    sequelize,
    indexes: [{
        unique: true,
        fields: ["invoice_no"]
    }]
    
});
