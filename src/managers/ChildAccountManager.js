import { db } from "../db/connection.js";

export class ChildAccountManager {
  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM ChildAccount WHERE id = ?", [
      id,
    ]);
    return rows[0] || null;
  }

  static async create(name, adultId = null) {
    const [result] = await db.query(
      "INSERT INTO ChildAccount (name, adultId) VALUES (?, ?)",
      [name, adultId],
    );
    return result.insertId;
  }

  static async getChildrenOfAdult(adultId) {
    const [rows] = await db.query(
      "SELECT * FROM ChildAccount WHERE adultId = ?",
      [adultId],
    );
    return rows;
  }
}
