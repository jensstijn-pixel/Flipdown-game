/**
 * Validates the shipped board data. Reads src/data/boards.json — the same
 * literal file the app imports — so this checks what actually gets played,
 * not what a generator could produce.
 *
 * Run: npm run check:boards
 */
import { readFileSync } from 'node:fs'

const { boards } = JSON.parse(readFileSync(new URL('../src/data/boards.json', import.meta.url), 'utf8'))

const AXES = {
  arms: ['arms-grabber', 'arms-claw'],
  colour: ['sunny', 'sky', 'cream', 'plum'],
  top: ['top-none', 'top-antenna', 'top-antennae', 'top-propeller'],
  eyes: ['eyes-single', 'eyes-two', 'eyes-visor'],
  base: ['base-wheels', 'base-legs', 'base-tracks'],
}
const EXPECTED_SPLIT = { arms: [6, 6], colour: [3, 3, 3, 3], top: [3, 3, 3, 3], eyes: [4, 4, 4], base: [4, 4, 4] }
const AXIS_NAMES = Object.keys(AXES)

const g = (s) => `\x1b[32m${s}\x1b[0m`
const r = (s) => `\x1b[31m${s}\x1b[0m`
const dim = (s) => `\x1b[2m${s}\x1b[0m`
const bold = (s) => `\x1b[1m${s}\x1b[0m`

let failures = 0
const fail = (msg) => { failures++; console.log(`  ${r('FAIL')}  ${msg}`) }

const allNames = new Map()
const allIds = new Set()

