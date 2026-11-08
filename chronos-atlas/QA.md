# Prototype verification

## Ice Age collection — 8 November 2026

- Ten automated tests passed across the existing content/state suite and the new collection suite.
- New checks cover evidence/reference integrity, 10 entries, valid age ranges, aliases, chronological ordering, topic filtering, mammoth aftermath, and collection/article URL validation.
- TypeScript compilation and production build passed before the final metadata polish; the final publication package rebuilds the same source.
- Browser checks confirmed Ice Age rendering, search for “cave paintings”, expansion of a Chauvet evidence claim with the correct original-source URL, and the Wildlife filter with the mammoth aftermath label. No browser errors were reported during those checks.
- Further mobile and browser-history QA was interrupted when the temporary preview tab became unavailable. Those interactions are not claimed as browser-verified for this release; URL validation is covered by unit tests.
- Content was checked against 12 institutional/research sources. Extinction mechanisms remain labelled as interpretations; BP/b2k differences are explained. No independent specialist review or Ice Age 3D scene is claimed.

## Passed

- TypeScript compilation.
- Four automated content/state tests: unique IDs and reference integrity; Library uncertainty and later-evidence qualification; URL restoration and invalid-value defaults; searching claims.
- Browser: all four 3D landmark labels render and select entries.
- Browser: Pharos evidence opens Strabo 17.1.6 in the source inspector, with its locator, original-source link, and applicability note.
- Browser: evidence overlay switches to Location and displays the assessment legend.
- Browser: searching Qaitbay finds the Pharos through its linked claim.
- Browser: Connections opens the selected entity's contextual links.
- Browser: five-stop tour reaches the Mouseion/Library entry in reading mode without a precise building marker.
- Browser: Share copies a URL that preserves entity, view, overlay attribute, and reading state; reload restores the selected Library entry.
- Browser: 390 × 844 responsive layout has no horizontal document overflow; mobile guided-tour entry works.
- Reading fallback presents the same entity and evidence interface without 3D.

## Limits

Browser verification used the in-app Chromium browser. Cross-browser compatibility, a full accessibility audit, reference-device frame-rate testing, independent historical review, and real WebGL-device failure testing have not been completed. Source-reference validation is not a judgment of historical accuracy. Rendering is procedural, schematic, and illustrative.


## Explorable Ice Age MVP — 8 November 2026

- TypeScript build and 14 unit tests passed. New tests cover deterministic terrain, dry-land walking boundaries, camera clearance and valid field-note article/source references.
- In-app Chromium rendered the textured terrain, reflective river, high-ground snow, rocks, grass and mammoths. Four camera presets and five accessible field notes are available.
- Selecting Woolly mammoths changes the camera and opens its evidence/uncertainty panel; its library button opens the exact last-mammoths article. Explore Beringia in 3D returns from the library. Walk mode displays movement instructions and four touch/keyboard direction buttons. No runtime console errors appeared in this flow.
- Source URLs are from National Park Service Beringia nature, About Beringia, and Pleistocene megafauna pages. Scene geometry is explicitly illustrative.
- Not yet verified: sustained keyboard/touch locomotion across devices, mobile GPU performance, cross-browser compatibility or independent paleontological review. Mammoth anatomy and terrain are MVP procedural approximations.
