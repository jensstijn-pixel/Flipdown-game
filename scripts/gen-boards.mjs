/**
 * Authoring-time board search. NOT shipped, NOT run at runtime.
 *
 * Writes src/data/boards.json once; that file is the literal, committed source
 * of truth. Both phones read the same static JSON, so which 12 robots you see
 * can never depend on a PRNG, a seed, a clock or any implementation detail.
 *
 * What we are searching for: the marginals are fixed (arms 6/6, colour 3/3/3/3,
 * top 3/3/3/3, eyes 4/4/4, base 4/4/4), and on top of that the five axes must
 * be as close to statistically independent as 12 cards allow, so that no
 * attribute ever hitchhikes on another. Cost is the summed squared deviation of
 * every cross-tab cell from its expected count, with a hard penalty for cells
 * that a good board can never have:
 *
 *   - an empty cell where the expected count is >= 1  (that value implies the
 *     absence of another -> a free extra answer per question)
 *   - two values that cover exactly the same robots, or one that is a subset
 *     of another (asking about one answers the other)
 *
 * The only unavoidable holes are in colour x top: 16 cells for 12 robots with
 * row and column sums of 3 forces exactly four zeros. Expected there is 0.75,
 * so a zero is the closest a cell can get.
 *
 * Run: node scripts/gen-boards.mjs
 */
import { writeFileSync } from 'node:fs'

const AXES = {
  top: ['top-none', 'top-antenna', 'top-antennae', 'top-propeller'],
  eyes: ['eyes-single', 'eyes-two', 'eyes-visor'],
  base: ['base-wheels', 'base-legs', 'base-tracks'],
  arms: ['arms-grabber', 'arms-claw'],
  colour: ['sunny', 'sky', 'cream', 'plum'],
}
const AXIS_NAMES = Object.keys(AXES)

/** The required split of each axis over the 12 cards. */
const QUOTA = {
  top: [3, 3, 3, 3],
  eyes: [4, 4, 4],
  base: [4, 4, 4],
  arms: [6, 6],
  colour: [3, 3, 3, 3],
}

// Deterministic PRNG: a re-run reproduces byte-identical boards.
let seed = 0x9e3779b9
const rnd = () => {
  seed ^= seed << 13; seed >>>= 0
  seed ^= seed >>> 17
  seed ^= seed << 5; seed >>>= 0
  return seed / 0x100000000
}
const randInt = (n) => Math.floor(rnd() * n)
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** A board is one column of value-indices per axis; the quota fixes the marginals. */
const freshColumns = () => {
  const cols = {}
  for (const ax of AXIS_NAMES) {
    const col = []
    QUOTA[ax].forEach((n, v) => { for (let i = 0; i < n; i++) col.push(v) })
    cols[ax] = shuffle(col)
  }
  return cols
}

const PAIRS = []
for (let i = 0; i < AXIS_NAMES.length; i++)
  for (let j = i + 1; j < AXIS_NAMES.length; j++) PAIRS.push([AXIS_NAMES[i], AXIS_NAMES[j]])

function cost(cols) {
  let total = 0
  for (const [a, b] of PAIRS) {
    const na = AXES[a].length, nb = AXES[b].length
    const cell = Array.from({ length: na }, () => new Array(nb).fill(0))
    for (let i = 0; i < 12; i++) cell[cols[a][i]][cols[b][i]]++
    for (let x = 0; x < na; x++) {
      for (let y = 0; y < nb; y++) {
        const exp = (QUOTA[a][x] * QUOTA[b][y]) / 12
        const obs = cell[x][y]
        const d = obs - exp
        total += d * d
        // Hard penalties: a hole where there should be at least one card, or a
        // value that fully implies another.
        if (obs === 0 && exp >= 1) total += 100
        if (obs === QUOTA[a][x] || obs === QUOTA[b][y]) total += 100
      }
    }
  }
  // Two identical robots would be indistinguishable in play.
  const sigs = new Set()
  for (let i = 0; i < 12; i++) sigs.add(AXIS_NAMES.map((ax) => cols[ax][i]).join('|'))
  total += (12 - sigs.size) * 500
  return total
}

/** One hill-climb run: swap two cards' value inside one axis (marginals stay intact). */
function climb() {
  const cols = freshColumns()
  let best = cost(cols)
  for (let step = 0; step < 4000 && best > 0; step++) {
    const ax = AXIS_NAMES[randInt(AXIS_NAMES.length)]
    const i = randInt(12), j = randInt(12)
    if (cols[ax][i] === cols[ax][j]) continue
    ;[cols[ax][i], cols[ax][j]] = [cols[ax][j], cols[ax][i]]
    const c = cost(cols)
    if (c <= best) best = c
    else [cols[ax][i], cols[ax][j]] = [cols[ax][j], cols[ax][i]]
  }
  return { cols, cost: best }
}

