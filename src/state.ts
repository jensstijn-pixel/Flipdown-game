import { useEffect, useReducer } from 'react'
import { getBoard } from './data/boards'
import type { Category } from './data/types'

export type Screen = 'setup' | 'secret' | 'board' | 'result'
export type Outcome = 'correct' | 'incorrect'

export interface GameState {
  screen: Screen
  category: Category
  boardNumber: number
  /** Chosen on this device only. The other phone picks its own — they may match. */
  secretId: string | null
  eliminated: string[]
  guessMode: boolean
  pickedId: string | null
  /** The guess is out loud; we are waiting for the player to tap what they heard. */
  awaitingAnswer: boolean
  outcome: Outcome | null
}

const initial: GameState = {
  screen: 'setup',
  category: 'robots',
  boardNumber: 1,
  secretId: null,
  eliminated: [],
  guessMode: false,
  pickedId: null,
  awaitingAnswer: false,
  outcome: null,
}

export type Action =
  | { type: 'setCategory'; category: Category }
  | { type: 'setBoard'; number: number }
  | { type: 'startRound'; secretId: string }
  | { type: 'gotIt' }
  | { type: 'toggleCard'; id: string }
  | { type: 'restoreCard'; id: string }
  | { type: 'enterGuess' }
  | { type: 'cancelGuess' }
  | { type: 'pickCard'; id: string }
  | { type: 'commitGuess' }
  | { type: 'answer'; outcome: Outcome }
  | { type: 'backToGuess' }
  | { type: 'endRound' }
  | { type: 'hydrate'; state: GameState }

function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case 'setCategory':
      return { ...s, category: a.category }
    case 'setBoard':
      return { ...s, boardNumber: a.number }
    case 'startRound':
      return { ...s, screen: 'secret', secretId: a.secretId, eliminated: [], guessMode: false, pickedId: null, awaitingAnswer: false, outcome: null }
    case 'gotIt':
      return { ...s, screen: 'board' }
    case 'toggleCard':
      return s.eliminated.includes(a.id)
        ? { ...s, eliminated: s.eliminated.filter((x) => x !== a.id) }
        : { ...s, eliminated: [...s.eliminated, a.id] }
    case 'restoreCard':
      return { ...s, eliminated: s.eliminated.filter((x) => x !== a.id) }
    case 'enterGuess':
      return { ...s, guessMode: true, pickedId: null }
    case 'cancelGuess':
      return { ...s, guessMode: false, pickedId: null, awaitingAnswer: false }
    case 'pickCard':
      return { ...s, pickedId: a.id }
    case 'commitGuess':
      return { ...s, awaitingAnswer: true }
    case 'backToGuess':
      return { ...s, awaitingAnswer: false }
    case 'answer':
      return { ...s, screen: 'result', outcome: a.outcome, guessMode: false, awaitingAnswer: false }
    case 'endRound':
      // Keep the category and board number: the next round is usually the same
      // two people at the same table.
      return { ...initial, category: s.category, boardNumber: s.boardNumber }
    case 'hydrate':
      return a.state
  }
}

const KEY = 'flipdown.round.v1'

/** Only what a refresh must not destroy. Pointer and sheet state is transient. */
type Saved = Pick<GameState, 'screen' | 'category' | 'boardNumber' | 'secretId' | 'eliminated' | 'pickedId' | 'outcome'>

function load(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as Saved
    if (!['setup', 'secret', 'board', 'result'].includes(s.screen)) return null

    const board = getBoard(s.category, s.boardNumber)
    if (!board) return null
    const ids = new Set(board.robots.map((r) => r.id))

    // A stored round is only worth restoring if its characters still exist —
    // board data can change between app versions.
    if (s.screen !== 'setup' && (!s.secretId || !ids.has(s.secretId))) return null
    const eliminated = (s.eliminated ?? []).filter((id) => ids.has(id))
    const pickedId = s.pickedId && ids.has(s.pickedId) ? s.pickedId : null
    if (s.screen === 'result' && (!pickedId || !s.outcome)) return null

    return {
      ...initial,
      screen: s.screen,
      category: s.category,
      boardNumber: s.boardNumber,
      secretId: s.secretId ?? null,
      eliminated,
      pickedId,
      outcome: s.outcome ?? null,
    }
  } catch {
    return null
  }
}

function save(s: GameState) {
  try {
    if (s.screen === 'setup') {
      // Nothing in flight; remember only the last picked board for convenience.
      localStorage.setItem(KEY, JSON.stringify({ screen: 'setup', category: s.category, boardNumber: s.boardNumber, secretId: null, eliminated: [], pickedId: null, outcome: null } satisfies Saved))
      return
    }
    const out: Saved = {
      screen: s.screen,
      category: s.category,
      boardNumber: s.boardNumber,
      secretId: s.secretId,
      eliminated: s.eliminated,
      pickedId: s.pickedId,
      outcome: s.outcome,
    }
    localStorage.setItem(KEY, JSON.stringify(out))
  } catch {
    // Private mode or a full quota: the game still plays, it just won't survive
    // a refresh. Not worth interrupting a round over.
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, null, () => load() ?? initial)
  useEffect(() => save(state), [state])
  return [state, dispatch] as const
}

/** Random per device — the whole point is that neither phone knows the other's card. */
export function pickSecret(ids: string[]): string {
  return ids[Math.floor(Math.random() * ids.length)]
}

/** Few enough left that the board should start feeling tense. */
export const LATE_GAME_AT = 4
