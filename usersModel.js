import sequelize from "../db/dbConfig.js";
import DataType from "sequelize";

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataType.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataType.STRING,
      allowNull: false,
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
    },
   
    phoneNumber: {
      type: DataType.STRING,
      allowNull: false,
    },
    role: {
      type: DataType.ENUM("client", "admin"),
      allowNull: false,
      defaultValue: "client",
    },
  },
  { timestamps: true }
);

export default User;
