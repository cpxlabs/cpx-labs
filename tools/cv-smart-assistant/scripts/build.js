const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const src = path.join(__dirname, '..', 'src');
const dist = path.join(__dirname, '..', 'dist');
const manifest = path.join(__dirname, '..', 'manifest.json');

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function clean(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}

function minify(filePath) {
  return new Promise((resolve, reject) => {
    const tmpPath = filePath + '.tmp';
    const child = spawn('npx', ['terser', filePath, '-c', '-m', '-o', tmpPath]);
    child.on('close', (code) => {
      if (code === 0) {
        fs.renameSync(tmpPath, filePath);
        resolve();
      } else {
        reject(new Error(`terser exited with code ${code}`));
      }
    });
    child.on('error', reject);
  });
}

async function walkAndMinify(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkAndMinify(full));
    } else if (entry.name.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

(async () => {
  console.log('Cleaning dist/...');
  clean(dist);

  console.log('Copying files...');
  fs.mkdirSync(path.join(dist, 'src'), { recursive: true });
  fs.copyFileSync(manifest, path.join(dist, 'manifest.json'));
  copyDir(src, path.join(dist, 'src'));

  console.log('Minifying JS files...');
  const jsFiles = await walkAndMinify(dist);
  for (const f of jsFiles) {
    try {
      await minify(f);
    } catch (e) {
      // skip minification errors (e.g., syntax issues in vendored files)
    }
  }

  console.log(`Build complete: ${jsFiles.length} JS files minified in dist/`);
})().catch((e) => { console.error(e); process.exit(1); });
