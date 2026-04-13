import path from "path"
import fs from "fs"
import sqlite3 from "sqlite3"
import os from "os"

// 📁 dossier ثابت
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

// 🧠 create table
db.serialize(() => {
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
})

export default db