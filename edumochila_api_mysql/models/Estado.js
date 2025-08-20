// src/models/Estado.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Estado = sequelize.define(
  "Estado",
  {
    id_estado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom_estado: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "estados",      // <- nombre real de la tabla
    timestamps: false,
    freezeTableName: true,
  }
);

export default Estado;
