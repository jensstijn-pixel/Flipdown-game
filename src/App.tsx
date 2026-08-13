import { useState } from 'react'
import { BOARDS } from './data/boards'
import { CharacterCard } from './components/CharacterCard'
import { RobotParts } from './components/RobotParts'
import { T } from './tokens'

/**
 * TEMPORARY preview harness — replaced by the real screens once the artwork is
 * signed off. It exists to answer one question: are 12 robots on one board
 * telling apart at ~115px?
 */
export default function App() {
  const [n, setN] = useState(1)
  const [dead, setDead] = useState<Set<string>>(new Set())
  const [late, setLate] = useState(false)
  const board = BOARDS[n - 1]

  const toggle = (id: string) =>
    setDead((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="app-frame" style={{ display: 'flex', flexDirection: 'column' }}>
      <RobotParts />

      <div style={{ padding: '12px 12px 6px', textAlign: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: 1.5 }}>
          ROBOTS · {n}
        </div>
        <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: 1, color: T.muted, marginTop: 2 }}>
          {12 - dead.size} LEFT
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
          padding: '8px 12px',
          flex: 1,
          alignContent: 'start',
        }}
      >
        {board.robots.map((r) => (
          <CharacterCard
            key={r.id}
            character={r}
            category={board.category}
            eliminated={dead.has(r.id)}
            late={late}
            onTap={() => toggle(r.id)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '8px 12px 16px', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => {
              setN(i)
              setDead(new Set())
            }}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 22,
              fontWeight: 900,
              fontSize: 15,
              background: i === n ? T.ink : '#fff',
              color: i === n ? T.paper : T.ink,
              border: `2px solid ${i === n ? T.ink : T.line}`,
            }}
          >
            {i}
          </button>
        ))}
        <button
          onClick={() => setLate((v) => !v)}
          style={{
            flex: 2,
            height: 44,
            borderRadius: 22,
            fontWeight: 900,
            fontSize: 13,
            letterSpacing: 1,
            background: late ? T.yellow : '#fff',
            color: T.ink,
            border: `2px solid ${late ? T.yellow : T.line}`,
          }}
        >
          LATE GAME
        </button>
      </div>
    </div>
  )
}
