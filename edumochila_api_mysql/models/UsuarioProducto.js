// models/UsuarioProducto.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const UsuarioProducto = sequelize.define('usuario_productos', {
  id_us: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,          // 👈 evita que Sequelize agregue 'id'
  },
  producto_id: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true,          // 👈 PK compuesta (id_us + producto_id)
  },
  nom_alumno: {
    type: DataTypes.STRING(100),
    allowNull: true,
  }
}, {
  tableName: 'usuario_productos',
  timestamps: false,
  freezeTableName: true,
});

export default UsuarioProducto;
