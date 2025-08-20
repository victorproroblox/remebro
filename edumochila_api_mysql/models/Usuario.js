// src/models/Usuario.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Estado from "./Estado.js";

const Usuario = sequelize.define(
  "Usuario",
  {
    id_us:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    google_id:   { type: DataTypes.STRING(255), allowNull: true, unique: true },

    nom1_us:     { type: DataTypes.STRING(50),  allowNull: true },
    nom2_us:     { type: DataTypes.STRING(50),  allowNull: true },
    ap_us:       { type: DataTypes.STRING(50),  allowNull: true },
    am_us:       { type: DataTypes.STRING(50),  allowNull: true },

    email_us:    { type: DataTypes.STRING(100), allowNull: true, unique: true },
    avatar_url:  { type: DataTypes.STRING(500), allowNull: true },

    nom_us:      { type: DataTypes.STRING(50),  allowNull: true },
    pass_us:     { type: DataTypes.STRING(300), allowNull: true },

    tip_us:      { type: DataTypes.INTEGER,     allowNull: true, defaultValue: 2 }, // 1=admin, 2=cliente, 3=maestro

    // Domicilio
    cp_us:       { type: DataTypes.CHAR(5),     allowNull: true },
    mun_us:      { type: DataTypes.STRING(100), allowNull: true },
    id_estado:   { type: DataTypes.INTEGER,     allowNull: true }, // FK a estados.id_estado
    colonia_us:  { type: DataTypes.STRING(120), allowNull: true },
    calle_us:    { type: DataTypes.STRING(150), allowNull: true },
    ni_us:       { type: DataTypes.STRING(10),  allowNull: true },  // número interior
    ne_us:       { type: DataTypes.STRING(20),  allowNull: true },  // número exterior

    // Sólo si tip_us=3
    cedula_us:   { type: DataTypes.STRING(50),  allowNull: true },
  },
  {
    tableName: "usuarios",
    timestamps: false,
    freezeTableName: true,
  }
);
Usuario.belongsTo(Estado, { foreignKey: "id_estado", as: "estado" });

export default Usuario;
