const sql = require("better-sqlite3");
const db = sql("school.db");

const getAllSubjects = () => {
    return db.prepare("SELECT * FROM subjects").all();
}

module.exports = { getAllSubjects }
