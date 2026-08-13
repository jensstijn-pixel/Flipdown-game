import raw from './boards.json'
import type { Board, Category } from './types'

/**
 * Boards are literal static JSON — never generated, seeded or shuffled at
 * runtime. Both phones show exactly the same 12 robots because they read
 * exactly the same bytes.
 */
export const BOARDS = (raw as { boards: Board[] }).boards

export const BOARD_NUMBERS = [1, 2, 3, 4, 5] as const

export function getBoard(category: Category, number: number): Board | undefined {
  return BOARDS.find((b) => b.category === category && b.number === number)
}
