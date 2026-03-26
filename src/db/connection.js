import mysql from "mysql2/promise";

export const db = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "six_huit_production",
    connectionLimit: 10,
});