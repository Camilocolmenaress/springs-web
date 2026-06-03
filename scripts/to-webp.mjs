// Convierte todas las imágenes a WebP. Fuente preferida: original en .img-backup/
// (evita doble compresión); si no existe, usa el archivo actual.
// Root: max 1600px. Frames: tamaño nativo (los consume el canvas del scrub).
import sharp from "sharp";
import { readdir, stat, access } from "node:fs/promises";
import { join, extname, basename } from "node:path";

const ROOT = "public/images";
const FRAMES = "public/images/frames";
const BACKUP = ".img-backup";

async function exists(p) { try { await access(p); return true; } catch { return false; } }

async function convert(dir, { max, quality }) {
  const files = await readdir(dir);
  let before = 0, after = 0, n = 0;
  for (const f of files) {
    const ext = extname(f).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
    const cur = join(dir, f);
    const st = await stat(cur);
    if (!st.isFile()) continue;
    const backup = join(BACKUP, f);
    const source = (dir === ROOT && await exists(backup)) ? backup : cur;
    const out = join(dir, basename(f, ext) + ".webp");
    let pipe = sharp(source).rotate();
    if (max) {
      const meta = await sharp(source).metadata();
      if (Math.max(meta.width || 0, meta.height || 0) > max) {
        pipe = pipe.resize({ width: meta.width >= meta.height ? max : null, height: meta.height > meta.width ? max : null, withoutEnlargement: true });
      }
    }
    await pipe.webp({ quality, effort: 6 }).toFile(out);
    const outSt = await stat(out);
    before += st.size; after += outSt.size; n++;
  }
  return { n, before, after };
}

const r = await convert(ROOT, { max: 1600, quality: 82 });
const fr = await convert(FRAMES, { max: null, quality: 80 });
const mb = b => (b / 1048576).toFixed(1);
console.log(`root:   ${r.n} imgs · ${mb(r.before)}MB → ${mb(r.after)}MB`);
console.log(`frames: ${fr.n} imgs · ${mb(fr.before)}MB → ${mb(fr.after)}MB`);
console.log(`TOTAL webp generado: ${mb(r.after + fr.after)}MB (antes ${mb(r.before + fr.before)}MB)`);
