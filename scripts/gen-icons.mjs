// 生成「今日运势」全套站点图标资产。
//
// 品牌标记：靛紫圆角方 + 白色「运」。字形轮廓取自 Noto Sans SC Black（OFL），
// 已按「墨迹外框中心对齐 64×64 画布中心」预先变换并烘焙成下面的 GLYPH_D 常量，
// 因此本脚本不依赖字体文件，只依赖一个无头 Chromium 做栅格化。
//
//   node scripts/gen-icons.mjs
//
// 产物写入 public/：favicon.svg / favicon.ico / apple-touch-icon.png /
// icon-192.png / icon-512.png / logo.png / og-image.png

import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';
import { existsSync, readdirSync } from 'node:fs';

const run = promisify(execFile);
const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// --- 规格 ---------------------------------------------------------------
const DUSK = '#5b4ae8';   // --color-dusk
const INK = '#11152f';    // --color-ink
const GOLD = '#d9a441';   // --color-gold
const WHITE = '#ffffff';
const CANVAS = 64;        // 标记的 viewBox
const RADIUS = 15;        // 圆角，约 23%，贴合站内 --radius: 1rem
const FACE = 40;          // 「运」墨迹外框跨度，62.5%
// 16px 单独放大字面：那个尺寸上笔画间隙不足 1px，字面越大间隙才越保得住。
// 这是 favicon 的常规做法（逐尺寸 hinting），一次只会看到其中一个尺寸。
const FACE_16 = 48;       // 75%
const RADIUS_16 = 12;

// Noto Sans SC 900「运」，已缩放到墨迹外框跨度 40 并居中于 (32, 32)。
const GLYPH_D = 'M26.98 13.38H48.3V18.93H26.98ZM24.18 22.31H50.89V27.86H24.18ZM39.12 30.54 44.1 28.28Q45.17 30.13 46.47 32.29Q47.76 34.45 48.95 36.53Q50.15 38.6 50.89 40.17L45.5 42.88Q44.88 41.28 43.77 39.14Q42.66 37 41.42 34.74Q40.19 32.47 39.12 30.54ZM23.07 25.48V42.68H17.23V30.95H12.53V25.48ZM13.23 16.47 17.19 12.72Q18.26 13.5 19.63 14.49Q21.01 15.48 22.33 16.44Q23.65 17.41 24.47 18.15L20.31 22.43Q19.57 21.65 18.32 20.6Q17.06 19.55 15.7 18.46Q14.35 17.37 13.23 16.47ZM20.93 40.58Q21.88 40.58 22.82 41.22Q23.77 41.86 25.37 42.76Q27.43 44 30.23 44.28Q33.03 44.57 36.36 44.57Q37.84 44.57 39.84 44.49Q41.84 44.41 44.02 44.26Q46.2 44.12 48.28 43.91Q50.35 43.71 52 43.42Q51.67 44.28 51.26 45.5Q50.85 46.71 50.54 47.93Q50.23 49.14 50.19 50Q48.95 50.09 47.27 50.17Q45.58 50.25 43.65 50.31Q41.71 50.37 39.76 50.42Q37.8 50.46 36.12 50.46Q32.21 50.46 29.55 50Q26.9 49.55 24.72 48.4Q23.44 47.7 22.43 47Q21.42 46.3 20.81 46.3Q20.19 46.3 19.39 47.08Q18.58 47.86 17.74 49Q16.9 50.13 16.12 51.28L12 45.35Q13.48 43.95 15.09 42.88Q16.69 41.81 18.21 41.2Q19.74 40.58 20.93 40.58ZM27.1 42.27Q26.94 41.65 26.59 40.58Q26.24 39.51 25.81 38.36Q25.37 37.21 25 36.38Q25.7 36.18 26.26 35.66Q26.81 35.15 27.43 34.33Q27.72 33.91 28.26 33.03Q28.79 32.14 29.43 30.91Q30.07 29.67 30.68 28.26Q31.3 26.84 31.75 25.35L38.5 27.08Q37.51 29.26 36.16 31.49Q34.8 33.71 33.36 35.66Q31.92 37.62 30.6 39.1V39.22Q30.6 39.22 30.07 39.53Q29.53 39.84 28.85 40.33Q28.17 40.83 27.64 41.34Q27.1 41.86 27.1 42.27ZM27.1 42.27 26.9 37.58 30.02 35.68 46.69 34.41Q46.9 35.6 47.27 37.12Q47.64 38.65 47.93 39.59Q43.03 40.09 39.63 40.44Q36.24 40.79 34.06 41.03Q31.88 41.28 30.54 41.47Q29.2 41.65 28.44 41.84Q27.68 42.02 27.1 42.27Z';

