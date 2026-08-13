export type Category = 'robots' | 'faces' | 'monsters'

export type RobotTop = 'top-none' | 'top-antenna' | 'top-antennae' | 'top-propeller'
export type RobotEyes = 'eyes-single' | 'eyes-two' | 'eyes-visor'
export type RobotBase = 'base-wheels' | 'base-legs' | 'base-tracks'
export type RobotArms = 'arms-grabber' | 'arms-claw'
export type RobotColour = 'sunny' | 'sky' | 'cream' | 'plum'

/**
 * A character on a board. `id` and `name` are all the layout needs; the rest is
 * the robot-specific figure description. A future category adds its own fields
 * and its own figure renderer — the card layout never looks at them.
 */
export interface Character {
  id: string
  name: string
  top: RobotTop
  eyes: RobotEyes
  base: RobotBase
  arms: RobotArms
  colour: RobotColour
}

export interface Board {
  id: string
  category: Category
  number: number
  robots: Character[]
}

/** Main colour and accent, fed to the SVG as --m and --a. */
export const COLOUR_TOKENS: Record<RobotColour, { m: string; a: string }> = {
  sunny: { m: '#F7C948', a: '#E8871E' },
  sky: { m: '#5FA8DC', a: '#2E6E9E' },
  cream: { m: '#EFE6D8', a: '#B3A68C' },
  plum: { m: '#6D639B', a: '#443B6B' },
}
