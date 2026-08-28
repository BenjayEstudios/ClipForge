const { app, BrowserWindow, dialog, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

let phpProcess = null;
let mainWindow = null;

function findExisting(paths) { return paths.find(p => p && fs.existsSync(p)); }
function findPhp() {
  return findExisting([
    path.join(process.resourcesPath || '', 'runtime', 'php.exe'),
    'C:\\xampp\\php\\php.exe'
  ]);
}
function findFfmpeg() {
  return findExisting([
    process.env.CLIPFORGE_FFMPEG,
    path.join(process.resourcesPath || '', 'runtime', 'ffmpeg.exe'),
    'C:\\ffmpeg\\ffmpeg-9.0.1-essentials_build\\bin\\ffmpeg.exe',
    'C:\\ffmpeg\\bin\\ffmpeg.exe',
    'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe'
  ]);
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
  return app.isPackaged ? path.join(process.resourcesPath, 'web') : path.join(__dirname, 'web');
}

async function startPhpServer() {
  const php = findPhp();
  if (!php) {
    const result = await dialog.showMessageBox({type:'error', title:'ClipForge no encuentra PHP', message:'No se encontró PHP.', detail:'Instala XAMPP en C:\\xampp o coloca php.exe en desktop\\runtime.', buttons:['Abrir XAMPP','Cerrar']});
    if (result.response === 0) shell.openExternal('https://www.apachefriends.org/download.html');
    throw new Error('PHP no encontrado');
  }
  const ffmpeg = findFfmpeg();
  const root = webRoot();
  if (!fs.existsSync(path.join(root,'index.php'))) throw new Error(`No se encontraron los archivos web de ClipForge en: ${root}`);
  const port = await findFreePort();
  const phpArgs = [
    '-d','upload_max_filesize=2G', '-d','post_max_size=2G', '-d','memory_limit=1G',
    '-d','max_execution_time=0', '-d','max_input_time=0', '-d','display_errors=1', '-d','log_errors=1',
    '-S', `127.0.0.1:${port}`, '-t', root
  ];
  phpProcess = spawn(php, phpArgs, {cwd:root, windowsHide:true, env:{...process.env, CLIPFORGE_FFMPEG:ffmpeg||''}});
  phpProcess.stdout.on('data', d=>console.log('[PHP STDOUT]', d.toString().trimEnd()));
  phpProcess.stderr.on('data', d=>console.log('[PHP]', d.toString().trimEnd()));
  phpProcess.on('error', e=>console.error('[PHP PROCESS ERROR]', e));
  phpProcess.on('exit', code=>{ if(code && !app.isQuitting) console.error('[PHP EXIT]',code); });
  await new Promise(r=>setTimeout(r,350));
  return `http://127.0.0.1:${port}/index.php`;
}

async function createWindow() {
  const url = await startPhpServer();
  mainWindow = new BrowserWindow({
    width:1280,
    height:820,
    minWidth:1120,
    minHeight:720,
    backgroundColor:'#161b22',
    autoHideMenuBar:true,
    show:false,
    center:true,
    webPreferences:{contextIsolation:true,nodeIntegration:false}
  });
  try {
    mainWindow.setTitleBarOverlay({ color:'#161b22', symbolColor:'#c6d0db', height:32 });
  } catch (_) {}
  mainWindow.webContents.on('console-message', (_e, level, message, line, sourceId)=>console.log(`[UI ${['DEBUG','INFO','WARN','ERROR'][level]||level}] ${message} (${sourceId}:${line})`));
  mainWindow.webContents.on('did-fail-load', (_e, code, description, validatedURL)=>dialog.showErrorBox('ClipForge — Error de carga',`Código ${code}\n${description}\n${validatedURL}`));
  mainWindow.webContents.on('render-process-gone', (_e, details)=>dialog.showErrorBox('ClipForge',`La interfaz terminó: ${details.reason}`));
  mainWindow.loadURL(url);
  mainWindow.once('ready-to-show',()=>mainWindow.show());
  mainWindow.on('closed',()=>{mainWindow=null;});
}
app.whenReady().then(createWindow).catch(e=>{dialog.showErrorBox('ClipForge',e.stack||e.message);app.quit();});
app.on('before-quit',()=>{app.isQuitting=true;if(phpProcess&&!phpProcess.killed)phpProcess.kill();});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
