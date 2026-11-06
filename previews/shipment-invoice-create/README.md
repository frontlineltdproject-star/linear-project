# Shipment Invoice create preview

Open index.html directly in a browser. It is self-contained and uses fixture data only. Nothing saves to production. A is the recommended stacked-card layout; B uses tabs. The visible toolbar switches languages and scenarios. URL parameters: direction=a|b, lang=en|el, state=default|loading|empty|error|mixed|overlap|stale. Use entry=standalone for an initially empty Shipment picker.

The preview shows appearance and proposed interactions. The approved ticket description remains the behavior contract. Native select/date controls and font fallbacks approximate the portal components; see component-map.md.

Verification: install Playwright, then run node verify.cjs (Edge required). Alternatively set PLAYWRIGHT_MODULE to an existing Playwright module path. The script checks 56 responsive/state combinations and key selection/refresh safeguards and regenerates screenshots.

Publication and Linear attachment are deferred pending design and ticket approval.
