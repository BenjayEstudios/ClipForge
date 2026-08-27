const fs = require('fs');
const path = require('path');

const sourceRoot = path.resolve(__dirname, '..');
const webRoot = path.join(__dirname, 'web');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

fs.rmSync(webRoot, { recursive: true, force: true });
fs.mkdirSync(webRoot, { recursive: true });
for (const name of ['index.php', 'api', 'assets']) {
  const src = path.join(sourceRoot, name);
  const dst = path.join(webRoot, name);
  if (fs.statSync(src).isDirectory()) copyDir(src, dst);
  else fs.copyFileSync(src, dst);
}
for (const name of ['videos', 'audio', 'outputs']) {
  fs.mkdirSync(path.join(webRoot, 'storage', name), { recursive: true });
}
console.log('ClipForge web files prepared in desktop/web');
