const { app, BrowserWindow } = require('electron')
const path = require('node:path')

console.log('PATH:', path.join(__dirname, 'preload.js'))

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  const indexFile = path.resolve(__dirname, 'dist/index.html')
  mainWindow.loadFile(indexFile)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
