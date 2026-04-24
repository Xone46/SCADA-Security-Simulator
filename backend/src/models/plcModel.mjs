import db from "../config/db.mjs";

export const createPlc = data => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO plcs (
        name, tag, brand, manufacturer, model, plc_type,
        serial_number, firmware_version, description,
        ip_address, port, protocol, unit_id, location, production_line,
        installation_date, commissioning_date, decommissioning_date, status,
        installed_by, maintained_by, supplier, internal_owner
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.tag,
        data.brand,
        data.manufacturer,
        data.model,
        data.plc_type,
        data.serial_number,
        data.firmware_version,
        data.description,
        data.ip_address,
        data.port || 502,
        data.protocol || "Modbus TCP",
        data.unit_id || 1,
        data.location,
        data.production_line,
        data.installation_date,
        data.commissioning_date,
        data.decommissioning_date,
        data.status || "active",
        data.installed_by,
        data.maintained_by,
        data.supplier,
        data.internal_owner
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      }
    );
  });
};

export const getAllPlcs = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM plcs ORDER BY id DESC`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const findPlcById = id => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM plcs WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const updatePlc = (id, data) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE plcs SET
        name = ?, tag = ?, brand = ?, manufacturer = ?, model = ?, plc_type = ?,
        serial_number = ?, firmware_version = ?, description = ?,
        ip_address = ?, port = ?, protocol = ?, unit_id = ?, location = ?, production_line = ?,
        installation_date = ?, commissioning_date = ?, decommissioning_date = ?, status = ?,
        installed_by = ?, maintained_by = ?, supplier = ?, internal_owner = ?
      WHERE id = ?`,
      [
        data.name,
        data.tag,
        data.brand,
        data.manufacturer,
        data.model,
        data.plc_type,
        data.serial_number,
        data.firmware_version,
        data.description,
        data.ip_address,
        data.port || 502,
        data.protocol || "Modbus TCP",
        data.unit_id || 1,
        data.location,
        data.production_line,
        data.installation_date,
        data.commissioning_date,
        data.decommissioning_date,
        data.status || "active",
        data.installed_by,
        data.maintained_by,
        data.supplier,
        data.internal_owner,
        id
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ updated: this.changes, id, ...data });
      }
    );
  });
};

export const deletePlc = id => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM plcs WHERE id = ?`, [id], function (err) {
      if (err) reject(err);
      else resolve({ deleted: this.changes });
    });
  });
};

export const updatePlcStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE plcs SET status = ? WHERE id = ?`, [status, id], function (err) {
      if (err) reject(err);
      else resolve({ updated: this.changes, id, status });
    });
  });
};