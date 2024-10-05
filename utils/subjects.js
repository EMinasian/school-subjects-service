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
            SELECT students.id AS id, students.firstname, students.lastname 
            FROM (
                SELECT * FROM subjects
                INNER JOIN enrollment ON subjects.id = enrollment.subjectId
                WHERE subjects.id = @id
            ) AS S
            INNER JOIN students ON students.id = S.studentId 
        `
    ).all({ id });
}

const deleteEnrollment = (subjectId, studentId) => {
    db.prepare(
        `
            DELETE FROM enrollment WHERE
            subjectId = @subjectId AND
            studentId = @studentId
        `
    ).run({ subjectId, studentId });
}

const insertEnrollment = (subjectId, studentId) => {
    db.prepare(
        `
            INSERT INTO enrollment(subjectId, studentId) VALUES
            (@subjectId, @studentId)
        `
    ).run({ subjectId, studentId });
}

const updateSubject = (subjectId, title, description, teacherId) => {
    db.prepare(
        `
            UPDATE subjects SET
            title = @title,
            description = @description,
            teacherId = @teacherId
            WHERE id = @subjectId
        `
    ).run({ subjectId, title, description, teacherId });
}

module.exports = { getAllSubjects, getSubjectStudents, getSubjectTeacher, getSubjectById, deleteEnrollment, insertEnrollment, updateSubject }
