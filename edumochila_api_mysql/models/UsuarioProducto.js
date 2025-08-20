// models/UsuarioProducto.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const UsuarioProducto = sequelize.define('usuario_productos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_us: {
    type: DataTypes.INTEGER,
    allowNull: false   // la tabla lo tiene NOT NULL
  },
  producto_id: {
    type: DataTypes.STRING(10),
    allowNull: false   // la tabla lo tiene NOT NULL
  },
  nom_alumno: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'usuario_productos',
  timestamps: false,
  freezeTableName: true
});

export default UsuarioProducto;
