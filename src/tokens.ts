/** Design tokens from the handoff. Single source of truth for the whole app. */
export const T = {
  ink: '#221E19',
  paper: '#FAF8F3',
  line: '#E8E3DA',
  muted: '#9A938A',
  white: '#fff',

  deadTile: '#F0EDE6',
  deadTileBorder: '#EAE5DC',
  deadName: '#B3ACA1',
  cross: '#403A32',
  crossLate: '#CFC7B9',
  skeleton: '#E3DDD1',

  yellow: '#F7CE46',
  success: '#2F9E63',
  danger: '#D9483B',

  dimSoft: 'rgba(26,23,19,.35)',
  dimHard: 'rgba(26,23,19,.55)',
  dimPeek: 'rgba(26,23,19,.94)',
} as const

/** Category tile glyph colours (setup screen). */
export const CATEGORY_GLYPH = {
  robots: '#3E8DE3',
  faces: '#F5A623',
  monsters: '#3FA66A',
} as const
