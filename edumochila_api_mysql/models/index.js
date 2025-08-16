import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

// Aquí iremos importando modelos reales.
// Ejemplo base para usuario (ajustaremos cuando me pases tu esquema Laravel):

export const Usuario = sequelize.define('usuarios', {
  id_us: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom_us: { type: DataTypes.STRING(50) },
  email_us: { type: DataTypes.STRING(100), unique: true },
  pass_us: { type: DataTypes.STRING(255) },
  tip_us: { type: DataTypes.INTEGER }
}, {
  tableName: 'usuarios'
});

// Exporta sequelize por si se requiere en otros lados
export { sequelize };
