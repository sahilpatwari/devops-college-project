/**
 * Simple build script — copies production files into dist/.
 * This simulates a real build step in the CI/CD pipeline.
 */

const fs = require('fs');
const path = require('path');

const SRC_DIRS = ['public'];
const FILES = ['server.js', 'package.json', 'package-lock.json'];
const DIST = path.join(__dirname, '..', 'dist');

function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Clean dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST, { recursive: true });

// Copy directories
for (const dir of SRC_DIRS) {
  const src = path.join(__dirname, '..', dir);
  if (fs.existsSync(src)) {
    copyRecursive(src, path.join(DIST, dir));
  }
}

// Copy individual files
for (const file of FILES) {
  const src = path.join(__dirname, '..', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST, file));
  }
}

console.log('✅  Build complete — output in dist/');
