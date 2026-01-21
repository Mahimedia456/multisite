import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

// Supabase pooler needs SSL. In dev, accept chain.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
});
