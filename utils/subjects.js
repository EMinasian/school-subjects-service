const sql = require("better-sqlite3");
const db = sql("school.db");

const getAllSubjects = () => {
    return db.prepare("SELECT * FROM subjects").all();
}

const getSubjectById = (id) => {
    return db.prepare(
        `SELECT * FROM subjects WHERE
        subjects.id = @id
        `
    ).all({ id });
}

const getSubjectTeacher = (id) => {
    const teachers = db.prepare(
        `
            SELECT firstname, lastname, email, room, teacherId FROM 
            teachers, subjects WHERE
            teachers.id = subjects.teacherId AND
            subjects.id = @id
        `
    ).all({ id });

    return teachers[0]
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

module.exports = { getAllSubjects, getSubjectStudents, getSubjectTeacher, getSubjectById }
