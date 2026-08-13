import type { CSSProperties } from 'react'
import { COLOUR_TOKENS, type Category, type Character } from '../data/types'

/**
 * Every place a character appears asks for one of these sizes. The box is fixed
 * per size, so a future category can render an <img> (or any other figure) into
 * the same box without a single layout change upstream.
 */
export type FigureSize = 'grid' | 'sheet' | 'peek' | 'result' | 'secret'

export const FIGURE_BOX: Record<FigureSize, { w: number; h: number }> = {
  grid: { w: 97, h: 116 },
  sheet: { w: 54, h: 64 },
  peek: { w: 152, h: 182 },
  result: { w: 150, h: 178 },
  secret: { w: 206, h: 246 },
}

interface Props {
  character: Character
  category: Category
  size: FigureSize
  /** Eliminated cards: the figure drains of colour but stays readable. */
  dead?: boolean
  style?: CSSProperties
}

export function CharacterFigure({ character, category, size, dead, style }: Props) {
  const box = FIGURE_BOX[size]
  const common: CSSProperties = {
    width: box.w,
    height: box.h,
    flex: 'none',
    // Category-agnostic: works the same on an SVG figure or an illustration.
    filter: dead ? 'grayscale(1) contrast(.72) brightness(1.16)' : undefined,
    opacity: dead ? 0.62 : undefined,
    ...style,
  }

  if (category === 'robots') return <RobotFigure character={character} style={common} />

  // Faces and monsters have no illustration set yet — they are disabled in setup.
  return <div style={common} aria-hidden="true" />
}

function RobotFigure({ character, style }: { character: Character; style: CSSProperties }) {
  const { m, a } = COLOUR_TOKENS[character.colour]
  return (
    <svg
      viewBox="0 0 200 240"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={character.name}
      style={{ ...style, ['--m' as string]: m, ['--a' as string]: a }}
    >
      {/* Stacking order is fixed by the artwork: top, arms, base, body, eyes. */}
      <use href={`#${character.top}`} />
      <use href={`#${character.arms}`} />
      <use href={`#${character.base}`} />
      <use href="#robot-base" />
      <use href={`#${character.eyes}`} />
    </svg>
  )
}
