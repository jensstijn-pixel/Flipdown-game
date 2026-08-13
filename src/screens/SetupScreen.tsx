import type { CSSProperties } from 'react'
import { BOARD_NUMBERS } from '../data/boards'
import type { Category } from '../data/types'
import { CATEGORY_GLYPH, T } from '../tokens'

interface Props {
  category: Category
  boardNumber: number
  onCategory: (c: Category) => void
  onBoard: (n: number) => void
  onStart: () => void
}

/** Faces and monsters are drawn but off: there is no illustration set for them yet. */
const CATEGORIES: { id: Category; label: string; enabled: boolean }[] = [
  { id: 'robots', label: 'ROBOTS', enabled: true },
  { id: 'faces', label: 'FACES', enabled: false },
  { id: 'monsters', label: 'MONSTERS', enabled: false },
]

const GLYPH_SHAPE: Record<Category, CSSProperties> = {
  robots: { width: 30, height: 26, borderRadius: 7 },
  faces: { width: 28, height: 28, borderRadius: '50%' },
  monsters: { width: 30, height: 26, borderRadius: '15px 15px 5px 5px' },
}

const caption: CSSProperties = {
  marginTop: 18,
  fontWeight: 800,
  fontSize: 11,
  letterSpacing: 2,
  color: T.muted,
}

export function SetupScreen({ category, boardNumber, onCategory, onBoard, onStart }: Props) {
  const selected = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0]

  return (
    <div
      style={{
        height: '100%',
        background: T.paper,
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
        color: T.ink,
        // Setup is the one screen that may scroll: unlike the board, nothing is
        // lost by pushing the start button below the fold on a small phone.
        overflowY: 'auto',
      }}
    >
      <div style={{ textAlign: 'center', fontWeight: 900, fontSize: 15, letterSpacing: 4, paddingTop: 6 }}>
        FLIPDOWN
      </div>

      {/* The readout is the one thing that has to be legible across a table:
          both players compare it before starting. */}
      <div
        style={{
          marginTop: 16,
          background: T.white,
          border: `3px solid ${T.ink}`,
          borderRadius: 26,
          padding: '16px 16px 4px',
          textAlign: 'center',
          boxShadow: '0 8px 0 rgba(34,30,25,.07)',
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: 2, color: T.muted }}>BOTH PHONES PICK</div>
        <div style={{ fontWeight: 900, fontSize: 33, letterSpacing: 2, marginTop: 2 }}>{selected.label}</div>
        <div style={{ fontWeight: 900, fontSize: 122, lineHeight: 0.95 }}>{boardNumber}</div>
      </div>

      <div style={caption}>CATEGORY</div>
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        {CATEGORIES.map((c) => {
          const on = c.id === category
          return (
            <button
              key={c.id}
              type="button"
              disabled={!c.enabled}
              aria-pressed={on}
              onClick={() => c.enabled && onCategory(c.id)}
              style={{
                position: 'relative',
                flex: 1,
                height: 92,
                borderRadius: 20,
                background: on ? T.white : 'transparent',
                border: on ? `3px solid ${T.ink}` : `2px solid ${T.line}`,
                boxShadow: on ? '0 6px 0 rgba(34,30,25,.07)' : undefined,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 9,
                opacity: c.enabled ? 1 : 0.45,
                cursor: c.enabled ? 'pointer' : 'default',
              }}
            >
              <div
                style={{
                  ...GLYPH_SHAPE[c.id],
                  background: CATEGORY_GLYPH[c.id],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                }}
              >
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,.95)' }} />
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,.95)' }} />
              </div>
              <div style={{ fontWeight: 900, fontSize: 13, letterSpacing: 0.5, color: on ? T.ink : T.muted }}>
                {c.label}
              </div>
              {!c.enabled && (
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    background: T.line,
                    color: T.muted,
                    borderRadius: 8,
                    padding: '2px 6px',
                    fontWeight: 900,
                    fontSize: 9,
                    letterSpacing: 0.5,
                  }}
                >
                  SOON
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div style={caption}>BOARD</div>
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
        {BOARD_NUMBERS.map((n) => {
          const on = n === boardNumber
          return (
            <button
              key={n}
              type="button"
              aria-pressed={on}
              onClick={() => onBoard(n)}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: on ? T.ink : T.white,
                color: on ? T.paper : T.ink,
                border: `${on ? 3 : 2}px solid ${on ? T.ink : T.line}`,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                fontSize: on ? 23 : 21,
                boxShadow: on ? '0 5px 0 rgba(34,30,25,.15)' : undefined,
              }}
            >
              {n}
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1 }} />

      <button
        type="button"
        onClick={onStart}
        style={{
          height: 64,
          borderRadius: 32,
          background: T.ink,
          color: T.paper,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          fontWeight: 900,
          fontSize: 19,
          letterSpacing: 2,
          flex: 'none',
        }}
      >
        START ROUND <span style={{ fontSize: 22 }}>→</span>
      </button>
    </div>
  )
}
