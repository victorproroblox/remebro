import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Producto from './Producto.js';

const Venta = sequelize.define('ventas', {
  id_ve: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_us: { type: DataTypes.INTEGER, allowNull: true },
  id_pr: { type: DataTypes.INTEGER, allowNull: false },
  fec_ve: { type: DataTypes.DATE, allowNull: false }, // lo maneja la BD (DEFAULT CURRENT_TIMESTAMP)
  total_ve: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
  paypal_order_id: { type: DataTypes.STRING(50), allowNull: true, unique: true }
}, {
  tableName: 'ventas',
  timestamps: false,
  freezeTableName: true
});

// Relaciones
Venta.belongsTo(Producto, { foreignKey: 'id_pr', as: 'producto' });

export default Venta;
