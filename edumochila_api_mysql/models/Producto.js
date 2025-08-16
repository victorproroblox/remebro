import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Categoria from './Categoria.js';

const Producto = sequelize.define('productos', {
  id_pr:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom_pr:    { type: DataTypes.STRING(80) },
  precio_pr: { type: DataTypes.DECIMAL(20,2) },
  status_pr: { type: DataTypes.INTEGER },
  img_pr:    { type: DataTypes.STRING(300) },
  id_cat:    { type: DataTypes.INTEGER },
  desc_pr:   { type: DataTypes.STRING(100) },
  stock:     { type: DataTypes.INTEGER },
}, {
  tableName: 'productos',
  timestamps: false,
  freezeTableName: true
});

// Relaciones
Producto.belongsTo(Categoria, { foreignKey: 'id_cat', as: 'categoria' });

export default Producto;
