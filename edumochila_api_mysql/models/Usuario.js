import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Usuario = sequelize.define('usuarios', {
  id_us: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  google_id: { type: DataTypes.STRING(255), unique: true, allowNull: true },
  nom1_us: { type: DataTypes.STRING(50), allowNull: true },
  nom2_us: { type: DataTypes.STRING(50), allowNull: true },
  ap_us: { type: DataTypes.STRING(50), allowNull: true },
  am_us: { type: DataTypes.STRING(50), allowNull: true },
  email_us: { type: DataTypes.STRING(100), unique: true, allowNull: true },
  avatar_url: { type: DataTypes.STRING(500), allowNull: true },
  nom_us: { type: DataTypes.STRING(50), allowNull: true },
  pass_us: { type: DataTypes.STRING(300), allowNull: true },
  tip_us: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 2 }
}, {
  tableName: 'usuarios',
  timestamps: false,
  freezeTableName: true
});

export default Usuario;
