const { Pool } = require('pg');


const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

// Função para realizar consultas no banco de dados
async function query(text, values) {
  try {
    const result = await pool.query(text, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = { query };
