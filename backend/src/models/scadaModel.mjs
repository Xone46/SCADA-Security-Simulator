import db from "../config/db.mjs"

// 🟢 INSERT
export const insertScadaData = (data) => {
  const { temperature, pressure, speed, state } = data

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO scada_data (temperature, pressure, speed, state)
       VALUES (?, ?, ?, ?)`,
      [temperature, pressure, speed, state],
      function (err) {
        if (err) return reject(err)
        resolve({
          id: this.lastID,
          ...data
        })
      }
    )
  })
}

// 🔵 GET ALL
export const getScadaHistory = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM scada_data
       ORDER BY timestamp DESC`,
      [],
      (err, rows) => {
        if (err) return reject(err)
        resolve(rows)
      }
    )
  })
}

// 🟣 GET LATEST
export const getLatestScada = (limit = 10) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM scada_data
       ORDER BY timestamp DESC
       LIMIT ?`,
      [limit],
      (err, rows) => {
        if (err) return reject(err)
        resolve(rows)
      }
    )
  })
}