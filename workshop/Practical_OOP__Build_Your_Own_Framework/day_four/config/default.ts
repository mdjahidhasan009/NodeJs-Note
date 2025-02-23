import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  database_url: process.env.DATABASE_URL,
} as const;
