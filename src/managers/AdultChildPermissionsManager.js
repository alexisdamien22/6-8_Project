import { db } from "../db/connection.js";

export class AdultChildPermissionsManager {
    static async getPermissions(adultId, childId) {
        const [rows] = await db.query(
            "SELECT * FROM AdultChildPermissions WHERE adult_id = ? AND child_id = ?",
            [adultId, childId]
        );
        return rows[0] || null;
    }

    static async setPermissions(adultId, childId, perms) {
        const { can_view, can_edit, can_view_sessions, can_edit_weekly_plan } = perms;

        await db.query(
            `INSERT INTO AdultChildPermissions 
        (adult_id, child_id, can_view, can_edit, can_view_sessions, can_edit_weekly_plan)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         can_view = VALUES(can_view),
         can_edit = VALUES(can_edit),
         can_view_sessions = VALUES(can_view_sessions),
         can_edit_weekly_plan = VALUES(can_edit_weekly_plan)`,
            [adultId, childId, can_view, can_edit, can_view_sessions, can_edit_weekly_plan]
        );
    }
}