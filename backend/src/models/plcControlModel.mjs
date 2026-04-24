import db from "../config/db.mjs";

export const createControl = (data) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO plc_controls
      (plc_id, inspector_name, inspector_firstname, company,
       intervention_date, status, criticality,
       observations, recommendations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.plc_id,
        data.inspector_name,
        data.inspector_firstname,
        data.company,
        data.intervention_date,
        data.status,
        data.criticality,
        data.observations,
        data.recommendations
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

export const getControlsByPlc = (plc_id) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM plc_controls WHERE plc_id = ? ORDER BY created_at DESC`,
      [plc_id],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

export const deleteControl = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM plc_controls WHERE id = ?`, [id], function (err) {
      if (err) reject(err);
      else resolve({ deleted: this.changes });
    });
  });
};