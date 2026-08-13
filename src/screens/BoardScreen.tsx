import { useCallback, useEffect, useRef, useState } from 'react'
import { CharacterCard } from '../components/CharacterCard'
import { BoardTopBar, TOP_BAR_BOTTOM } from '../components/BoardTopBar'
import { GuessSheet, LeaveDialog, PeekOverlay, UndoToast } from '../components/BoardOverlays'
import { BoardError, BoardLoading } from '../components/BoardStates'
import type { Board, Character } from '../data/types'
import { LATE_GAME_AT, type Outcome } from '../state'
import { T } from '../tokens'

interface Props {
  board: Board
  secret: Character
  eliminated: string[]
  guessMode: boolean
  pickedId: string | null
  awaitingAnswer: boolean
  onToggle: (id: string) => void
  onRestore: (id: string) => void
  onEnterGuess: () => void
  onCancelGuess: () => void
  onPick: (id: string) => void
  onCommitGuess: () => void
  onBackToGuess: () => void
  onAnswer: (outcome: Outcome) => void
  onLeave: () => void
}

const UNDO_MS = 4000

/**
 * The board data is already in memory, so the only asset that can genuinely be
 * missing is the font — and it matters: Nunito is font-display:block, so without
 * it all twelve name labels render blank and the board is unplayable. That can
 * really happen on a first load over a bad connection, before the service worker
 * has precached anything. Hence a real check with a real retry, not a fake one.
 */
async function prepare(board: Board | undefined): Promise<void> {
  if (!board) throw new Error('board-missing')
  if (!document.fonts) return
  await document.fonts.load('900 13px Nunito')
  await document.fonts.ready
  if (!document.fonts.check('900 13px Nunito')) throw new Error('font-unavailable')
}

export function BoardScreen(props: Props) {
  const { board, secret, eliminated, guessMode, pickedId, awaitingAnswer } = props

  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading')
  const [showSpinner, setShowSpinner] = useState(false)
  const [peekHeld, setPeekHeld] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [toast, setToast] = useState<{ id: string; name: string } | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const load = useCallback(() => {
    setPhase('loading')
    // Only admit to loading if it actually takes long enough to notice —
    // otherwise the skeleton would flash for one frame on every entry.
    const t = window.setTimeout(() => setShowSpinner(true), 120)
    let cancelled = false
    prepare(board)
      .then(() => !cancelled && setPhase('ready'))
      .catch(() => !cancelled && setPhase('error'))
      .finally(() => {
        window.clearTimeout(t)
        if (!cancelled) setShowSpinner(false)
      })
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [board])

  useEffect(() => load(), [load])

  // A held peek must never survive the app going away — a phone call or a
  // task switch would otherwise leave the secret card on screen.
  useEffect(() => {
    const drop = () => setPeekHeld(false)
    window.addEventListener('blur', drop)
    window.addEventListener('pointerup', drop)
    window.addEventListener('pointercancel', drop)
    document.addEventListener('visibilitychange', drop)
    return () => {
      window.removeEventListener('blur', drop)
      window.removeEventListener('pointerup', drop)
      window.removeEventListener('pointercancel', drop)
      document.removeEventListener('visibilitychange', drop)
    }
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const showToast = (id: string, name: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ id, name })
    toastTimer.current = window.setTimeout(() => setToast(null), UNDO_MS)
  }

  const dismissToast = () => {
    window.clearTimeout(toastTimer.current)
    setToast(null)
  }

  const tapCard = (c: Character) => {
    if (guessMode) {
      props.onPick(c.id)
      return
    }
    const wasEliminated = eliminated.includes(c.id)
    props.onToggle(c.id)
    // Every flip is undoable; restoring is itself the undo, so it needs no toast.
    if (wasEliminated) dismissToast()
    else showToast(c.id, c.name)
  }

  const undo = () => {
    if (!toast) return
    props.onRestore(toast.id)
    dismissToast()
  }

  const leave = () => {
    dismissToast()
    setLeaving(false)
    props.onLeave()
  }

  const remaining = board.robots.length - eliminated.length
  const late = remaining <= LATE_GAME_AT && remaining > 0
  const picked = pickedId ? board.robots.find((r) => r.id === pickedId) ?? null : null

  if (phase === 'error') return <BoardError onRetry={load} onBack={props.onLeave} />
  if (phase === 'loading') {
    // Under the threshold we show bare paper rather than the skeleton (which
    // would flash) or the real board (whose names would be blank without the font).
    return showSpinner ? (
      <BoardLoading title={`${board.category.toUpperCase()} · ${board.number}`} onBack={() => setLeaving(true)} />
    ) : (
      <div style={{ height: '100%', background: T.paper }} />
    )
  }

  return (
    <div
      style={{
        height: '100%',
        background: T.paper,
        display: 'flex',
        flexDirection: 'column',
        color: T.ink,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BoardTopBar
        title={`${board.category.toUpperCase()} · ${board.number}`}
        status={guessMode ? 'PICK THEIR CARD' : `${remaining} LEFT`}
        statusAsChip={late && !guessMode}
        peekHeld={peekHeld}
        onBack={() => setLeaving(true)}
        onPeekChange={setPeekHeld}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          // 152 is the designed height and the ceiling; on a shorter phone the
          // rows give way so all twelve stay on screen without scrolling.
          gridTemplateRows: 'repeat(4, minmax(0, 152px))',
          gap: 10,
          padding: '8px 12px',
          flex: 1,
          minHeight: 0,
          alignContent: 'start',
        }}
      >
        {board.robots.map((r) => (
          <CharacterCard
            key={r.id}
            character={r}
            category={board.category}
            eliminated={eliminated.includes(r.id)}
            late={late && !guessMode}
            picked={pickedId === r.id}
            onTap={() => tapCard(r)}
          />
        ))}
      </div>

      {/* Dim everything below the bar so the picked card reads as lifted out of it. */}
      {picked && (
        <div
          style={{ position: 'absolute', left: 0, right: 0, top: TOP_BAR_BOTTOM, bottom: 0, background: T.dimSoft, zIndex: 2, animation: 'fd-fade 200ms ease-out' }}
        />
      )}

      {!guessMode ? (
        <div style={{ padding: '10px 16px 22px', flex: 'none' }}>
          <button
            type="button"
            onClick={props.onEnterGuess}
            style={{
              width: '100%',
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
            MAKE A GUESS
          </button>
        </div>
      ) : (
        !picked && (
          <div style={{ padding: '10px 16px 22px', flex: 'none' }}>
            <button
              type="button"
              onClick={props.onCancelGuess}
              style={{
                width: '100%',
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 1,
                color: T.muted,
              }}
            >
              KEEP PLAYING
            </button>
          </div>
        )
      )}

      {toast && !guessMode && !peekHeld && <UndoToast name={toast.name} onUndo={undo} />}

      {peekHeld && <PeekOverlay character={secret} category={board.category} />}

      {picked && (
        <GuessSheet
          character={picked}
          category={board.category}
          awaitingAnswer={awaitingAnswer}
          onCommit={props.onCommitGuess}
          onCancel={props.onCancelGuess}
          onBack={props.onBackToGuess}
          onAnswer={props.onAnswer}
        />
      )}

      {leaving && <LeaveDialog onStay={() => setLeaving(false)} onLeave={leave} />}
    </div>
  )
}
