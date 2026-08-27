const { app, BrowserWindow, dialog, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

let phpProcess = null;
let mainWindow = null;

function findExisting(paths) {
  return paths.find(p => p && fs.existsSync(p));
}

function findPhp() {
  const candidates = [
    path.join(process.resourcesPath || '', 'runtime', 'php.exe'),
    'C:\\xampp\\php\\php.exe',
    'C:\\xampp\\php\\php-cgi.exe'
  ];
  return findExisting(candidates);
}

function findFfmpeg() {
  const candidates = [
    path.join(process.resourcesPath || '', 'runtime', 'ffmpeg.exe'),
    'C:\\ffmpeg\\ffmpeg-9.0.1-essentials_build\\bin\\ffmpeg.exe',
    'C:\\ffmpeg\\bin\\ffmpeg.exe',
    'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe'
  ];
  return findExisting(candidates);
}

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

function webRoot() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'web')
    : path.resolve(__dirname, '..');
}

async function startPhpServer() {
  const php = findPhp();
  if (!php) {
    const result = await dialog.showMessageBox({
      type: 'error',
      title: 'ClipForge no encuentra PHP',
      message: 'No se encontró PHP.',
      detail: 'Para esta primera versión de escritorio instala XAMPP en C:\\xampp o coloca php.exe en desktop\\runtime. FFmpeg puede estar en C:\\ffmpeg.',
      buttons: ['Abrir descarga de XAMPP', 'Cerrar']
    });
    if (result.response === 0) shell.openExternal('https://www.apachefriends.org/download.html');
    throw new Error('PHP no encontrado');
  }

  const ffmpeg = findFfmpeg();
  if (ffmpeg) process.env.CLIPFORGE_FFMPEG = ffmpeg;

  const port = await findFreePort();
  const root = webRoot();
  phpProcess = spawn(php, ['-S', `127.0.0.1:${port}`, '-t', root], {
    cwd: root,
    windowsHide: true,
    env: { ...process.env, CLIPFORGE_FFMPEG: ffmpeg || '' }
  });

  phpProcess.stderr.on('data', data => console.log('[PHP]', data.toString()));
  phpProcess.on('exit', code => {
    if (code && !app.isQuitting) console.error('PHP exited:', code);
  });
  return `http://127.0.0.1:${port}/index.php`;
}

async function createWindow() {
  const url = await startPhpServer();
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#0b0d12',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.loadURL(url);
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(createWindow).catch(err => {
  dialog.showErrorBox('ClipForge', err.message);
  app.quit();
});

app.on('before-quit', () => {
  app.isQuitting = true;
  if (phpProcess && !phpProcess.killed) phpProcess.kill();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
