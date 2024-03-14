// db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgres://postgres:admin@host:1999/apidata',
});

export default pool;



