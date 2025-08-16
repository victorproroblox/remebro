import { Sequelize } from 'sequelize';

const {
  DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_DIALECT
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT || 'mysql',
  logging: false,
  define: {
    freezeTableName: true, 
    timestamps: false  
  }
});

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL OK');
  } catch (err) {
    console.error('❌ Error de conexión MySQL:', err.message);
    process.exit(1);
  }
}
