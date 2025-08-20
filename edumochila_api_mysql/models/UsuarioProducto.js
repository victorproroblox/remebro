import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const UsuarioProducto = sequelize.define('usuario_productos', {
  id_us: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  producto_id: {
    type: DataTypes.STRING(10),
    allowNull: true
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
