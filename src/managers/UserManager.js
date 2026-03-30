import bcrypt from "bcryptjs";
import { db } from "../db/connection.js";

export class UserManager {
  static async create(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO adultaccount (username, password) VALUES (?, ?)",
      [email, hashedPassword],
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.query(
      "SELECT * FROM adultaccount WHERE username = ?",
      [email],
    );
    return rows[0] || null;
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async getById(id) {
    const [rows] = await db.query(
      "SELECT id, username FROM adultaccount WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  }
}
