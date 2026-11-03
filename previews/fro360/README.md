# FRO-360 local concept review

Open `index.html` directly in Chrome or Edge (double-click it in File Explorer). It is self-contained and needs no server, network connection, installation or production access. Use the visible controls to switch direction, language and scenario. Direct-file mode does not update URL parameters.

Three directions: overview first, action first and Shipment context first. All data is invented fixture data; actions update memory only and reset on reload. These are proposals for employee review, not approved production designs.

Rebuild after editing: `python previews/fro360/build.py` from the planning repository root.

Optional server: `python -m http.server 8360 --bind 127.0.0.1 --directory previews/fro360`. Localhost timed out in the agent environment on 2026-11-03; do not rely on that URL until verified on the user's machine.

Validation: JavaScript syntax check and standalone build passed. Browser interaction and responsive visual verification remain pending because browser tooling stopped and the local endpoint was unreachable. No public deployment, production implementation, mock branch or Linear update was performed.

Source provenance and component mapping are in `component-map.md` and `design-map.md`.
