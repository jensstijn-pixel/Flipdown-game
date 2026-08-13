# Handoff: Flipdown — Mobile Deduction Game (3 screens)

## Overview
Flipdown is a two-player deduction game for mobile web (installed to home screen, portrait only, 390×844). Both players open the same app on their own phone — **no network connection between devices**. They verbally agree on a board, each gets a secret character, then take turns asking yes/no questions and tapping away eliminated candidates on their own screen. Three screens: Setup → Secret card → Board (→ Result). Strictly linear navigation; no tabs, drawer, accounts, or settings.

## About the Design Files
The file in this bundle (`Flipdown Screens.dc.html`) is a **design reference created in HTML** — a static mockup of every screen and state, not production code. Your task is to **recreate these designs in the target codebase's environment** (React, Vue, vanilla PWA, etc.) using its established patterns — or, if no codebase exists yet, pick an appropriate stack (a small PWA with no backend fits this product; all state is local to the device).

Open the file in a browser to see all 11 frames on one canvas. Each frame is a full 390×844 screen, labeled 1a–1k.

## Fidelity
**High-fidelity** for layout, spacing, color, and typography — recreate pixel-perfectly. **Except the characters**: every character figure is a plain placeholder shape (colored circle/square/diamond with two white eye dots). Real illustrations are being designed separately: chunky, colorful, flat figures on transparent background, roughly square. Build the card component so a placeholder shape can be swapped for an `<img>` without layout changes.

## Screens / Views

### 1a — Setup
- Purpose: both players pick the same category + board number, then start.
- Layout: paper background `#FAF8F3`, 20px padding, vertical flex.
  - Wordmark "FLIPDOWN": centered, 900/15px, letter-spacing 4px.
  - **Match readout card** (the key element — must be readable across a table): white, 3px solid ink border, radius 26, centered text, shadow `0 8px 0 rgba(34,30,25,.07)`. Contains caption "BOTH PHONES PICK" (800/11px, ls 2px, `#9A938A`), category name "ROBOTS" (900/33px, ls 2px), and a giant board numeral (900/122px, line-height .95). This card always mirrors the current selection.
  - "CATEGORY" caption, then 3 tiles in a row (gap 10, height 92, radius 20): each has a small colored glyph (30×26 shape with two 5px white eye dots) + label 900/13px. Selected: 3px ink border, white bg, shadow `0 6px 0 rgba(34,30,25,.07)`. Unselected: 2px `#E8E3DA` border, transparent bg, label color `#9A938A`. Glyph colors: Robots `#3E8DE3` (rounded square), Faces `#F5A623` (circle), Monsters `#3FA66A` (arch).
  - "BOARD" caption, then 5 numbered circles (56px, space-between): 900/21px. Selected: ink bg, paper text, 900/23px, shadow `0 5px 0 rgba(34,30,25,.15)`.
  - Spacer, then **START ROUND →** button: full width, 64px tall, ink bg, paper text, 900/19px, ls 2px, radius 32.

### 1b — Your secret card
- Purpose: privately reveal this player's assigned character; must never look like the shared board.
- Layout: **full dark ink background `#221E19`** (dark = private is the visual rule throughout). Centered column:
  - Caption "YOUR SECRET CHARACTER": 800/12px, ls 3px, `rgba(250,248,243,.6)`.
  - Card: 300×380, white, radius 28, shadow `0 24px 60px rgba(0,0,0,.5)`. Character figure large (~2.2× grid scale) + name 900/32px ink.
  - Hint "Don't let them see it": 700/14px, `rgba(250,248,243,.55)`.
  - **GOT IT** button: full width, 64px, paper bg `#FAF8F3`, ink text, 900/19px, radius 32.

