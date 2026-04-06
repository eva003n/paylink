import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db/postgres";
import { LinkStatus, linkStatusSchema } from "@shared/schemas/validators";

export class Link extends Model {
  declare id: string;
  declare merchant_id: string;
  declare amount: number;
  declare shortCode: number;
  declare token: string;
  declare url: string;
  declare status: LinkStatus;
  declare expiresAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}


 Link.init(
   {
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
     token: {
       type: DataTypes.STRING,
       allowNull: false,
       defaultValue: "",
     },
     url: {
       type: DataTypes.STRING,
       allowNull: false,
       defaultValue: "",
     },

     shortCode: {
       type: DataTypes.INTEGER,
       allowNull: false,
     },
     amount: {
       type: DataTypes.DECIMAL(8, 2),
       allowNull: false,
     },

     status: {
       type: DataTypes.ENUM(...Object.values(linkStatusSchema.enum)),
       allowNull: false,
       defaultValue: linkStatusSchema.enum.Active,
     },
     expiresAt: {
       type: DataTypes.DATE,
       allowNull: false,
       defaultValue: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
     },
   },
   {
     tableName: "links",
     sequelize,
     indexes: [{
         unique: true,
         fields: ["token", "url"]
     }]
   },
 );
