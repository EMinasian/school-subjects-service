const sql = require("better-sqlite3");
const db = sql("school.db");

const getAllTeachers = () => {
    return db.prepare("SELECT * FROM teachers").all();
}

module.exports = { getAllTeachers }
