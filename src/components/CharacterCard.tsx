import type { CSSProperties } from 'react'
import { COLOUR_TOKENS, type Category, type Character } from '../data/types'
import { T } from '../tokens'
import { CharacterFigure } from './CharacterFigure'

interface Props {
  character: Character
  category: Category
  eliminated: boolean
  /** Late game: survivors gain their own colour and lift off the paper. */
  late?: boolean
  /** Guess mode: this card is the one being pointed at. */
  picked?: boolean
  onTap?: () => void
}

const CROSS_BAR: CSSProperties = {
  position: 'absolute',
  width: '60%',
  height: 9,
  borderRadius: 5,
  left: '20%',
  top: 'calc(50% - 4.5px)',
  pointerEvents: 'none',
}

export function CharacterCard({ character, category, eliminated, late, picked, onTap }: Props) {
  const card: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 152,
    borderRadius: 18,
    background: eliminated ? T.deadTile : T.white,
    border: `2px solid ${eliminated ? T.deadTileBorder : T.line}`,
    overflow: 'hidden',
    transition: 'transform 150ms ease, box-shadow 150ms ease, background 150ms ease',
    width: '100%',
  }

  if (late && !eliminated) {
    // The handoff asks for the character's own colour here. On the robots we use
    // the accent rather than the main tone: cream's main (#EFE6D8) would be
    // invisible as a border on white paper, the accents all read at 3px.
    card.border = `3px solid ${COLOUR_TOKENS[character.colour].a}`
    card.boxShadow = '0 8px 18px rgba(34,30,25,.16)'
    card.transform = 'scale(1.03)'
    card.zIndex = 1
  }
  if (picked) {
    card.border = `3px solid ${T.ink}`
    card.boxShadow = '0 10px 22px rgba(34,30,25,.25)'
    card.zIndex = 4
    card.transform = 'scale(1.03)'
  }

  const barColour = late ? T.crossLate : T.cross

  return (
    <button
      type="button"
      style={card}
      onClick={onTap}
      aria-pressed={eliminated}
      aria-label={`${character.name}${eliminated ? ', flipped down' : ''}`}
    >
      <CharacterFigure character={character} category={category} size="grid" dead={eliminated} />
      <span
        style={{
          fontWeight: 900,
          fontSize: 13,
          letterSpacing: '.4px',
          color: eliminated ? T.deadName : T.ink,
          textDecoration: eliminated ? 'line-through' : 'none',
          position: 'relative',
        }}
      >
        {character.name.toUpperCase()}
      </span>

      {eliminated && (
        <>
          <span style={{ ...CROSS_BAR, background: barColour, transform: 'rotate(45deg)' }} />
          <span style={{ ...CROSS_BAR, background: barColour, transform: 'rotate(-45deg)' }} />
        </>
      )}

      {picked && (
        <span
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 26,
            height: 26,
            borderRadius: 13,
            background: T.ink,
            color: T.paper,
            display: 'grid',
            placeItems: 'center',
            fontWeight: 900,
            fontSize: 15,
          }}
        >
          ?
        </span>
      )}
    </button>
  )
}
