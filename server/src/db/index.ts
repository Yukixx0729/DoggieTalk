import { Pool } from "pg";

const db = new Pool({
  database: process.env.DB_NAME || "doggie_talk",
});

export default db;
