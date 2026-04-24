import db from "../config/db.mjs";

export const createPlan = data => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO architecture_plans
       (name, department, site, responsible, description, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.department,
        data.site,
        data.responsible,
        data.description,
        data.status || "active"
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      }
    );
  });
};

export const getPlans = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM architecture_plans ORDER BY id DESC`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getPlanById = id => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM architecture_plans WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const deletePlan = id => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM architecture_plans WHERE id = ?`, [id], function (err) {
      if (err) reject(err);
      else resolve({ deleted: this.changes });
    });
  });
};

export const createNode = data => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO architecture_nodes
       (plan_id, name, type, x_position, y_position, ip_address, status, criticality, linked_plc_id, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.plan_id,
        data.name,
        data.type,
        data.x_position || 100,
        data.y_position || 100,
        data.ip_address,
        data.status || "active",
        data.criticality || "medium",
        data.linked_plc_id || null,
        data.description
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      }
    );
  });
};

export const getNodesByPlan = planId => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM architecture_nodes WHERE plan_id = ?`,
      [planId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

export const updateNodePosition = (id, x, y) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE architecture_nodes SET x_position = ?, y_position = ? WHERE id = ?`,
      [x, y, id],
      function (err) {
        if (err) reject(err);
        else resolve({ updated: this.changes });
      }
    );
  });
};

export const deleteNode = id => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM architecture_nodes WHERE id = ?`, [id], function (err) {
      if (err) reject(err);
      else resolve({ deleted: this.changes });
    });
  });
};

export const createEdge = data => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO architecture_edges
       (plan_id, source_node_id, target_node_id, label, protocol, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.plan_id,
        data.source_node_id,
        data.target_node_id,
        data.label,
        data.protocol || "Ethernet",
        data.status || "active"
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      }
    );
  });
};

export const getEdgesByPlan = planId => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM architecture_edges WHERE plan_id = ?`,
      [planId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

export const deleteEdge = id => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM architecture_edges WHERE id = ?`, [id], function (err) {
      if (err) reject(err);
      else resolve({ deleted: this.changes });
    });
  });
};