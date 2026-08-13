# Flipdown — projectgeheugen

Twee-speler deductiespel (Wie is het?-stijl) voor twee losse telefoons.
Geen server, geen verbinding tussen de toestellen, alles lokaal.

**Live:** https://jensstijn-pixel.github.io/Flipdown-game/
**Repo:** https://github.com/jensstijn-pixel/Flipdown-game (publiek)

## 2026-08-13

### v1 af en live

Vite + React + TypeScript, PWA, geen backend. Alle 11 frames uit de handoff
gebouwd en één voor één in Chrome geverifieerd.

**Borden**
- Vijf borden van 12 robots als letterlijke JSON in `src/data/boards.json`.
  Gezocht met `scripts/gen-boards.mjs` (alleen tijdens het bouwen) en daarna
  letterlijk weggeschreven. Runtime doet geen enkele randomisatie behalve het
  geheime personage.
- `npm run check:boards` leest het geleverde JSON-bestand en toetst verdeling
  per as, plus per bord 101 waardeparen op samenvallen, impliceren en uitsluiten.
  Ook of het rooster niet gesorteerd oogt. Alle 5 borden: PASS.

**Schermen**
- Setup, geheime kaart, bord, resultaat. Bordstaten: loading, error, late game,
  peek, leave-confirm, eindgok (twee stappen).
- Eindgok is bewust twee stappen: eerst "IT'S NOVA", dan RIGHT/WRONG. De app
  weet nooit wat de andere telefoon heeft, dus de gokker tikt zelf in wat de
  ander hardop zei. Met GO BACK erbij, zodat een misklik niet fataal is.
- Peek gebruikt **native** pointer-listeners, niet React's synthetische. React
  leidt `onPointerLeave` af uit `pointerout` en een echte leave glipte erdoor.
  Ook: implicit pointer capture wordt losgelaten (die slikt `pointerleave`
  volledig op bij touch) en peek valt weg bij blur/visibilitychange.
- Ronde overleeft een refresh via localStorage, met validatie tegen de borddata
  bij herstel — een ronde die naar een verdwenen personage wijst wordt genegeerd
  in plaats van een kapot bord te tonen.

**Keuzes en waarom**
- *Laagvolgorde* `top → arms → base → robot-base → eyes`, zoals de `<use>`-blokken
  onderaan `robot-parts.svg` zelf tonen. De handoff noemde er vier.
- *Late-game rand* gebruikt de accentkleur (`--a`), niet de hoofdkleur. Cream
  (`#EFE6D8`) is onzichtbaar als rand op een witte kaart.
- *Bordontwerp*: de eerste opzet eiste dat élke kruistabel perfect uitkwam. Dat
  bestaat wiskundig niet bij 12 kaarten — brute-force bewees dat `top×base`
  perfect én `eyes×base` in 2/1/1 elkaar uitsluiten. Vervangen door een
  kostenfunctie met harde penalty's. Bodem is cost 15.0, bereikt door 58% van
  4000 zoekruns.
- *Roosterlayout* is een aparte harde eis geworden: de data was al netjes
  verdeeld, maar de eerste shuffle zette toevallig alle 6 klauw-robots in de
  bovenste helft. Ziet eruit als gesorteerd. Zit nu ook in de check.
- *Kaarten krimpen mee* met de viewport (`minmax(0, 152px)` rijen). Op 844px is
  152px de ontworpen hoogte; op een kortere telefoon worden ze kleiner zodat alle
  12 zichtbaar blijven zonder scrollen. Setup is het enige scherm dat mag scrollen.
- *Loading/error* hangen aan het enige asset dat écht kan ontbreken: Nunito is
  `font-display: block`, dus zonder font zijn alle 12 namen leeg en is het bord
  onspeelbaar. `prepare()` doet een echte `document.fonts.load()`; TRY AGAIN
  probeert het opnieuw. Eerst had ik hier een check die nooit kon falen — dode code.

**Bugs die de test opleverde**
- `place-items: center` liet de app-frame naar inhoudsbreedte krimpen (344px
  i.p.v. 430), waardoor de robotarmen tegen de kaartrand kwamen.
- Geheim personage werd gekozen in de click-handler, die `boardNumber` uit een
  oudere render las. Bord kiezen + starten in dezelfde frame gaf een personage
  van het vórige bord. Nu lost de reducer het op tegen zijn eigen state; alleen
  de random `roll` komt van buiten.

**Bekende punten / openstaand**
- **Actions-workflow staat nog uit.** Het token mist de `workflow`-scope, dus
  `.github/workflows/` kan niet gepusht worden. Het bestand staat klaar in
  `scripts/github-pages-workflow.yml` met de instructie erin. Tot dan:
  `npm run deploy`.
- Cream is de zwakste van de vier kleuren op een witte kaart. Zit in de
  aangeleverde tokens, niks aan veranderd.
- Faces en Monsters staan in setup maar zijn uit (gedimd, SOON-label). Er is nog
  geen illustratieset. `CharacterFigure` dispatcht op categorie met vaste
  maatvakken, dus een nieuwe set kan erin zonder de layout aan te raken.
- **Volgende fase (afgesproken):** terug naar minder robotborden en van daaruit
  meerdere thema's. De 5 genummerde cirkels in setup zijn daar letterlijk
  omheen getekend, dus dat scherm gaat mee op de schop.

**Hoe het draait**
- `npm run dev -- --host` → localhost:5180, en op het LAN voor de telefoon
- `npm run check:boards` → bordvalidatie
- `npm run build` → statische site in `dist/`
- `npm run deploy` → check + build + push naar gh-pages
- `node scripts/gen-boards.mjs` → borden opnieuw zoeken (~2 min, overschrijft JSON)
- `node scripts/gen-icons.mjs` → PWA-iconen opnieuw tekenen
