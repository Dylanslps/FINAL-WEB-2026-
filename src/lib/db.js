import pg from 'pg';

const { Pool } = pg;

// Singleton Pool untuk PostgreSQL (pgAdmin 4)
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

/**
 * Helper eksekusi raw SQL query dengan parameterisasi aman.
 * @param {string} text - Query SQL parameterized (e.g. 'SELECT * FROM users WHERE id = $1')
 * @param {Array} params - Array nilai parameter
 */
export async function query(text, params = []) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DB RAW SQL] ${text.slice(0, 80)}... [${duration}ms] [rows: ${res.rowCount}]`);
    }
    return res;
  } catch (error) {
    console.error('[DB ERROR]', error.message, 'Query:', text);
    throw error;
  }
}

export default pool;
