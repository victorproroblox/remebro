// models/Venta.js
import { DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../config/database.js';

const Venta = sequelize.define(
  'ventas', // 👈 nombre EXACTO de la tabla
  {
    id_ve: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    id_us: {
      type: DataTypes.INTEGER,
      allowNull: true, // en tu tabla puede venir null
    },

    id_pr: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Recomendado que la columna en MySQL tenga DEFAULT CURRENT_TIMESTAMP
    fec_ve: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },

    total_ve: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    paypal_order_id: {
      type: DataTypes.STRING(100), // suficiente para el ID de PayPal
      allowNull: false,
    },
  },
  {
    freezeTableName: true, // respeta 'ventas' como nombre de tabla
    timestamps: false,     // tu tabla no usa createdAt/updatedAt
  }
);

export default Venta;
