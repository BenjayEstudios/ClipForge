const { app, BrowserWindow, dialog, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

let phpProcess = null;
let mainWindow = null;

function findExisting(paths) { return paths.find(p => p && fs.existsSync(p)); }
function findPhp() {
  return findExisting([path.join(process.resourcesPath || '', 'runtime', 'php.exe'), 'C:\\xampp\\php\\php.exe', 'C:\\xampp\\php\\php-cgi.exe']);
}
function findFfmpeg() {
  return findExisting([process.env.CLIPFORGE_FFMPEG, path.join(process.resourcesPath || '', 'runtime', 'ffmpeg.exe'), 'C:\\ffmpeg\\ffmpeg-9.0.1-essentials_build\\bin\\ffmpeg.exe', 'C:\\ffmpeg\\bin\\ffmpeg.exe', 'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe']);
}
function findFreePort() {
  return new Promise((resolve, reject) => { const server = net.createServer(); server.listen(0, '127.0.0.1', () => { const port = server.address().port; server.close(() => resolve(port)); }); server.on('error', reject); });
}
function webRoot() { return app.isPackaged ? path.join(process.resourcesPath, 'web') : path.resolve(__dirname, 'web'); }
async function startPhpServer() {
  const php = findPhp();
  if (!php) { await dialog.showMessageBox({ type:'error', title:'ClipForge no encuentra PHP', message:'No se encontró PHP de XAMPP.', detail:'Esta versión de desarrollo usa C:\\xampp\\php\\php.exe.', buttons:['Cerrar'] }); throw new Error('PHP no encontrado'); }
  const ffmpeg = findFfmpeg();
  const root = webRoot();
  if (!fs.existsSync(path.join(root, 'index.php'))) throw new Error(`No se encontraron los archivos web de ClipForge en: ${root}`);
  const port = await findFreePort();
  const args = ['-d','upload_max_filesize=2G','-d','post_max_size=2G','-d','max_execution_time=0','-d','max_input_time=0','-d','memory_limit=1G','-S',`127.0.0.1:${port}`,'-t',root];
  phpProcess = spawn(php, args, { cwd:root, windowsHide:true, env:{...process.env, CLIPFORGE_FFMPEG:ffmpeg || ''} });
  phpProcess.stderr.on('data', data => console.log('[PHP]', data.toString()));
  phpProcess.on('error', err => console.error('[PHP process error]', err));
  phpProcess.on('exit', code => { if (code && !app.isQuitting) console.error('PHP exited:', code); });
  await new Promise(resolve => setTimeout(resolve, 350));
  return `http://127.0.0.1:${port}/index.php`;
}
async function createWindow() {
  const url = await startPhpServer();
  mainWindow = new BrowserWindow({ width:1440,height:920,minWidth:1000,minHeight:700,backgroundColor:'#0b0d12',autoHideMenuBar:true,show:false,webPreferences:{contextIsolation:true,nodeIntegration:false} });
  mainWindow.webContents.on('did-fail-load', (_e,code,description,url2) => dialog.showErrorBox('ClipForge no pudo cargar',`Código: ${code}\n${description}\n${url2}`));
  mainWindow.webContents.on('render-process-gone', (_e,d) => dialog.showErrorBox('ClipForge',`La interfaz terminó: ${d.reason}`));
  mainWindow.loadURL(url); mainWindow.once('ready-to-show',()=>mainWindow.show()); mainWindow.on('closed',()=>{mainWindow=null;});
}
app.whenReady().then(createWindow).catch(err=>{dialog.showErrorBox('ClipForge',err.stack||err.message);app.quit();});
app.on('before-quit',()=>{app.isQuitting=true;if(phpProcess&&!phpProcess.killed)phpProcess.kill();});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
