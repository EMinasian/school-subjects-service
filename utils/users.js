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

const getUserByEmail = (email) => {

    const user = db.prepare(
        `
            SELECT email, id, hashedPassword FROM users
            WHERE email = @email 
        `
    ).all({ email });
    return user[0];
    
  }

module.exports = { addUser,getUserByEmail }