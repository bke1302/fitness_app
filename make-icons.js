const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const dir   = path.join(__dirname, 'icons');

// CRC32 table
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = (CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8)) >>> 0;
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.allocUnsafe(4); len.writeUInt32BE(data.length, 0);
  const crc = Buffer.allocUnsafe(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}

function makePNG(size) {
  const w = size, h = size;

  // Build raw scanlines (filter=0 + RGB bytes)
  const raw = Buffer.alloc(h * (1 + w * 3));
  let pos = 0;
  for (let y = 0; y < h; y++) {
    raw[pos++] = 0; // no filter
    for (let x = 0; x < w; x++) {
      const nx = x / w - 0.5;   // -0.5..0.5
      const ny = y / h - 0.5;

      // Dark background
      let r = 14, g = 11, b = 18;

      // Red radial glow
      const d = Math.sqrt(nx*nx + ny*ny) * 2; // 0..1.4
      const g1 = Math.max(0, 1 - d * 1.2);
      r = Math.min(255, r + Math.round(g1 * 80)) | 0;

      // ── letter P ──
      // Vertical stem:  x ∈ [-0.27,-0.09]  y ∈ [-0.37, 0.37]
      const inStem = nx >= -0.27 && nx <= -0.08 && ny >= -0.37 && ny <= 0.37;
      // Bowl outer:     x ∈ [-0.09, 0.24]  y ∈ [-0.37, 0.05]
      const inBowl = nx >= -0.09 && nx <= 0.24 && ny >= -0.37 && ny <= 0.05;
      // Bowl hole:      x ∈ [ 0.04, 0.20]  y ∈ [-0.25, 0.05]
      const inHole = nx >=  0.04 && nx <= 0.20 && ny >= -0.25 && ny <= 0.05;

      if ((inStem || inBowl) && !inHole) {
        // Gradient: #e63946 → #9333ea left to right
        const t = Math.max(0, Math.min(1, (nx + 0.27) / 0.51));
        r = Math.round(230 * (1-t) + 147 * t) | 0;
        g = Math.round( 57 * (1-t) +  51 * t) | 0;
        b = Math.round( 70 * (1-t) + 234 * t) | 0;
      }

      // "FIT" strip at bottom
      if (ny >= 0.29 && ny <= 0.40 && Math.abs(nx) < 0.30) {
        r = Math.min(255, r + 70);
        g = Math.min(255, g + 70);
        b = Math.min(255, b + 70);
      }

      raw[pos++] = r;
      raw[pos++] = g;
      raw[pos++] = b;
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 6 });

  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8]  = 8; // bit depth
  ihdr[9]  = 2; // RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]), // PNG signature
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

sizes.forEach(size => {
  const png = makePNG(size);
  fs.writeFileSync(path.join(dir, `icon-${size}.png`), png);
  console.log(`✅ icon-${size}.png  (${(png.length/1024).toFixed(1)} KB)`);
});
console.log('\n🎉 Done! All icons generated.');
