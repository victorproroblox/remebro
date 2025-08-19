// src/models/Codigo.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Codigo = sequelize.define('Codigo', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,
  },
  id_ve: {
    type: DataTypes.INTEGER, allowNull: false, unique: true,
  },
  codigo: {
    type: DataTypes.STRING(6), allowNull: false, unique: true,
  },
  creado_en: {
    type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'codigos',
  timestamps: false,
  freezeTableName: true,
});

export default Codigo;