### 1c — Board (with states 1d–1i)
- Purpose: eliminate candidates by tapping; peek at own card; make a final guess.
- **Top bar** (padding 12 12 6, flex, gap 10):
  - Back: 44px circle, white, 2px `#E8E3DA` border, chunky ✕ glyph. Tapping opens the leave confirmation (1h) — never leaves directly.
  - Center: "ROBOTS · 3" 900/14px ls 1.5px; under it a status line 800/11px `#9A938A` — remaining count ("10 LEFT"), "LOADING", or "PICK THEIR CARD" in guess mode. Late game: count becomes a yellow chip (`#F7CE46` bg, radius 10, 900/11px).
  - **PEEK**: 44px-tall pill, ink bg, paper text, mini-card icon (12×16 outlined rect) + "PEEK" 900/13px. **Press-and-hold only, never a toggle**: card overlay shows on pointerdown, disappears on pointerup/pointercancel/pointerleave.
- **Grid**: 3 columns × 4 rows, gap 10, padding 8 12. Card: height 152, radius 18, white, 2px `#E8E3DA` border, centered column (figure + name 900/13px, gap 7).
  - **Eliminated** (tap a card): bg `#F0EDE6`, border `#EAE5DC`, figure turns grey `#C6BFB3` (eyes at 55% opacity), name `#B3ACA1` with line-through, and a chunky X overlay: two absolute bars, 60% width × 9px, radius 5, `#403A32`, rotated ±45°. Eliminated cards stay visible.
  - **Undo** (1c): after every elimination a toast floats above the bottom button (~100px from bottom): ink bg, radius 18, padding 13 18, shadow. "GUS FLIPPED" 800/13px paper + 2px divider + "UNDO" 900/13px in yellow `#F7CE46`. Tapping UNDO restores the card; toast auto-dismisses after ~4s.
- **Bottom**: **MAKE A GUESS** button, 60px, ink pill, 900/17px ls 2px, padding 10 16 22.

### 1d — Loading
Top bar with PEEK at 30% opacity (disabled). Grid shows 12 skeleton tiles (152px, radius 18, `#F0EDE6`, centered 44px circle `#E3DDD1`). Bottom: three 10px dots (`#221E19` / `#C6BFB3` / `#E3DDD1` — animate as a wave) + "LOADING BOARD" 800/12px `#9A938A`.

### 1e — Load error
Back button only in top bar. Centered: 118px circle `#E8E3DA` with "!" 900/56px `#9A938A`; "BOARD DIDN'T LOAD" 900/24px; "Check your signal, then try again" 700/14px `#9A938A`. Bottom: **TRY AGAIN** (ink pill, 64px) + **BACK TO SETUP** text button (800/14px `#9A938A`, 56px tap target).

### 1f — Late game
When few candidates remain it must still feel alive: surviving cards get a 3px border **in their own character color**, shadow `0 8px 18px rgba(34,30,25,.16)`, and `scale(1.03)`; eliminated crosses fade to `#CFC7B9`. Count chip turns yellow ("3 LEFT").

### 1g — Peek (held)
While PEEK is pressed: pill inverts to yellow `#F7CE46` bg + ink text, `scale(.96)`; an overlay covers everything below the top bar (`rgba(26,23,19,.94)`) with caption "YOUR CARD", a 230×288 white card (figure + name), and "RELEASE TO HIDE". Released → overlay gone instantly.

### 1h — Leave confirmation
Back (✕) tapped: dim overlay `rgba(26,23,19,.55)`, centered dialog 320px wide, white, radius 26, padding 26 22 22. "LEAVE THE ROUND?" 900/22px; "The board is lost for both players" 700/14px `#9A938A`. Buttons row (gap 10, 56px): **STAY** filled ink (safe default) + **LEAVE** outlined 3px `#D9483B`, red text. Leave → setup, round abandoned.

### 1i — Final guess
Entered via MAKE A GUESS, then tapping a card. Picked card: 3px ink border, shadow, "?" corner badge (26px ink circle, top-right 6px), and it **pops above** the dim layer (`rgba(26,23,19,.35)` over the grid). Bottom sheet: white, radius 26 26 0 0, padding 22 20 26, shadow `0 -12px 34px rgba(34,30,25,.22)`. Row: character figure + "FINAL GUESS" caption + "NOVA?" 900/30px. Warning "A wrong guess loses the round" 700/13px `#9A938A`. **IT'S NOVA** ink pill 60px; **KEEP PLAYING** text button 800/14px `#9A938A` (44px tap target) cancels back to the board.

