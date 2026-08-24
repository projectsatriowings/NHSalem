import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

/**
 * Normalizes connection string to use sslmode=verify-full.
 * Eliminates: "(node) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'."
 */
export function getCleanConnectionString(url = process.env.DATABASE_URL) {
  if (!url) return url
  let clean = url.replace(/sslmode=(require|prefer|verify-ca)/gi, 'sslmode=verify-full')
  if (!clean.includes('sslmode=')) {
    const separator = clean.includes('?') ? '&' : '?'
    clean = `${clean}${separator}sslmode=verify-full`
  }
  return clean
}

let connectionString = getCleanConnectionString(process.env.DATABASE_URL)

if (!connectionString) {
  console.warn('⚠️  WARNING: DATABASE_URL is not set in environment!')
}

export const pool = new Pool({
  connectionString,
  ssl: connectionString
    ? { rejectUnauthorized: false }
    : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000
})

pool.on('error', (err) => {
  console.error('⚠️  Unexpected idle client error on PostgreSQL pool:', err.message)
})

export default pool

