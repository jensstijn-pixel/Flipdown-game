/**
 * The robot part library, straight from robot-parts.svg. Rendered once, hidden,
 * at the app root; every card is a small <svg> that <use>s these by id. One copy
 * of the geometry in the DOM, twelve cheap references per board.
 */
export function RobotParts() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        <g id="robot-base">
          <rect x="86" y="100" width="28" height="18" fill="var(--a)" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="50" cy="77" r="9" fill="var(--a)" stroke="#273140" strokeWidth="6" />
          <circle cx="150" cy="77" r="9" fill="var(--a)" stroke="#273140" strokeWidth="6" />
          <rect x="52" y="114" width="96" height="78" rx="14" fill="var(--m)" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <rect x="56" y="48" width="88" height="58" rx="16" fill="var(--m)" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <rect x="74" y="134" width="52" height="38" rx="9" fill="var(--a)" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
        </g>

        <g id="top-none" />
        <g id="top-antenna">
          <path d="M100 50 L100 24" fill="none" stroke="#273140" strokeWidth="7" strokeLinecap="round" />
          <circle cx="100" cy="16" r="9" fill="var(--a)" stroke="#273140" strokeWidth="6" />
        </g>
        <g id="top-antennae">
          <path d="M80 50 C78 36 64 34 60 24" fill="none" stroke="#273140" strokeWidth="7" strokeLinecap="round" />
          <path d="M120 50 C122 36 136 34 140 24" fill="none" stroke="#273140" strokeWidth="7" strokeLinecap="round" />
          <circle cx="58" cy="16" r="8" fill="var(--a)" stroke="#273140" strokeWidth="6" />
          <circle cx="142" cy="16" r="8" fill="var(--a)" stroke="#273140" strokeWidth="6" />
        </g>
        <g id="top-propeller">
          <path d="M100 50 L100 36" fill="none" stroke="#273140" strokeWidth="7" strokeLinecap="round" />
          <rect x="50" y="23" width="44" height="14" rx="7" fill="var(--a)" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <rect x="106" y="23" width="44" height="14" rx="7" fill="var(--m)" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="100" cy="30" r="8" fill="#CFD8E0" stroke="#273140" strokeWidth="6" />
        </g>

        <g id="eyes-single">
          <circle cx="100" cy="77" r="21" fill="#FFFFFF" stroke="#273140" strokeWidth="6" />
          <circle cx="100" cy="77" r="9" fill="#273140" />
        </g>
        <g id="eyes-two">
          <circle cx="81" cy="77" r="13" fill="#FFFFFF" stroke="#273140" strokeWidth="6" />
          <circle cx="119" cy="77" r="13" fill="#FFFFFF" stroke="#273140" strokeWidth="6" />
          <circle cx="81" cy="77" r="6" fill="#273140" />
          <circle cx="119" cy="77" r="6" fill="#273140" />
        </g>
        <g id="eyes-visor">
          <rect x="64" y="65" width="72" height="24" rx="12" fill="#273140" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="84" cy="77" r="6" fill="#9FE8FF" />
          <circle cx="116" cy="77" r="6" fill="#9FE8FF" />
        </g>

        <g id="arms-grabber">
          <path d="M56 132 L36 158" fill="none" stroke="#273140" strokeWidth="10" strokeLinecap="round" />
          <path d="M144 132 L164 158" fill="none" stroke="#273140" strokeWidth="10" strokeLinecap="round" />
          <path d="M17 172 A13 13 0 1 1 29 184" fill="none" stroke="#273140" strokeWidth="9" strokeLinecap="round" />
          <path d="M183 172 A13 13 0 1 0 171 184" fill="none" stroke="#273140" strokeWidth="9" strokeLinecap="round" />
        </g>
        <g id="arms-claw">
          <path d="M56 132 L40 166" fill="none" stroke="#273140" strokeWidth="10" strokeLinecap="round" />
          <path d="M144 132 L160 166" fill="none" stroke="#273140" strokeWidth="10" strokeLinecap="round" />
          <polygon points="42,162 14,148 30,172" fill="var(--a)" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <polygon points="42,180 14,194 30,170" fill="var(--a)" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <polygon points="158,162 186,148 170,172" fill="var(--a)" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <polygon points="158,180 186,194 170,170" fill="var(--a)" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="40" cy="168" r="7" fill="#273140" />
          <circle cx="160" cy="168" r="7" fill="#273140" />
        </g>

        <g id="base-wheels">
          <rect x="62" y="186" width="76" height="14" fill="var(--a)" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="70" cy="211" r="20" fill="#3A4450" stroke="#273140" strokeWidth="6" />
          <circle cx="130" cy="211" r="20" fill="#3A4450" stroke="#273140" strokeWidth="6" />
          <circle cx="70" cy="211" r="8" fill="#CFD8E0" />
          <circle cx="130" cy="211" r="8" fill="#CFD8E0" />
        </g>
        <g id="base-legs">
          <rect x="68" y="186" width="20" height="28" fill="var(--a)" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <rect x="112" y="186" width="20" height="28" fill="var(--a)" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <rect x="56" y="210" width="42" height="18" rx="9" fill="#3A4450" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <rect x="102" y="210" width="42" height="18" rx="9" fill="#3A4450" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
        </g>
        <g id="base-tracks">
          <rect x="46" y="194" width="108" height="38" rx="19" fill="#3A4450" stroke="#273140" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="72" cy="213" r="9" fill="#CFD8E0" />
          <circle cx="100" cy="213" r="9" fill="#CFD8E0" />
          <circle cx="128" cy="213" r="9" fill="#CFD8E0" />
        </g>
      </defs>
    </svg>
  )
}