### 1j / 1k — Result
Full-bleed color screens. Correct: bg `#2F9E63`, white 84px circle with ✓ in green, "YOU GOT IT!" 900/36px white, the character card (230×280, white, radius 24). Incorrect: bg `#D9483B`, ✕ badge, "NOT NOVA" 900/36px, "Your opponent wins the round" 700/15px `rgba(255,255,255,.8)`, the guessed card greyed + crossed (12px bars `#403A32`). Both: **PLAY AGAIN** white pill (64px, ink text) → setup. The opponent confirms right/wrong verbally; the app never knows the other phone's card.

## Interactions & Behavior
- Navigation is strictly linear: Setup → Secret card → Board → Result → Setup. No other routes.
- Board tap = eliminate (with undo toast). Tap on an already-eliminated card = restore it (recommended; the toast is the guaranteed path).
- Peek = press-and-hold only (pointer events, not click). Guard against context-menu/long-press selection on mobile (`user-select:none`, `touch-action:manipulation`).
- Guess flow: MAKE A GUESS → grid enters pick mode → tap card → confirm sheet → result. KEEP PLAYING cancels cleanly.
- All tap targets ≥ 44px. High contrast for daylight readability.
- Suggested transitions: eliminate = quick 150ms scale-down + cross fade-in; overlays 200ms fade; no elaborate animation elsewhere.

## State Management
Per device, all local (no network):
- `screen`: 'setup' | 'secret' | 'board' | 'result'
- `category` ('robots'|'faces'|'monsters'), `boardNumber` (1–5)
- `secretCharacterId` — assigned at round start (random per device; the board seed = category+number so both phones show the same 12 characters)
- `eliminated`: Set of character ids; `lastFlipped` + toast timer for undo
- `peekHeld`: boolean (pointer state, never persisted)
- `guessMode`: boolean; `pickedId`; `result`: 'correct' | 'incorrect' (set after the confirm — the opponent answers verbally; the app asks the guesser to tap which it was, or you can show both buttons on a small intermediate step — designer's note: the mockup assumes the result is entered by the guessing player)
- Board data: 12 characters per (category, number) — static JSON shipped with the app; the loading/error states cover fetching illustration assets.

## Design Tokens
- Ink `#221E19` · Paper `#FAF8F3` · Line `#E8E3DA` · Muted `#9A938A`
- Dead tile `#F0EDE6` · Dead figure `#C6BFB3` · Dead name `#B3ACA1` · Cross `#403A32` (late-game `#CFC7B9`)
- Accent yellow `#F7CE46` (undo, count chip, peek-held) · Success `#2F9E63` · Danger `#D9483B`
- Character palette (12): `#EF5D43 #F5A623 #F7CE46 #8BC34A #37BFC0 #5F7481 #5E6AD2 #E5599B #3E8DE3 #9C5FD4 #8D6E63 #3FA66A`
- Type: **Nunito** (Google Fonts), weights 700/800/900 only. Captions 11–12px/800 with 1–3px letter-spacing; labels 13–14px/900; titles 22–36px/900; giant numeral 122px/900.
- Radii: cards 18 · tiles 20 · dialogs/readout 26 · sheets 26 top · pills = height/2
- Spacing: screen padding 20–24 · grid gap 10 · grid padding 8 12
- Buttons: primary 60–64px ink pill; on dark/color screens white/paper pill.

## Assets
- No image assets. Character figures are CSS placeholder shapes (to be replaced by illustration PNGs/SVGs on transparent background, roughly square, ~66px in grid / ~145px on cards at 1×).
- Font: Nunito via Google Fonts (self-host for offline/installed use).

## Files
- `Flipdown Screens.dc.html` — all 11 frames (1a–1k), openable directly in a browser. The elimination treatment has two designed variants (crossed vs face-down) and names on/off — see the `deadStyle` / `showNames` props in the file's logic.
