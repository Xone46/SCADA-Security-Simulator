import db from "../config/db.mjs";

export const createUser = async (username, password) => {
    return await db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, password]
    );
};

export const findUserByUsername = async (username) => {
    return await db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username]
    );
};

export const getAllUsers = async () => {
    return await db.all(`SELECT * FROM users`);
};