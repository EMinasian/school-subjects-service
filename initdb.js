const sql = require("better-sqlite3");
const db = sql("school.db");
const mockTeachers = require("./mocks/mockTeachers.json")
const mockSubjects = require("./mocks/mockSubjects.json")

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

db.prepare(
  `
   CREATE TABLE IF NOT EXISTS subjects (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       title TEXT NOT NULL,
       description TEXT NOT NULL,
       class TEXT NOT NULL,
       teacherId INTEGER REFERENCES teachers(id) 
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

  const subjectsDb = db.prepare(`
    INSERT INTO subjects VALUES (
       null,
       @title,
       @description,
       @class,
       @teacherId
    )
 `);

 for (const subject of mockSubjects) {
  subjectsDb.run(subject);
}
}

initData();
