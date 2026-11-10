# FRO-360 local concept review

Open `index.html` directly in Chrome or Edge (double-click it in File Explorer). It is self-contained and needs no server, network connection, installation or production access. Use the visible controls to switch direction, language and scenario. Direct-file mode does not update URL parameters.

Round 2 defaults to the Export-style Import layout approved for exploration: Shipment relationship first, Import details with embedded customs status, and horizontal Overview / Orders and collis / History & activity / Documents tabs. Earlier A–C concepts remain accessible in the reviewer Layout selector. Creation uses the same full-width section order. All data is invented fixture data; actions update memory only and reset on reload. These are proposals for employee review, not approved production designs.

Rebuild after editing: `python previews/fro360/build.py` from the planning repository root.

Optional server: `python -m http.server 8360 --bind 127.0.0.1 --directory previews/fro360`. Localhost timed out in the agent environment on 2026-11-03; do not rely on that URL until verified on the user's machine.

Validation: JavaScript syntax check and standalone build passed. Browser interaction and responsive visual verification remain pending because browser tooling stopped and the local endpoint was unreachable. No public deployment, production implementation, mock branch or Linear update was performed.

Source provenance and component mapping are in `component-map.md` and `design-map.md`.

Round 2 verification: standalone initial render and section order, 80 EN/EL scenario/tab renders, advanced creation render, and JavaScript syntax passed. These are code-level checks, not browser visual or interaction verification. Live main remained 5c51030; tabs.tsx re-read through gh. No Linear mutation.

## Public preview — 2026-11-10

[Open the public concept preview](https://fro-360-ef9045.pages.dev/?layout=export&state=default). No password or sign-in is required. This is the unchanged existing concept, with sample data and temporary browser-only actions.

Pages project: `fro-360-ef9045`; deployment: `456520a8`. The user explicitly authorized Cloudflare OAuth for this deployment. Only the new project was created/deployed; existing resources were not modified. FRO-360 Resources now includes “Public concept preview — no sign-in (FRO-360)”.

Anonymous HTTP GET returned 200. Local and public HTML SHA-256: `c0fc7fa6bc8f4e0a6db1013b758cef41d088f771b953ef8a7ee1057d6d41d4ab`. Local and hosted isolated Chromium checks each covered 56 state/scenario combinations across EN/EL and 1440px/400px widths, plus creation rendering, state switchers, language toggle and reset. No console/page errors, failed requests or page-wide horizontal overflow were observed. All 56 hosted state/scenario screenshots were inspected as contact sheets. Narrow navigation remains horizontally scrollable; native select values abbreviate within their existing controls. No design or business rules were changed. This is publication verification, not an exhaustive acceptance test or employee approval.

The earlier local-only/pending-browser notes above describe the original November 3 session and are superseded for the checks listed here. Employee feedback and open business decisions remain pending.