// 围绕画布中心缩放字面，居中关系不变。
const glyph = (face = FACE, fill = WHITE) => {
  const k = face / FACE;
  const t = k === 1 ? '' : ` transform="translate(${CANVAS / 2} ${CANVAS / 2}) scale(${k}) translate(${-CANVAS / 2} ${-CANVAS / 2})"`;
  return `<path${t} fill="${fill}" d="${GLYPH_D}"/>`;
};

const mark = ({ face = FACE, radius = RADIUS, bg = DUSK } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}"><rect width="${CANVAS}" height="${CANVAS}" rx="${radius}" fill="${bg}"/>${glyph(face)}</svg>`;

// --- 栅格化 -------------------------------------------------------------
function findChrome() {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (existsSync(chrome)) return chrome;
  const cache = join(process.env.HOME, 'Library/Caches/ms-playwright');
  if (existsSync(cache)) {
    for (const dir of readdirSync(cache).filter((d) => d.startsWith('chromium')).sort().reverse()) {
      for (const rel of ['chrome-mac/headless_shell', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
        const p = join(cache, dir, rel);
        if (existsSync(p)) return p;
      }
    }
  }
  throw new Error('找不到可用的 Chromium：请安装 Google Chrome 或 playwright 浏览器');
}
const CHROME = findChrome();

async function shoot(html, width, height, tmp, name) {
  const page = join(tmp, `${name}.html`);
  const out = join(tmp, `${name}.png`);
  await writeFile(page, `<!doctype html><meta charset="utf-8"><style>*{margin:0;padding:0}html,body{width:${width}px;height:${height}px;overflow:hidden}svg,div{display:block}</style>${html}`);
  await run(CHROME, [
    '--headless', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--default-background-color=00000000', `--window-size=${width},${height}`,
    `--screenshot=${out}`, `file://${page}`,
  ], { timeout: 60_000 });
  return readFile(out);
}

const iconHTML = (size, opts) =>
  mark(opts).replace('<svg ', `<svg width="${size}" height="${size}" `);

// --- PNG 解码（只为校验，够用即可：Chrome 出的是 8bit 非隔行 PNG）--------
function decodePNG(buf) {
  let pos = 8, width = 0, height = 0, colorType = 0, idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      if (data[8] !== 8) throw new Error('只支持 8bit PNG');
      colorType = data[9];
      if (data[12] !== 0) throw new Error('不支持隔行 PNG');
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
  if (!ch) throw new Error(`不支持的 colorType ${colorType}`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * ch;
  const px = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? px[y * stride + x - ch] : 0;
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c = x >= ch && y > 0 ? px[(y - 1) * stride + x - ch] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[y * stride + x] = v & 0xff;
    }
  }
  return { width, height, ch, px };
}

// 白色字面的墨迹外框：以「接近纯白」为墨，抗锯齿像素按亮度加权。
function inkBounds(png, threshold = 200) {
  const { width, height, ch, px } = png;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * ch;
      const [r, g, b] = [px[i], px[i + 1], px[i + 2]];
      const alpha = ch === 4 ? px[i + 3] : 255;
      if (alpha > 128 && r > threshold && g > threshold && b > threshold) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < x0) throw new Error('图里找不到白色字面');
  return { x0, y0, x1, y1, cx: (x0 + x1 + 1) / 2, cy: (y0 + y1 + 1) / 2 };
}

