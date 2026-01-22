import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const isProd = process.env.NODE_ENV === "production";

/**
 * Supabase pooler + Render:
 * - SSL is required in production
 * - In many hosted environments Node may reject the chain -> SELF_SIGNED_CERT_IN_CHAIN
 * - Use rejectUnauthorized:false in prod to avoid chain failures
 */
export const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : false,
});
