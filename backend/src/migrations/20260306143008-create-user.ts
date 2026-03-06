import { DataTypes } from "sequelize";
import {QueryInterface} from "sequelize"

 async function up({ context: queryInterface }: {context: QueryInterface }) {
  queryInterface.createTable("users", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    clerk_id: {
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

 async function down({ context: queryInterface }: {context: QueryInterface }) {
  await queryInterface.dropTable("users")
}

export { up, down };
