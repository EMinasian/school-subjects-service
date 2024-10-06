const sql = require("better-sqlite3");
const db = sql("school.db");
const { hash } = require('bcryptjs');

const addUser = async(email, password) => {

    const hashedPw = await hash(password, 12);
    db.prepare(
        `
            INSERT INTO users(email, hashedPassword) VALUES
            (@email, @hashedPw)
        `
    ).run({ email, hashedPw });
    
}

module.exports = { addUser }