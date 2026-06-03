// Optimización de imágenes en sitio (mismo nombre/extensión → cero cambios de código).
// JPEG → mozjpeg q80, PNG (con alpha) → resize + cuantización. Max 1600px lado largo.
// Backup de originales en .img-backup/ antes de sobrescribir.
import sharp from "sharp";
import { readdir, mkdir, copyFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const DIR = "public/images";
const BACKUP = ".img-backup";
const MAX = 1600;
const MIN_BYTES = 400 * 1024; // solo tocar > 400KB

const files = await readdir(DIR);
await mkdir(BACKUP, { recursive: true });

let totalBefore = 0, totalAfter = 0, count = 0;
const rows = [];

for (const f of files) {
  const ext = extname(f).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
  const src = join(DIR, f);
  const st = await stat(src);
  if (!st.isFile() || st.size < MIN_BYTES) continue;

  await copyFile(src, join(BACKUP, f)); // backup

  const meta = await sharp(src).metadata();
  const longest = Math.max(meta.width || 0, meta.height || 0);
  let pipe = sharp(src).rotate();
  if (longest > MAX) {
    pipe = pipe.resize({ width: meta.width >= meta.height ? MAX : null, height: meta.height > meta.width ? MAX : null, withoutEnlargement: true });
  }
  if (ext === ".png") {
    pipe = pipe.png({ quality: 80, effort: 9, compressionLevel: 9, palette: true });
  } else {
    pipe = pipe.jpeg({ quality: 80, mozjpeg: true });
  }
  const buf = await pipe.toBuffer();
  // solo escribir si realmente reduce
  if (buf.length < st.size) {
    const { writeFile } = await import("node:fs/promises");
    await writeFile(src, buf);
  }
  totalBefore += st.size;
  totalAfter += Math.min(buf.length, st.size);
  count++;
  rows.push(`${(st.size/1048576).toFixed(1)}MB → ${(Math.min(buf.length,st.size)/1024).toFixed(0)}KB  ${f}  (${meta.width}x${meta.height}→${Math.min(longest,MAX)})`);
}

rows.sort();
console.log(rows.join("\n"));
console.log(`\n${count} imágenes · ${(totalBefore/1048576).toFixed(1)}MB → ${(totalAfter/1048576).toFixed(1)}MB  (−${(100*(1-totalAfter/totalBefore)).toFixed(0)}%)`);
