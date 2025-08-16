import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const UsuarioProducto = sequelize.define('usuario_productos', {
  id_us: {
    type: DataTypes.INTEGER,
    allowNull: true, // así está en tu BD; lógicamente debería ser NOT NULL
  },
  producto_id: {
    type: DataTypes.STRING(10), // tu columna es varchar(10)
    allowNull: true
  }
}, {
  tableName: 'usuario_productos',
  timestamps: false,
  freezeTableName: true
});

export default UsuarioProducto;
