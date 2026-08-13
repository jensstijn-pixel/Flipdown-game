# Flipdown — projectgeheugen

Twee-speler deductiespel (Wie is het?-stijl) voor twee losse telefoons.
Geen server, geen verbinding tussen de toestellen, alles lokaal.

## 2026-08-13

**Gedaan**
- Project opgezet: Vite + React + TypeScript + PWA (`vite-plugin-pwa`), geen backend.
  Nunito self-hosted in `public/fonts/` (variable font, 700–900 in één bestand van 39 kB)
  zodat de app volledig offline werkt.
- **Borden.** Vijf borden van 12 robots als letterlijke JSON in `src/data/boards.json`.
  Gevonden met `scripts/gen-boards.mjs` (alleen tijdens het bouwen, niet in de app) en
  daarna letterlijk weggeschreven. Runtime doet geen enkele randomisatie.
- **Kwaliteitscheck** `npm run check:boards` leest het geleverde JSON-bestand en toetst:
  verdeling per as, en voor alle 101 waardeparen per bord of ze niet samenvallen,
  elkaar impliceren of elkaar uitsluiten. Plus of het rooster niet gesorteerd oogt.
- **Kaart-component.** `RobotParts` zet de onderdelen één keer als verborgen `<defs>`
  in de DOM; elke kaart is een kleine `<svg>` met `<use>`-lagen. `CharacterFigure`
  werkt met vaste maatvakken (`grid`/`sheet`/`peek`/`result`/`secret`) zodat een
  latere categorie erin kan zonder de layout aan te raken.
- Preview-harnas in `App.tsx` om de 12 robots op telefoonformaat te beoordelen —
  wordt vervangen door de echte schermen.

**Keuzes en waarom**
- *Laagvolgorde* is `top → arms → base → robot-base → eyes`, zoals de `<use>`-blokken
  onderaan `robot-parts.svg` zelf laten zien. De handoff noemde er vier; het lijf moet
  de bovenkant van de poten overlappen.
- *Late-game rand* gebruikt de accentkleur (`--a`) in plaats van de hoofdkleur. De
  README vraagt "de eigen personagekleur", maar cream (`#EFE6D8`) is onzichtbaar als
  rand op een witte kaart. Alle vier de accenten zijn wél donker genoeg.
- *Bordontwerp*: de eerste opzet eiste dat élke kruistabel perfect uitkwam. Dat bestaat
  wiskundig niet bij 12 kaarten (brute-force bewees het: `top×base` perfect en
  `eyes×base` in 2/1/1 sluiten elkaar uit). Vervangen door een kostenfunctie met harde
  penalty's op de dingen die het spel echt slopen. Bodem is cost 15.0, bereikt door
  58% van 4000 zoekruns — dus dat is de echte bodem, geen toevalstreffer.
- *Layout van het rooster* is een aparte regel geworden: de data was al netjes verdeeld,
  maar de eerste shuffle zette toevallig alle 6 klauw-robots in de bovenste helft. Ziet
  eruit als gesorteerd. Nu een harde eis, ook in de check.

**Bekende punten**
- Cream is de zwakste van de vier kleuren op een witte kaart — leesbaar door de donkere
  outlines, maar duidelijk lichter dan de rest. Zit in de aangeleverde tokens.
- Nog geen GitHub remote; alleen lokaal gecommit.

**Openstaand**
- Schermen: setup, geheime kaart, bord met alle states, resultaat.
- `localStorage`-herstel van de lopende ronde.
- Loading/error als laatste.

**Hoe het draait**
- `npm run dev -- --host` → http://localhost:5180 (en op het LAN voor de telefoon)
- `npm run check:boards` → de bordvalidatie
- `npm run build` → statische site in `dist/`
- `node scripts/gen-boards.mjs` → borden opnieuw zoeken (~2 min, overschrijft de JSON)
- `node scripts/gen-icons.mjs` → PWA-iconen opnieuw tekenen
