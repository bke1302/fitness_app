const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

// Files to copy as-is
const FILES = ['index.html', 'manifest.json', 'sw.js'];
FILES.forEach(f => {
  const src = path.join(__dirname, '..', f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST, f));
  } else {
    console.warn(`Warning: ${f} not found, skipping.`);
  }
});

// Copy icons directory
const iconsSrc = path.join(__dirname, '..', 'icons');
const iconsDst = path.join(DIST, 'icons');
if (fs.existsSync(iconsSrc)) {
  if (!fs.existsSync(iconsDst)) fs.mkdirSync(iconsDst, { recursive: true });
  fs.readdirSync(iconsSrc).forEach(file => {
    fs.copyFileSync(path.join(iconsSrc, file), path.join(iconsDst, file));
  });
} else {
  console.warn('Warning: icons/ directory not found, skipping.');
}

console.log('Assets copied to dist/');
