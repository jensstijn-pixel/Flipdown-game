/**
 * Authoring-time icon generator. Draws the app icon (a robot head in the game's
 * own palette) and writes public/icons/*.png. No image library on the machine,
 * so this rasterises a handful of shapes and encodes the PNG directly.
 *
 * Run: node scripts/gen-icons.mjs
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const CRC = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return (buf) => {
    let c = -1
    for (const b of buf) c = t[(c ^ b) & 0xff] ^ (c >>> 8)
    return (c ^ -1) >>> 0
  }
})()

const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(CRC(body))
  return Buffer.concat([len, body, crc])
}

function png(size, pixels) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0 // filter: none
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))

// Shapes are described on a 200x200 stage and supersampled 4x4 for clean edges.
const roundRect = (x, y, w, h, r) => (px, py) => {
  const cx = Math.max(x + r, Math.min(px, x + w - r))
  const cy = Math.max(y + r, Math.min(py, y + h - r))
  return px >= x && px <= x + w && py >= y && py <= y + h && Math.hypot(px - cx, py - cy) <= r
}
const circle = (cx, cy, r) => (px, py) => Math.hypot(px - cx, py - cy) <= r

const OUTLINE = '#273140'
// Painted back to front.
const SHAPES = [
  { fill: '#221E19', hit: () => true },
  // antenna
  { fill: OUTLINE, hit: roundRect(96, 26, 8, 34, 4) },
  { fill: OUTLINE, hit: circle(100, 26, 14) },
  { fill: '#E8871E', hit: circle(100, 26, 9) },
  // head
  { fill: OUTLINE, hit: roundRect(38, 52, 124, 108, 26) },
  { fill: '#F7C948', hit: roundRect(44, 58, 112, 96, 21) },
  // eyes
  { fill: OUTLINE, hit: circle(74, 104, 26) },
  { fill: OUTLINE, hit: circle(126, 104, 26) },
  { fill: '#FFFFFF', hit: circle(74, 104, 20) },
  { fill: '#FFFFFF', hit: circle(126, 104, 20) },
  { fill: OUTLINE, hit: circle(74, 104, 9) },
  { fill: OUTLINE, hit: circle(126, 104, 9) },
  // mouth plate
  { fill: OUTLINE, hit: roundRect(70, 168, 60, 18, 9) },
  { fill: '#E8871E', hit: roundRect(74, 172, 52, 10, 5) },
]

function render(size) {
  const buf = Buffer.alloc(size * size * 4)
  const SS = 4
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = ((x + (sx + 0.5) / SS) / size) * 200
          const py = ((y + (sy + 0.5) / SS) / size) * 200
          let col = SHAPES[0].fill
          for (const s of SHAPES) if (s.hit(px, py)) col = s.fill
          const [cr, cg, cb] = hex(col)
          r += cr; g += cg; b += cb
        }
      }
      const n = SS * SS
      const i = (y * size + x) * 4
      buf[i] = Math.round(r / n)
      buf[i + 1] = Math.round(g / n)
      buf[i + 2] = Math.round(b / n)
      buf[i + 3] = 255
    }
  }
  return buf
}

mkdirSync(new URL('../public/icons/', import.meta.url), { recursive: true })
for (const size of [192, 512]) {
  writeFileSync(new URL(`../public/icons/icon-${size}.png`, import.meta.url), png(size, render(size)))
  console.log(`wrote public/icons/icon-${size}.png`)
}
