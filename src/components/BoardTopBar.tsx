import { useEffect, useRef } from 'react'
import { T } from '../tokens'

interface Props {
  title: string
  status: string
  /** Late game: the remaining count turns into a yellow chip. */
  statusAsChip?: boolean
  peekDisabled?: boolean
  peekHeld?: boolean
  onBack: () => void
  onPeekChange: (held: boolean) => void
}

/** The bar is 62px tall; overlays below it start at 68 (see the handoff). */
export const TOP_BAR_BOTTOM = 68

export function BoardTopBar({
  title,
  status,
  statusAsChip,
  peekDisabled,
  peekHeld,
  onBack,
  onPeekChange,
}: Props) {
  const peekRef = useRef<HTMLButtonElement>(null)

  // Press-and-hold, never a toggle — a peek that stays up ruins the round.
  // These are deliberately *native* listeners: React derives onPointerLeave from
  // pointerout, and a real leave can slip past that. Two other traps handled
  // here: touch pointers get implicit capture (which swallows pointerleave
  // entirely, so we release it), and losing capture must also drop the card.
  useEffect(() => {
    const el = peekRef.current
    if (!el || peekDisabled) return

    const down = (e: PointerEvent) => {
      e.preventDefault()
      if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId)
      onPeekChange(true)
    }
    const up = () => onPeekChange(false)

    el.addEventListener('pointerdown', down)
    for (const type of ['pointerup', 'pointercancel', 'pointerleave', 'pointerout', 'lostpointercapture']) {
      el.addEventListener(type, up)
    }
    return () => {
      el.removeEventListener('pointerdown', down)
      for (const type of ['pointerup', 'pointercancel', 'pointerleave', 'pointerout', 'lostpointercapture']) {
        el.removeEventListener(type, up)
      }
    }
  }, [peekDisabled, onPeekChange])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px 6px', position: 'relative', zIndex: 4, flex: 'none' }}>
      <button
        type="button"
        onClick={onBack}
        aria-label="Leave the round"
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          background: T.white,
          border: `2px solid ${T.line}`,
          display: 'grid',
          placeItems: 'center',
          fontWeight: 900,
          fontSize: 16,
          flex: 'none',
        }}
      >
        ✕
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 0 }}>
        <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: 1.5 }}>{title}</div>
        {statusAsChip ? (
          <div
            style={{
              display: 'inline-flex',
              padding: '3px 10px',
              borderRadius: 10,
              background: T.yellow,
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: 1,
            }}
          >
            {status}
          </div>
        ) : (
          <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: 1, color: T.muted }}>{status}</div>
        )}
      </div>

      <button
        ref={peekRef}
        type="button"
        aria-label="Hold to peek at your card"
        disabled={peekDisabled}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          height: 44,
          padding: '0 14px',
          borderRadius: 22,
          background: peekHeld ? T.yellow : T.ink,
          color: peekHeld ? T.ink : T.paper,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flex: 'none',
          opacity: peekDisabled ? 0.3 : 1,
          transform: peekHeld ? 'scale(.96)' : undefined,
          transition: 'transform 120ms ease, background 120ms ease',
        }}
      >
        <span
          style={{
            width: 12,
            height: 16,
            border: `2.5px solid ${peekHeld ? T.ink : T.paper}`,
            borderRadius: 4,
          }}
        />
        <span style={{ fontWeight: 900, fontSize: 13, letterSpacing: 1 }}>PEEK</span>
      </button>
    </div>
  )
}
