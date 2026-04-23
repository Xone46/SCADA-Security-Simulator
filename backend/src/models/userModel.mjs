import db from "../config/db.mjs";

/**
 * CREATE USER
 */
export const createUser = ({
  matricule,
  nom,
  prenom,
  email,
  password,
  role = "user",
  status = "active"
}) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (matricule, nom, prenom, email, password, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [matricule, nom, prenom, email, password, role, status],
      function (err) {
        if (err) {
          console.error("❌ DB INSERT USER ERROR:", err.message);
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            matricule,
            nom,
            prenom,
            email,
            role,
            status
          });
        }
      }
    );
  });
};

/**
 * FIND USER BY EMAIL
 */
export const findUserByEmail = email => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM users WHERE email = ?`,
      [email],
      (err, row) => {
        if (err) {
          console.error("❌ DB FIND BY EMAIL ERROR:", err.message);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

/**
 * FIND USER BY ID
 */
export const findUserById = id => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM users WHERE id = ?`,
      [id],
      (err, row) => {
        if (err) {
          console.error("❌ DB FIND BY ID ERROR:", err.message);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

/**
 * GET ALL USERS
 */
export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, matricule, nom, prenom, email, role, status, created_at
       FROM users
       ORDER BY id DESC`,
      [],
      (err, rows) => {
        if (err) {
          console.error("❌ DB GET ALL USERS ERROR:", err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

/**
 * UPDATE USER
 */
export const updateUser = (
  id,
  { matricule, nom, prenom, email, password, role, status }
) => {
  return new Promise((resolve, reject) => {
    if (password) {
      db.run(
        `UPDATE users
         SET matricule = ?, nom = ?, prenom = ?, email = ?, password = ?, role = ?, status = ?
         WHERE id = ?`,
        [matricule, nom, prenom, email, password, role, status || "active", id],
        function (err) {
          if (err) {
            console.error("❌ DB UPDATE USER ERROR:", err.message);
            reject(err);
          } else {
            resolve({
              updated: this.changes,
              id,
              matricule,
              nom,
              prenom,
              email,
              role,
              status: status || "active"
            });
          }
        }
      );
    } else {
      db.run(
        `UPDATE users
         SET matricule = ?, nom = ?, prenom = ?, email = ?, role = ?, status = ?
         WHERE id = ?`,
        [matricule, nom, prenom, email, role, status || "active", id],
        function (err) {
          if (err) {
            console.error("❌ DB UPDATE USER ERROR:", err.message);
            reject(err);
          } else {
            resolve({
              updated: this.changes,
              id,
              matricule,
              nom,
              prenom,
              email,
              role,
              status: status || "active"
            });
          }
        }
      );
    }
  });
};

/**
 * DELETE USER
 */
export const deleteUser = id => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM users WHERE id = ?`,
      [id],
      function (err) {
        if (err) {
          console.error("❌ DB DELETE USER ERROR:", err.message);
          reject(err);
        } else {
          resolve({ deleted: this.changes });
        }
      }
    );
  });
};

/**
 * UPDATE USER ROLE
 */
export const updateUserRole = (id, role) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET role = ? WHERE id = ?`,
      [role, id],
      function (err) {
        if (err) {
          console.error("❌ DB UPDATE ROLE ERROR:", err.message);
          reject(err);
        } else {
          resolve({
            updated: this.changes,
            id,
            role
          });
        }
      }
    );
  });
};

export const updateUserStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET status = ? WHERE id = ?`,
      [status, id],
      function (err) {
        if (err) {
          console.error("❌ DB UPDATE STATUS ERROR:", err.message);
          reject(err);
        } else {
          resolve({
            updated: this.changes,
            id,
            status
          });
        }
      }
    );
  });
};