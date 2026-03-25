import mysql from "mysql2/promise";

export const db = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "6/8_production",
    connectionLimit: 10,
});