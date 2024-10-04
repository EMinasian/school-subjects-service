const sql = require("better-sqlite3");
const db = sql("school.db");

const getAllSubjects = () => {
    return db.prepare("SELECT * FROM subjects").all();
}

const getSubjectStudents = (id) => {
    return db.prepare(
        `
            SELECT firstname, lastname FROM 
            students, enrollment, subjects WHERE
            students.id = enrollment.studentId AND
            enrollment.subjectId = subjects.id AND
            subjects.id = @id
        `
    ).all({ id });
}

module.exports = { getAllSubjects, getSubjectStudents }