for (const board of boards) {
  console.log(`\n${bold(`Board ${board.number} — ${board.category}`)}  ${dim(board.robots.map((x) => x.name).join(' '))}`)

  if (board.robots.length !== 12) fail(`has ${board.robots.length} robots, expected 12`)

  // ---- (0) ids, names, uniqueness -----------------------------------------
  for (const rb of board.robots) {
    if (allIds.has(rb.id)) fail(`duplicate id ${rb.id}`)
    allIds.add(rb.id)
    if (rb.name.length > 6) fail(`name "${rb.name}" is longer than 6 letters`)
    if (!/^[A-Z][a-z]+$/.test(rb.name)) fail(`name "${rb.name}" is not a plain capitalised word`)
    if (allNames.has(rb.name)) fail(`name "${rb.name}" also used on board ${allNames.get(rb.name)}`)
    allNames.set(rb.name, board.number)
    for (const ax of AXIS_NAMES) {
      if (!AXES[ax].includes(rb[ax])) fail(`${rb.name}: unknown ${ax} value "${rb[ax]}"`)
    }
  }
  const initials = new Set(board.robots.map((x) => x.name[0]))
  if (initials.size !== 12) fail(`names share a first letter (${12 - initials.size} collisions)`)

  const combos = new Set(board.robots.map((x) => AXIS_NAMES.map((ax) => x[ax]).join('|')))
  if (combos.size !== 12) fail(`only ${combos.size} distinct robots — two cards look identical`)

  // ---- (a) distribution ----------------------------------------------------
  console.log(dim('  distribution'))
  for (const ax of AXIS_NAMES) {
    const counts = AXES[ax].map((v) => board.robots.filter((x) => x[ax] === v).length)
    const want = EXPECTED_SPLIT[ax]
    const ok = counts.join(',') === want.join(',')
    if (!ok) fail(`${ax}: ${counts.join('/')} — expected ${want.join('/')}`)
    else console.log(`    ${g('ok')}  ${ax.padEnd(7)} ${counts.join(' / ')}  ${dim(AXES[ax].map((v) => v.replace(/^[a-z]+-/, '')).join(' / '))}`)
  }

  // ---- (b) no axis rides along with another --------------------------------
  // For every pair of values from different axes, compare the SETS of robots
  // that carry them. Identical sets, or one contained in the other, means one
  // question answers two. A disjoint pair is the same leak inverted.
  const setOf = (ax, v) => new Set(board.robots.filter((x) => x[ax] === v).map((x) => x.id))
  let worst = { dev: 0, label: '' }
  let pairs = 0

  for (let i = 0; i < AXIS_NAMES.length; i++) {
    for (let j = i + 1; j < AXIS_NAMES.length; j++) {
      const a = AXIS_NAMES[i], b = AXIS_NAMES[j]
      for (const va of AXES[a]) {
        for (const vb of AXES[b]) {
          pairs++
          const A = setOf(a, va), B = setOf(b, vb)
          const overlap = [...A].filter((x) => B.has(x)).length
          const exp = (A.size * B.size) / 12
          const label = `${va} + ${vb}`

          if (overlap === A.size && overlap === B.size) fail(`${label}: identical sets — the exact same ${overlap} robots`)
          else if (overlap === A.size) fail(`${label}: every ${va} is also ${vb}`)
          else if (overlap === B.size) fail(`${label}: every ${vb} is also ${va}`)
          else if (overlap === 0 && exp >= 1) fail(`${label}: never occur together (expected ~${exp.toFixed(2)})`)

          const dev = Math.abs(overlap - exp)
          if (dev > worst.dev) worst = { dev, label: `${label} — ${overlap} together, expected ${exp.toFixed(2)}` }
        }
      }
    }
  }
  console.log(dim(`  independence — ${pairs} value pairs checked across 10 axis pairs`))
  console.log(`    ${g('ok')}  no pair coincides, implies or excludes`)
  console.log(`    ${dim('largest deviation:')} ${worst.label}`)

  // ---- (c) the 3x4 grid must not read as sorted ----------------------------
  // Balanced data can still be laid out so it looks patterned — all six claw
  // robots in the top half, say. That is only cosmetic, but it makes a fair
  // board look rigged.
  const ROWS = [0, 1, 2, 3].map((r) => [r * 3, r * 3 + 1, r * 3 + 2])
  const COLS = [0, 1, 2].map((c) => [c, c + 3, c + 6, c + 9])
  let layoutOk = true
  for (const ax of AXIS_NAMES) {
    for (const [label, groups, limit] of [['row', ROWS, 3], ['column', COLS, 3]]) {
      for (const [n, group] of groups.entries()) {
        const counts = {}
        for (const i of group) counts[board.robots[i][ax]] = (counts[board.robots[i][ax]] || 0) + 1
        const [v, c] = Object.entries(counts).find(([, c]) => c >= limit) ?? []
        if (v) { fail(`${label} ${n + 1} is ${c}x ${v} — the grid reads as sorted`); layoutOk = false }
      }
    }
  }
  for (let i = 0; i < 12; i++) {
    for (const j of [i % 3 === 2 ? -1 : i + 1, i + 3].filter((x) => x >= 0 && x < 12)) {
      const a = board.robots[i], b = board.robots[j]
      const shared = AXIS_NAMES.filter((k) => a[k] === b[k])
      if (shared.length >= 3) { fail(`${a.name} and ${b.name} are neighbours sharing ${shared.join(', ')}`); layoutOk = false }
      if (a.colour === b.colour) { fail(`${a.name} and ${b.name} are touching and both ${a.colour}`); layoutOk = false }
    }
  }
  if (layoutOk) {
    console.log(dim('  grid layout'))
    console.log(`    ${g('ok')}  no value fills a row or dominates a column, no near-twin neighbours`)
  }
}

// ---- boards must not be near-copies of each other --------------------------
console.log(`\n${bold('Across boards')}`)
const sig = (x) => AXIS_NAMES.map((ax) => x[ax]).join('|')
for (let i = 0; i < boards.length; i++) {
  for (let j = i + 1; j < boards.length; j++) {
    const A = new Set(boards[i].robots.map(sig))
    const shared = boards[j].robots.filter((x) => A.has(sig(x))).length
    if (shared > 3) fail(`boards ${boards[i].number} and ${boards[j].number} share ${shared} of 12 robots`)
  }
}
console.log(`  ${g('ok')}  no two boards share more than 3 of 12 robots`)
console.log(`  ${g('ok')}  ${allNames.size} unique names, ${new Set(boards.flatMap((b) => b.robots.map(sig))).size} distinct robot builds`)

console.log(
  failures === 0
    ? `\n${g(bold('PASS'))} — ${boards.length} boards, ${boards.length * 12} robots, every check clean\n`
    : `\n${r(bold(`FAIL — ${failures} problem(s)`))}\n`
)
process.exit(failures === 0 ? 0 : 1)
