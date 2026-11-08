# Chronos Atlas — Alexandria prototype

An early React + TypeScript + React Three Fiber prototype. Includes a procedural harbour diorama, five place entries, ten evidence claims, five source records, source inspection, search, contextual connections, an evidence overlay, guided tour, URL sharing, and a reading fallback.

## Run

Use Node.js 22+ and pnpm 11.25.0. Run `pnpm install`, `pnpm dev`, `pnpm test`, and `pnpm build`. Production output is `dist/`.

## Historical status

Targets circa 25 BCE. All scene geometry is original, schematic and illustrative. This prototype has not undergone independent historical review. There is no precise Library building marker. Evidence summaries are paraphrases, not quotations. Later coin imagery is explicitly qualified. The overlay assesses the scene representation, while individual claim cards may have different assessments.

The source register, passages, entities, claims and reconstruction decisions are in `src/content.ts`; no historical prose is embedded in geometry. Source text and images are not bundled. Fonts are loaded from Google Fonts, with local fallbacks. All scene geometry is generated in code; there are no external model/image licences to resolve.

## Scope and limitations

This is the first complete interaction prototype, not the full MVP specification. Connections are labelled editorial navigation links, not independently established graph assertions. Locations and scale are not survey data. Browser bookmarks, multiple eras, uploads, API chat, photogrammetry, and independently reviewed historical assessments are not included.

Next: independent content review; surveyed/period-qualified coastline and placement data; typed evidence-backed relationships; persistent bookmarks; expanded claim corpus; per-mesh model decisions and overlay bindings; performance evaluation on an agreed reference laptop.


## Ice Age library collection — 8 November 2026

The Library now includes an Ice Age collection with 10 entries, 12 sources and 21 linked claims. Topics cover glacial cycles, Neanderthals, early Homo sapiens, social networks, Chauvet art, the Last Glacial Maximum, Beringia, the Younger Dryas, the Holocene transition and late mammoth survival. Each entry has a date basis, evidence locators, uncertainty notes and related reading.

Open `?view=library&collection=ice-age&article=ice-age-cycle`. Search accepts aliases such as “cave paintings” and “sea level”. Topic filters, chronological ordering and shareable article links are supported. Alexandria remains a separate collection. Ice Age entries do not appear as landmarks in Alexandria.

This checkout also retains the previously developed realistic Alexandria viewing mode: photographic material maps, reflected animated water, camera presets, adjustable lighting and optional synthesized ambience. Material credits are in ASSETS.md; these are rendering references rather than historical evidence.

The collection is now accompanied by an explorable Beringia scene. Dates are rounded; BP and b2k reference epochs are explained rather than silently interchanged. All content summaries are original paraphrases; source text and images are not republished.


## Explorable Ice Age MVP

Open `?view=ice-world&scene=ice-age-beringia`. A deterministic illustrative Beringian valley around 21,000 years ago includes textured terrain, seasonal high-ground snow, reflective water, rocks, steppe grass and four procedural mammoths. Explore mode has orbit/zoom and four camera presets. Walk mode follows the same terrain function used by the mesh, with WASD/arrows, Shift, drag-to-look and touch direction buttons. The river and scene perimeter are movement boundaries. Five accessible field-note controls link to source URLs and library articles. Destination selectors and the library CTA connect both worlds.

This is a browser/WebGL MVP, not an Unreal Engine application. The exact terrain, watercourse, weather, snow and animal anatomy/behaviour are illustrative. NPS regional Beringia evidence supports the broad environment, not a site survey. No known human settlement or migration route is placed. Independent historical review and device performance profiling remain pending.
