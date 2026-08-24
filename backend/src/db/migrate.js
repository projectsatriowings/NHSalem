import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { getCleanConnectionString } from './pool.js'

const { Client } = pg

async function runMigration() {
  const rawConnectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  if (!rawConnectionString) {
    console.error('DATABASE_URL_UNPOOLED or DATABASE_URL must be set')
    process.exit(1)
  }

  const connectionString = getCleanConnectionString(rawConnectionString)

  console.log('Connecting to Neon database for migration...')
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    const sqlPath = path.join(__dirname, 'schema.sql')
    const sql = fs.readFileSync(sqlPath, 'utf-8')

    console.log('Running schema.sql migration...')
    await client.query(sql)
    console.log('Migration completed successfully!')
  } catch (err) {
    console.error('Migration failed:', err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigration()
