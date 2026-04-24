import path from "path"
import fs from "fs"
import sqlite3 from "sqlite3"
import os from "os"

// 📁 dossier DB
const dbDir = path.join(os.homedir(), "scada-guardian")

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
  console.log("📁 Created DB folder:", dbDir)
}

// 📦 path database
const dbPath = path.join(dbDir, "database.sqlite")

console.log("📦 DB path:", dbPath)

// 🟢 connexion
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ SQLite error:", err.message)
  } else {
    console.log("✅ SQLite connected")
  }
})

// 🧠 création tables
db.serialize(() => {

  // SCADA DATA
  db.run(`
    CREATE TABLE IF NOT EXISTS scada_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      temperature REAL,
      pressure REAL,
      speed REAL,
      state TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // ALERTS
  db.run(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      message TEXT,
      severity TEXT,
      value REAL,
      threshold REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // USERS
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      matricule TEXT NOT NULL,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // AUDIT REPORTS
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      summary TEXT,
      total_alerts INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // PLCS
  db.run(`
    CREATE TABLE IF NOT EXISTS plcs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      tag TEXT,
      brand TEXT,
      manufacturer TEXT,
      model TEXT,
      plc_type TEXT,
      serial_number TEXT,
      firmware_version TEXT,
      description TEXT,

      ip_address TEXT NOT NULL,
      port INTEGER DEFAULT 502,
      protocol TEXT DEFAULT 'Modbus TCP',
      unit_id INTEGER DEFAULT 1,
      location TEXT,
      production_line TEXT,

      installation_date TEXT,
      commissioning_date TEXT,
      decommissioning_date TEXT,
      status TEXT DEFAULT 'active',

      installed_by TEXT,
      maintained_by TEXT,
      supplier TEXT,
      internal_owner TEXT,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // PLC-CONTROLLED DEVICES
  db.run(`
    CREATE TABLE IF NOT EXISTS plc_controls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plc_id INTEGER NOT NULL,

      inspector_name TEXT,
      inspector_firstname TEXT,
      company TEXT,

      intervention_date TEXT,
      status TEXT,
      criticality TEXT,

      observations TEXT,
      recommendations TEXT,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (plc_id) REFERENCES plcs(id)
    )
  `)

  db.run(`
  CREATE TABLE IF NOT EXISTS architecture_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT,
    site TEXT,
    responsible TEXT,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS architecture_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    x_position INTEGER DEFAULT 100,
    y_position INTEGER DEFAULT 100,
    ip_address TEXT,
    status TEXT DEFAULT 'active',
    criticality TEXT DEFAULT 'medium',
    linked_plc_id INTEGER,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES architecture_plans(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS architecture_edges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    source_node_id INTEGER NOT NULL,
    target_node_id INTEGER NOT NULL,
    label TEXT,
    protocol TEXT DEFAULT 'Ethernet',
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES architecture_plans(id)
  )
`);

})

export default db