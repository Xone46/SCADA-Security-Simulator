import {
  app,
  protocol,
  BrowserWindow,
  screen,
  Menu,
  dialog
} from 'electron'

import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import spawn from 'cross-spawn'
import path from 'path'
import kill from 'tree-kill'
import net from 'net'
import http from 'http'
import fs from 'fs'

const isDevelopment = !app.isPackaged
const port = 5000

let backendProcess = null
let win

// --------------------------
// LOG
// --------------------------
const logFile = path.join(app.getPath('userData'), 'debug.log')

function logDebug(msg) {
  console.log(msg)
  fs.appendFileSync(logFile, msg + '\n')
}

// --------------------------
// SINGLE INSTANCE
// --------------------------
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  dialog.showMessageBoxSync({
    type: 'warning',
    title: 'Application déjà ouverte',
    message: 'L’application est déjà ouverte.'
  })
  app.quit()
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}

// --------------------------
// PROTOCOL
// --------------------------
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: { secure: true, standard: true }
  }
])

// --------------------------
// PORT CHECK
// --------------------------
async function isPortInUse(port) {
  return new Promise(resolve => {
    const server = net.createServer()

    server.once('error', err => {
      resolve(err.code === 'EADDRINUSE')
    })

    server.once('listening', () => {
      server.close()
      resolve(false)
    })

    server.listen(port)
  })
}

// --------------------------
// KILL PORT PROCESS
// --------------------------
async function killPortProcess(port) {
  const { exec } = await import('child_process')

  return new Promise(resolve => {
    exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
      if (stdout) {
        stdout.trim().split('\n').forEach(line => {
          const parts = line.trim().split(/\s+/)
          const pid = parseInt(parts[parts.length - 1])

          if (pid && !isNaN(pid)) {
            kill(pid, 'SIGKILL', () =>
              logDebug(`🛑 Killed process PID ${pid} on port ${port}`)
            )
          }
        })
      }
      resolve()
    })
  })
}

// --------------------------
// BACKEND PING
// --------------------------
function pingBackend() {
  return new Promise(resolve => {
    const req = http.get(`http://localhost:${port}`, res => {
      resolve(res.statusCode === 200 || res.statusCode === 404)
    })

    req.on('error', () => resolve(false))

    req.setTimeout(2000, () => {
      req.destroy()
      resolve(false)
    })
  })
}

// --------------------------
// START BACKEND (FIXED)
// --------------------------
async function startBackend() {
  const backendPath = isDevelopment
    ? path.resolve(__dirname, '..', 'backend')
    : path.join(process.resourcesPath, 'backend')

  logDebug(`🛠️ Backend path: ${backendPath}`)

  if (!fs.existsSync(backendPath)) {
    logDebug(`❌ Backend not found`)
    return
  }

  const backendCommand = isDevelopment ? 'start:dev' : 'start'

  backendProcess = spawn(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['run', backendCommand],
    {
      cwd: backendPath,
      stdio: 'inherit',
      shell: true,
      env: process.env
    }
  )

  backendProcess.on('spawn', () => {
    logDebug(`✅ Backend started PID: ${backendProcess.pid}`)
  })

  backendProcess.on('error', err => {
    logDebug(`❌ Backend error: ${err}`)
  })
}

// --------------------------
// CHECK EXTERNAL SOFTWARE
// --------------------------
function checkLibreOffice() {
  if (isDevelopment) return true

  const librePath =
    'C:\\Program Files\\LibreOffice\\program\\soffice.exe'

  if (!fs.existsSync(librePath)) {
    dialog.showErrorBox(
      'LibreOffice manquant',
      'Veuillez installer LibreOffice.'
    )
    app.quit()
    return false
  }

  return true
}

// --------------------------
// WINDOW
// --------------------------
async function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  win = new BrowserWindow({
    width: Math.min(1280, width),
    height: Math.min(800, height),
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (isDevelopment) {
    await win.loadURL('http://localhost:8080')
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    createProtocol('app')
    await win.loadURL('app://./index.html')
  }
}

// --------------------------
// MENU
// --------------------------
function setupMenu() {
  const template = [
    {
      label: 'Fenêtre',
      submenu: [
        { role: 'minimize' },
        { role: 'togglefullscreen' },
        { role: 'reload' },
        { role: 'quit' }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

// --------------------------
// APP READY
// --------------------------
app.on('ready', async () => {
  if (!checkLibreOffice()) return

  // Devtools
  if (isDevelopment) {
    try {
      await installExtension(VUEJS3_DEVTOOLS)
      logDebug('✅ Vue Devtools installed')
    } catch (e) {
      logDebug(`⚠️ Devtools error: ${e}`)
    }
  }

  // Port check
  if (await isPortInUse(port)) {
    await killPortProcess(port)
  }

  await startBackend()

  // Wait backend
  let ok = false
  let tries = 0

  while (!ok && tries < 30) {
    ok = await pingBackend()

    if (!ok) {
      logDebug(`⏳ Waiting backend... (${tries + 1}/30)`)
      await new Promise(r => setTimeout(r, 1000))
      tries++
    }
  }

  if (ok) {
    logDebug('✅ Backend ready')
    await createWindow()
    setupMenu()
  } else {
    logDebug('❌ Backend failed')
    app.quit()
  }
})

// --------------------------
// CLOSE APP
// --------------------------
app.on('window-all-closed', async () => {
  if (await isPortInUse(port)) {
    await killPortProcess(port)
  }

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// --------------------------
// DEV EXIT
// --------------------------
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') app.quit()
    })
  } else {
    process.on('SIGTERM', async () => {
      if (await isPortInUse(port)) {
        await killPortProcess(port)
      }
      app.quit()
    })
  }
}