import sequelize from "../db/dbConfig.js";
import DataType from "sequelize";
import Client from "./usersModel.js";
const Shipment = sequelize.define(
  "shipments",
  {
    id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      address: {
        type: DataType.STRING,
        allowNull: false,
      },
      item_cost: {
        type: DataType.DECIMAL(10, 2),
        allowNull: false
      },
    item_name: {
        type: DataType.STRING,
        allowNull: false
      },
      details: {
        type: DataType.TEXT,
        allowNull: false
      },
      destination: {
        type: DataType.STRING,
        allowNull: false
      },
      current_location: {
        type: DataType.STRING,
        allowNull: false
      },
      tracking_no: {
        type: DataType.STRING,
        allowNull: false
      },
      statuses:{
        type: DataType.STRING,
        allowNull: false
      }
  },
  { timestamps: true }
);

Shipment.belongsTo(Client,{foreignKey: 'client_id'});
Client.hasMany(Shipment,{foreignKey:'client_id'});

export default Shipment;
