import { CharacterFigure } from './CharacterFigure'
import { TOP_BAR_BOTTOM } from './BoardTopBar'
import type { Category, Character } from '../data/types'
import { T } from '../tokens'

/* ---------------------------------------------------------------- peek (1g) */

export function PeekOverlay({ character, category }: { character: Character; category: Category }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: TOP_BAR_BOTTOM,
        bottom: 0,
        background: T.dimPeek,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
        zIndex: 3,
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: 3, color: 'rgba(250,248,243,.6)' }}>YOUR CARD</div>
      <div
        style={{
          width: 230,
          height: 288,
          background: T.white,
          borderRadius: 24,
          boxShadow: '0 20px 50px rgba(0,0,0,.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          flex: '0 1 288px',
          minHeight: 0,
        }}
      >
        <CharacterFigure character={character} category={category} size="peek" />
        <div style={{ fontWeight: 900, fontSize: 24, letterSpacing: 2, color: T.ink }}>
          {character.name.toUpperCase()}
        </div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: 2, color: 'rgba(250,248,243,.6)' }}>
        RELEASE TO HIDE
      </div>
    </div>
  )
}

/* ----------------------------------------------------------- undo toast (1c) */

export function UndoToast({ name, onUndo }: { name: string; onUndo: () => void }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 100,
        transform: 'translateX(-50%)',
        background: T.ink,
        color: T.paper,
        borderRadius: 18,
        padding: '13px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 10px 24px rgba(34,30,25,.35)',
        whiteSpace: 'nowrap',
        zIndex: 5,
        animation: 'fd-rise 180ms ease-out',
      }}
      role="status"
    >
      <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: 0.5 }}>{name.toUpperCase()} FLIPPED</span>
      <span style={{ width: 2, height: 16, background: 'rgba(250,248,243,.25)', borderRadius: 1 }} />
      <button
        type="button"
        onClick={onUndo}
        style={{ fontWeight: 900, fontSize: 13, letterSpacing: 1.5, color: T.yellow }}
      >
        UNDO
      </button>
    </div>
  )
}

/* ------------------------------------------------------ leave confirmation (1h) */

export function LeaveDialog({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: T.dimHard,
        display: 'grid',
        placeItems: 'center',
        zIndex: 6,
        animation: 'fd-fade 200ms ease-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Leave the round?"
    >
      <div
        style={{
          width: 320,
          maxWidth: 'calc(100% - 40px)',
          background: T.white,
          borderRadius: 26,
          padding: '26px 22px 22px',
          textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0,0,0,.4)',
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: 1 }}>LEAVE THE ROUND?</div>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.muted, marginTop: 8 }}>
          The board is lost for both players
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            type="button"
            onClick={onStay}
            style={{
              flex: 1,
              height: 56,
              borderRadius: 28,
              background: T.ink,
              color: T.paper,
              display: 'grid',
              placeItems: 'center',
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: 1,
            }}
          >
            STAY
          </button>
          <button
            type="button"
            onClick={onLeave}
            style={{
              flex: 1,
              height: 56,
              borderRadius: 28,
              border: `3px solid ${T.danger}`,
              color: T.danger,
              display: 'grid',
              placeItems: 'center',
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: 1,
            }}
          >
            LEAVE
          </button>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------- final guess sheet (1i) */

interface GuessSheetProps {
  character: Character
  category: Category
  /** The guess has been said out loud; now the player taps what they heard. */
  awaitingAnswer: boolean
  onCommit: () => void
  onCancel: () => void
  onBack: () => void
  onAnswer: (outcome: 'correct' | 'incorrect') => void
}

export function GuessSheet({
  character,
  category,
  awaitingAnswer,
  onCommit,
  onCancel,
  onBack,
  onAnswer,
}: GuessSheetProps) {
  const name = character.name.toUpperCase()
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        background: T.white,
        borderRadius: '26px 26px 0 0',
        padding: '22px 20px 26px',
        boxShadow: '0 -12px 34px rgba(34,30,25,.22)',
        zIndex: 7,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        animation: 'fd-sheet 220ms ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <CharacterFigure character={character} category={category} size="sheet" />
        <div>
          <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: 2, color: T.muted }}>FINAL GUESS</div>
          <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 1 }}>{name}?</div>
        </div>
      </div>

      {!awaitingAnswer ? (
        <>
          <div style={{ fontWeight: 700, fontSize: 13, color: T.muted }}>A wrong guess loses the round</div>
          <button
            type="button"
            onClick={onCommit}
            style={{
              height: 60,
              borderRadius: 30,
              background: T.ink,
              color: T.paper,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: 17,
              letterSpacing: 2,
            }}
          >
            IT'S {name}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 1,
              color: T.muted,
            }}
          >
            KEEP PLAYING
          </button>
        </>
      ) : (
        <>
          {/* This phone has no idea what the other one holds, so the guesser
              tells it what the opponent just said out loud. */}
          <div style={{ fontWeight: 700, fontSize: 13, color: T.muted }}>
            Say it out loud. What did they answer?
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => onAnswer('correct')}
              style={{
                flex: 1,
                height: 60,
                borderRadius: 30,
                background: T.success,
                color: T.white,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                fontSize: 17,
                letterSpacing: 1.5,
              }}
            >
              RIGHT
            </button>
            <button
              type="button"
              onClick={() => onAnswer('incorrect')}
              style={{
                flex: 1,
                height: 60,
                borderRadius: 30,
                background: T.danger,
                color: T.white,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                fontSize: 17,
                letterSpacing: 1.5,
              }}
            >
              WRONG
            </button>
          </div>
          <button
            type="button"
            onClick={onBack}
            style={{
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 1,
              color: T.muted,
            }}
          >
            GO BACK
          </button>
        </>
      )}
    </div>
  )
}
