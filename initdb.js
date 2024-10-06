const sql = require("better-sqlite3");
const db = sql("school.db");
const mockTeachers = require("./mocks/mockTeachers.json")
const mockSubjects = require("./mocks/mockSubjects.json")
const mockStudents = require("./mocks/mockStudents.json")
const mockEnrollment = require("./mocks/mockEnrollment.json")
const mockUsers = require("./mocks/mockUsers.json")

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

db.prepare(
   `
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL
     )
 `
 ).run();

 db.prepare(
   `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        hashedPassword TEXT NOT NULL
     )
 `
 ).run();

 db.prepare(
   `
   CREATE TABLE IF NOT EXISTS enrollment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subjectId INTEGER REFERENCES subjects(id),
      studentId INTEGER REFERENCES students(id),
      UNIQUE(subjectId, studentId)
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

 const studentsDb = db.prepare(`
   INSERT INTO students VALUES (
      null,
      @firstname,
      @lastname
   )
`);

for (const student of mockStudents) {
   studentsDb.run(student);
 }

 const enrollmentDb = db.prepare(`
   INSERT INTO enrollment VALUES (
      null,
      @subjectId,
      @studentId
   )
`);

for (const enrollment of mockEnrollment) {
   enrollmentDb.run(enrollment);
 }

 // "password": "somepassword"
 const usersDb = db.prepare(`
   INSERT INTO users VALUES (
      null,
      @email,
      @hashedPassword
   )
`);

for (const user of mockUsers) {
   usersDb.run(user); 
 }
}

initData();
