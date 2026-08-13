import { BoardTopBar } from './BoardTopBar'
import { T } from '../tokens'

/* ------------------------------------------------------------- loading (1d) */

export function BoardLoading({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{ height: '100%', background: T.paper, display: 'flex', flexDirection: 'column', color: T.ink }}>
      <BoardTopBar title={title} status="LOADING" peekDisabled onBack={onBack} onPeekChange={() => {}} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: 'repeat(4, minmax(0, 152px))',
          gap: 10,
          padding: '8px 12px',
          flex: 1,
          minHeight: 0,
          alignContent: 'start',
        }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ height: '100%', borderRadius: 18, background: T.deadTile, display: 'grid', placeItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: T.skeleton }} />
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 16px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 'none' }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {[T.ink, '#C6BFB3', T.skeleton].map((c, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: c,
                animation: 'fd-wave 1.1s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: 2, color: T.muted }}>LOADING BOARD</div>
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- error (1e) */

export function BoardError({ onRetry, onBack }: { onRetry: () => void; onBack: () => void }) {
  return (
    <div
      style={{
        height: '100%',
        background: T.paper,
        display: 'flex',
        flexDirection: 'column',
        color: T.ink,
        padding: '0 20px 24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0 6px' }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to setup"
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
          }}
        >
          ✕
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 118,
            height: 118,
            borderRadius: '50%',
            background: T.line,
            display: 'grid',
            placeItems: 'center',
            fontWeight: 900,
            fontSize: 56,
            color: T.muted,
          }}
        >
          !
        </div>
        <div style={{ fontWeight: 900, fontSize: 24, letterSpacing: 1, marginTop: 8 }}>BOARD DIDN'T LOAD</div>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.muted, maxWidth: 240 }}>
          Check your signal, then try again
        </div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        style={{
          height: 64,
          borderRadius: 32,
          background: T.ink,
          color: T.paper,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: 18,
          letterSpacing: 2,
          flex: 'none',
        }}
      >
        TRY AGAIN
      </button>
      <button
        type="button"
        onClick={onBack}
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 14,
          letterSpacing: 1,
          color: T.muted,
          marginTop: 6,
          flex: 'none',
        }}
      >
        BACK TO SETUP
      </button>
    </div>
  )
}
