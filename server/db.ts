// server/db.ts


import { Pool } from 'pg'

// const pool = new Pool({
//   connectionString: 'postgresql://postgres:pdND89%262Xq.urp4@ukpupugsgxqpjglfngnc.supabase.co:5432/postgres',
//   ssl: {
//     rejectUnauthorized: false,
//   },
// })




const pool = new Pool({
 connectionString: 'postgresql://postgres.ukpupugsgxqpjglfngnc:pdND89%262Xq.urp4@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
})




export default pool


