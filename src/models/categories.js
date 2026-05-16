import pool from "./db.js";

export async function getAllCategories() {
  const result = await pool.query(
    "SELECT * FROM categories ORDER BY name"
  );

  return result.rows;
}
