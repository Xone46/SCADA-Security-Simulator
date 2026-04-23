import db from "../config/db.mjs";

export const insertScadaData = ({ temperature, pressure, speed, state }) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO scada_data (temperature, pressure, speed, state)
       VALUES (?, ?, ?, ?)`,
      [temperature, pressure, speed, state],
      function (err) {
        if (err) {
          console.error("❌ DB INSERT SCADA ERROR:", err.message);
          reject(err);
        } else {
          resolve({ id: this.lastID, temperature, pressure, speed, state });
        }
      }
    );
  });
};

export const getLatestScadaData = () => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM scada_data ORDER BY id DESC LIMIT 1`,
      [],
      (err, row) => {
        if (err) {
          console.error("❌ DB SELECT LATEST SCADA ERROR:", err.message);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

export const getScadaHistory = (limit = 50) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM scada_data ORDER BY id DESC LIMIT ?`,
      [limit],
      (err, rows) => {
        if (err) {
          console.error("❌ DB SELECT HISTORY ERROR:", err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};