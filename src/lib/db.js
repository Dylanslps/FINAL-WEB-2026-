import pg from 'pg';

const { Pool } = pg;

let pool;

if (!global._pgPool) {
  global._pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
}
pool = global._pgPool;

export async function query(text, params = []) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error('DB Error:', error.message);
    throw error;
  }
}

export default pool;
