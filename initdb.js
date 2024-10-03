const sql = require("better-sqlite3");
const db = sql("school.db");
const mockTeachers = require("./mocks/mockTeachers.json")

db.prepare(
  `
   CREATE TABLE IF NOT EXISTS teachers (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       firstname TEXT NOT NULL,
       lastname TEXT NOT NULL,
       email TEXT NOT NULL UNIQUE,
       room TEXT NOT NULL
    )
`
).run();

async function initData() {
  const teachersDb = db.prepare(`
      INSERT INTO teachers VALUES (
         null,
         @firstname,
         @lastname,
         @email,
         @room
      )
   `);

  for (const teacher of mockTeachers) {
    teachersDb.run(teacher);
  }
}

initData();
