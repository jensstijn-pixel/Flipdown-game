import { useEffect } from 'react'
import { RobotParts } from './components/RobotParts'
import { getBoard } from './data/boards'
import { BoardScreen } from './screens/BoardScreen'
import { ResultScreen } from './screens/ResultScreen'
import { SecretScreen } from './screens/SecretScreen'
import { SetupScreen } from './screens/SetupScreen'
import { pickSecret, useGame } from './state'

export default function App() {
  const [s, dispatch] = useGame()

  const board = getBoard(s.category, s.boardNumber)
  const secret = board && s.secretId ? board.robots.find((r) => r.id === s.secretId) : undefined
  const picked = board && s.pickedId ? board.robots.find((r) => r.id === s.pickedId) : undefined

  // A restored round can only be trusted if its board and secret still resolve.
  // If they don't, fall back to setup rather than showing a broken board.
  const stranded = s.screen !== 'setup' && (!board || !secret)
  useEffect(() => {
    if (stranded) dispatch({ type: 'endRound' })
  }, [stranded, dispatch])

  const start = () => {
    const b = getBoard(s.category, s.boardNumber)
    if (!b) return
    dispatch({ type: 'startRound', secretId: pickSecret(b.robots.map((r) => r.id)) })
  }

  let screen
  if (stranded || s.screen === 'setup' || !board || !secret) {
    screen = (
      <SetupScreen
        category={s.category}
        boardNumber={s.boardNumber}
        onCategory={(category) => dispatch({ type: 'setCategory', category })}
        onBoard={(number) => dispatch({ type: 'setBoard', number })}
        onStart={start}
      />
    )
  } else if (s.screen === 'secret') {
    screen = <SecretScreen character={secret} category={board.category} onDone={() => dispatch({ type: 'gotIt' })} />
  } else if (s.screen === 'result' && s.outcome && picked) {
    screen = (
      <ResultScreen
        character={picked}
        category={board.category}
        outcome={s.outcome}
        onPlayAgain={() => dispatch({ type: 'endRound' })}
      />
    )
  } else {
    screen = (
      <BoardScreen
        board={board}
        secret={secret}
        eliminated={s.eliminated}
        guessMode={s.guessMode}
        pickedId={s.pickedId}
        awaitingAnswer={s.awaitingAnswer}
        onToggle={(id) => dispatch({ type: 'toggleCard', id })}
        onRestore={(id) => dispatch({ type: 'restoreCard', id })}
        onEnterGuess={() => dispatch({ type: 'enterGuess' })}
        onCancelGuess={() => dispatch({ type: 'cancelGuess' })}
        onPick={(id) => dispatch({ type: 'pickCard', id })}
        onCommitGuess={() => dispatch({ type: 'commitGuess' })}
        onBackToGuess={() => dispatch({ type: 'backToGuess' })}
        onAnswer={(outcome) => dispatch({ type: 'answer', outcome })}
        onLeave={() => dispatch({ type: 'endRound' })}
      />
    )
  }

  return (
    <div className="app-frame">
      <RobotParts />
      {screen}
    </div>
  )
}
