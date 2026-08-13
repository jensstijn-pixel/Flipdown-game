import { CharacterFigure } from '../components/CharacterFigure'
import type { Category, Character } from '../data/types'
import { T } from '../tokens'

interface Props {
  character: Character
  category: Category
  onDone: () => void
}

/** Dark screen = private. It must never be mistaken for the shared board. */
export function SecretScreen({ character, category, onDone }: Props) {
  return (
    <div
      style={{
        height: '100%',
        background: T.ink,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <div style={{ flex: 0.9 }} />

      <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: 3, color: 'rgba(250,248,243,.6)' }}>
        YOUR SECRET CHARACTER
      </div>

      <div
        style={{
          marginTop: 22,
          width: 300,
          maxWidth: '100%',
          height: 380,
          background: T.white,
          borderRadius: 28,
          boxShadow: '0 24px 60px rgba(0,0,0,.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 26,
          flex: '0 1 380px',
          minHeight: 0,
          animation: 'fd-pop 220ms ease-out',
        }}
      >
        <CharacterFigure character={character} category={category} size="secret" />
        <div style={{ fontWeight: 900, fontSize: 32, letterSpacing: 2, color: T.ink }}>
          {character.name.toUpperCase()}
        </div>
      </div>

      <div style={{ marginTop: 20, fontWeight: 700, fontSize: 14, color: 'rgba(250,248,243,.55)' }}>
        Don't let them see it
      </div>

      <div style={{ flex: 1 }} />

      <button
        type="button"
        onClick={onDone}
        style={{
          width: '100%',
          height: 64,
          borderRadius: 32,
          background: T.paper,
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
        GOT IT
      </button>
    </div>
  )
}