function assertCentered(png, label, tol) {
  const b = inkBounds(png);
  const dx = b.cx - png.width / 2, dy = b.cy - png.height / 2;
  const ok = Math.abs(dx) <= tol && Math.abs(dy) <= tol;
  console.log(`  ${ok ? '✓' : '✗'} ${label} 居中偏差 dx=${dx.toFixed(2)}px dy=${dy.toFixed(2)}px（阈值 ${tol}px），字面 ${b.x1 - b.x0 + 1}×${b.y1 - b.y0 + 1}`);
  if (!ok) throw new Error(`${label} 未居中`);
}

// --- ICO 打包（PNG-in-ICO，现代浏览器与 Windows Vista+ 均支持）----------
function buildICO(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e[0] = size >= 256 ? 0 : size; e[1] = size >= 256 ? 0 : size;
    e[2] = 0; e[3] = 0;
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8); e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

// --- og-image -----------------------------------------------------------
const OG_HTML = `
<div style="width:1200px;height:630px;position:relative;overflow:hidden;background:
    radial-gradient(1000px 620px at 12% -12%, rgba(91,74,232,.55), transparent 68%),
    radial-gradient(760px 520px at 96% 116%, rgba(217,164,65,.16), transparent 70%),
    ${INK};
  font-family:'PingFang SC','Noto Sans SC','Hiragino Sans GB',sans-serif;color:#fff;
  display:flex;flex-direction:column;justify-content:center;padding:0 96px;box-sizing:border-box">
  <svg viewBox="0 0 64 64" width="620" height="620" style="position:absolute;right:-96px;top:50%;transform:translateY(-50%);opacity:.05">${glyph(FACE, WHITE)}</svg>
  <div style="display:flex;align-items:center;gap:24px;position:relative">
    ${iconHTML(84)}
    <div style="font-size:30px;font-weight:600;letter-spacing:.28em;color:rgba(255,255,255,.62)">JINRIYUNSHI</div>
  </div>
  <div style="font-size:104px;font-weight:800;letter-spacing:-.02em;margin-top:44px;line-height:1.1">今日运势</div>
  <div style="font-size:40px;color:rgba(255,255,255,.78);margin-top:20px">十二星座每日运势查询</div>
  <div style="display:flex;align-items:center;gap:20px;margin-top:52px">
    <div style="width:88px;height:3px;background:${GOLD};border-radius:2px"></div>
    <div style="font-size:28px;color:${GOLD};letter-spacing:.05em">十二星座 · 每日更新</div>
  </div>
</div>`;

// --- 主流程 -------------------------------------------------------------
const tmp = await mkdtemp(join(tmpdir(), 'jry-icons-'));
try {
  console.log(`Chromium: ${CHROME}\n`);

  const svg = `${mark()}\n`;
  await writeFile(join(PUBLIC, 'favicon.svg'), svg);
  console.log('  favicon.svg');

  // 位图：[文件名, 尺寸, 选项, 居中容差]
  const targets = [
    ['ico-16', 16, { face: FACE_16, radius: RADIUS_16 }, 0.5],
    ['ico-32', 32, {}, 0.5],
    ['ico-48', 48, {}, 0.5],
    ['apple-touch-icon.png', 180, { radius: 0 }, 0.5],  // iOS 自己加圆角遮罩
    ['icon-192.png', 192, {}, 0.5],
    ['icon-512.png', 512, {}, 1],
    ['logo.png', 512, {}, 1],
  ];
  const icoParts = [];
  for (const [name, size, opts, tol] of targets) {
    const data = await shoot(iconHTML(size, opts), size, size, tmp, name.replace(/\W/g, '_'));
    assertCentered(decodePNG(data), `${name} @${size}`, tol);
    if (name.startsWith('ico-')) icoParts.push({ size, data });
    else await writeFile(join(PUBLIC, name), data);
  }

  const ico = buildICO(icoParts);
  await writeFile(join(PUBLIC, 'favicon.ico'), ico);
  console.log(`  favicon.ico（16/32/48，${(ico.length / 1024).toFixed(1)}KB）`);

  const og = await shoot(OG_HTML, 1200, 630, tmp, 'og');
  await writeFile(join(PUBLIC, 'og-image.png'), og);
  console.log(`  og-image.png（1200×630，${(og.length / 1024).toFixed(1)}KB）`);

  console.log('\n全部资产已写入 public/');
} finally {
  await rm(tmp, { recursive: true, force: true });
}
