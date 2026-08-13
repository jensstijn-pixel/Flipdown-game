import { CharacterFigure } from '../components/CharacterFigure'
import type { Category, Character } from '../data/types'
import type { Outcome } from '../state'
import { T } from '../tokens'

interface Props {
  character: Character
  category: Category
  outcome: Outcome
  onPlayAgain: () => void
}

const BAR = {
  position: 'absolute',
  width: '64%',
  height: 12,
  borderRadius: 6,
  background: T.cross,
  left: '18%',
  top: 'calc(50% - 6px)',
} as const

/** The card shown is always the one that was guessed — the app never learns the
 *  opponent's card, it only records what the guesser was told. */
export function ResultScreen({ character, category, outcome, onPlayAgain }: Props) {
  const won = outcome === 'correct'
  const name = character.name.toUpperCase()

  return (
    <div
      style={{
        height: '100%',
        background: won ? T.success : T.danger,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <div style={{ flex: 0.9 }} />

      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: '50%',
          background: T.white,
          display: 'grid',
          placeItems: 'center',
          fontWeight: 900,
          fontSize: won ? 42 : 36,
          color: won ? T.success : T.danger,
          flex: 'none',
          animation: 'fd-pop 240ms ease-out',
        }}
      >
        {won ? '✓' : '✕'}
      </div>

      <div style={{ marginTop: 18, fontWeight: 900, fontSize: 36, letterSpacing: 2, color: T.white, textAlign: 'center' }}>
        {won ? 'YOU GOT IT!' : `NOT ${name}`}
      </div>

      {!won && (
        <div style={{ marginTop: 8, fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,.8)' }}>
          Your opponent wins the round
        </div>
      )}

      <div
        style={{
          marginTop: won ? 26 : 22,
          width: 230,
          height: 280,
          background: T.white,
          borderRadius: 24,
          boxShadow: '0 20px 50px rgba(0,0,0,.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          position: 'relative',
          overflow: 'hidden',
          flex: '0 1 280px',
          minHeight: 0,
        }}
      >
        <CharacterFigure character={character} category={category} size="result" dead={!won} />
        <div
          style={{
            fontWeight: 900,
            fontSize: 24,
            letterSpacing: 2,
            color: won ? T.ink : T.deadName,
            textDecoration: won ? 'none' : 'line-through',
          }}
        >
          {name}
        </div>
        {!won && (
          <>
            <div style={{ ...BAR, transform: 'rotate(45deg)' }} />
            <div style={{ ...BAR, transform: 'rotate(-45deg)' }} />
          </>
        )}
      </div>

      <div style={{ flex: 1 }} />

      <button
        type="button"
        onClick={onPlayAgain}
        style={{
          width: '100%',
          height: 64,
          borderRadius: 32,
          background: T.white,
          color: T.ink,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: 19,
          letterSpacing: 2,
          flex: 'none',
        }}
      >
        PLAY AGAIN
      </button>
    </div>
  )
}