/** Collect a large pool of local optima, then keep only the ones at the very best cost. */
const POOL = []
for (let i = 0; i < 4000; i++) POOL.push(climb())
const floor = Math.min(...POOL.map((r) => r.cost))
const optimal = POOL.filter((r) => r.cost <= floor + 1e-9)
console.log(`best reachable cost: ${floor.toFixed(3)}  (${optimal.length}/${POOL.length} runs reached it)`)
let poolAt = 0
const searchBoard = () => (poolAt < optimal.length ? optimal[poolAt++] : null)

const NAMES = [
  ['Bolt', 'Clank', 'Dot', 'Fizz', 'Gus', 'Momo', 'Nova', 'Pip', 'Rusty', 'Turbo', 'Wanda', 'Ziggy'],
  ['Astro', 'Bingo', 'Cosmo', 'Dizzy', 'Echo', 'Flip', 'Gizmo', 'Hopper', 'Jolt', 'Kip', 'Lumo', 'Mint'],
  ['Nix', 'Orbit', 'Pixel', 'Quark', 'Rex', 'Spark', 'Tonk', 'Volt', 'Wren', 'Yoyo', 'Zap', 'Blip'],
  ['Atlas', 'Bumper', 'Chip', 'Dash', 'Elmo', 'Fig', 'Gonk', 'Hex', 'Jinx', 'Kobo', 'Lex', 'Milo'],
  ['Nugget', 'Otto', 'Puck', 'Quill', 'Rocco', 'Snap', 'Tank', 'Vex', 'Wobble', 'Yuki', 'Zeno', 'Bop'],
]

const toRobots = (cols) =>
  Array.from({ length: 12 }, (_, i) => {
    const r = {}
    for (const ax of AXIS_NAMES) r[ax] = AXES[ax][cols[ax][i]]
    return r
  })

const sig = (r) => AXIS_NAMES.map((ax) => r[ax]).join('|')

/**
 * Lay the 12 out on the 3x4 grid. The data is already balanced; this is purely
 * about how the board reads. A shuffle alone is not enough — it will happily
 * put all six claw robots in the top half, which looks sorted even though it
 * isn't. So: no value may fill a whole row or dominate a column, neighbours may
 * not be near-twins, and touching cards never share a colour.
 */
function layout(robots) {
  const ROWS = [0, 1, 2, 3].map((r) => [r * 3, r * 3 + 1, r * 3 + 2])
  const COLS = [0, 1, 2].map((c) => [c, c + 3, c + 6, c + 9])

  for (let t = 0; t < 40000; t++) {
    const cand = shuffle(robots.slice())
    let ok = true

    // No attribute value may take a whole row of 3, or 3+ of a column of 4.
    for (const ax of AXIS_NAMES) {
      for (const row of ROWS) {
        const counts = {}
        for (const i of row) counts[cand[i][ax]] = (counts[cand[i][ax]] || 0) + 1
        if (Object.values(counts).some((n) => n === 3)) { ok = false; break }
      }
      if (!ok) break
      for (const col of COLS) {
        const counts = {}
        for (const i of col) counts[cand[i][ax]] = (counts[cand[i][ax]] || 0) + 1
        if (Object.values(counts).some((n) => n >= 3)) { ok = false; break }
      }
      if (!ok) break
    }
    if (!ok) continue

    for (let i = 0; i < 12 && ok; i++) {
      const nb = [i % 3 === 2 ? -1 : i + 1, i + 3].filter((j) => j >= 0 && j < 12)
      for (const j of nb) {
        if (AXIS_NAMES.filter((k) => cand[i][k] === cand[j][k]).length >= 3) ok = false
        if (cand[i].colour === cand[j].colour) ok = false
      }
    }
    if (ok) return cand
  }
  return null
}

const boards = []
let guard = 0
while (boards.length < 5 && guard++ < 5000) {
  const found = searchBoard()
  if (!found) break
  const robots = toRobots(found.cols)

  // Boards must be genuinely different from each other, not relabellings:
  // at most 3 of the 12 robots may be shared with any earlier board.
  const clash = boards.some((b) => {
    const prev = new Set(b.robots.map(sig))
    return robots.filter((r) => prev.has(sig(r))).length > 3
  })
  if (clash) continue

  const ordered = layout(robots)
  if (!ordered) continue

  const n = boards.length
  boards.push({
    id: `robots-${n + 1}`,
    category: 'robots',
    number: n + 1,
    robots: ordered.map((r, i) => ({ id: `r${n + 1}-${i + 1}`, name: NAMES[n][i], ...r })),
  })
  console.log(`board ${n + 1}: cost ${found.cost.toFixed(3)}`)
}

if (boards.length < 5) {
  console.error(`Only found ${boards.length} boards`)
  process.exit(1)
}

writeFileSync(
  new URL('../src/data/boards.json', import.meta.url),
  JSON.stringify({ boards }, null, 2) + '\n'
)
console.log(`wrote src/data/boards.json (${new Set(boards.flatMap((b) => b.robots.map(sig))).size} distinct robots across 5 boards)`)
