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

})

export default db