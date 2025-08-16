import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Categoria = sequelize.define('categorias', {
  id_cat: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom_cat: { type: DataTypes.STRING(80) }, // ajusta el tamaño si es distinto
}, {
  tableName: 'categorias',
  timestamps: false,
  freezeTableName: true
});

export default Categoria;
