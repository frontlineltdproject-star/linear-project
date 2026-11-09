# Stock List evidence — main 6aa2595

Read the [run report](../runs/2026-11-09-stock-list-selection-printing.md) for findings, source links, assumptions and limits. [Verification receipt](stock-list-verification.json) records parent reruns and source comparison. These are observation/control checks, not proof of a fix or complete deployed journeys.

## Retained files

| Evidence | Scope |
| --- | --- |
| [Selection test](stock-list-selection-qa.test.tsx) / [notes](stock-list-selection-notes.md) | Real list/toolbar, cached eligibility, complete-set shipment handoff; 16 tests |
| [Filters test](stock-list-filters-qa.test.tsx) / [notes](stock-list-filters-notes.md) | Real controls/preferences/query state; 13 tests |
| [Preview test](stock-list-preview-qa.test.ts) | Actual preview service with synthetic fetch/window boundaries; 4 tests |
| [Model harness](stock-list-model-qa.py) / [results](stock-list-model-qa-results.json) / [notes](stock-list-model-notes.md) | Exact Java bodies with stand-ins, 69 controls + 5 observations and 7 static checks |
| [Renderer fixture generator](stock-list-render-qa.py) / [Java renderer](StockListRenderQA.java) | Actual template/CSS and OpenHTMLtoPDF layout, escaped synthetic bindings |
| [PDF inspection](stock-list-pdf-inspect-qa.py) | Six checks of rows, landscape/headers/footer, Greek text, multiline collapse, overlap and long-note retention |
| [Line-break PDF](stock-list-pdf/multiline-notes.pdf) / [image](stock-list-pdf/multiline-notes.pdf-1.png) | Synthetic saved External Notes lose line separation |
| [Split-ID PDF](stock-list-pdf/split-child-id.pdf) / [image](stock-list-pdf/split-child-id.pdf-1.png) | Synthetic valid child number overlaps Client |

Detailed subreview notes retain execution-time paths and commands as provenance. Their P2 annotations are reviewer suggestions, not approved ticket priorities. No ticket group or priority is decided by this evidence package. Generated Java, raw Vitest runner results, dependency jars/fonts and the full five-fixture PDF set remain isolated execution artifacts; selected examples and compact receipts are retained here.

## Frontend replay

Use an isolated checkout of production main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`, with client dependencies, jsdom and `#` alias to `src`. Copy the three test files to the client root. The filters test reads the Java policy through its `sourceRoot` constant: point it at that same pinned repository if the recorded temporary path no longer exists. Do not substitute another revision silently.

```text
node node_modules/vitest/vitest.mjs run stock-list-selection-qa.test.tsx --configLoader runner --no-cache
node node_modules/vitest/vitest.mjs run stock-list-filters-qa.test.tsx --configLoader runner --no-cache
node node_modules/vitest/vitest.mjs run stock-list-preview-qa.test.ts --configLoader runner
node node_modules/vitest/vitest.mjs run src/features/purchase-orders/components/purchase-order-table-state.test.ts src/features/purchase-orders/services/purchase-order-service.test.ts --configLoader runner
```

Parent runs: 16/16, 13/13, 4/4 and 30/30, exit 0. Existing harness used Node24.13, Vitest4.1.6, jsdom, one thread and cached dependencies. Not a clean project install/build. All 562 original client files remained byte-identical. Real fetch/XHR blocked for component cases; GraphQL/router/preview boundaries use synthetic doubles. Assertions distinguish submitted payload, local state, cache and actual persistence. No mutation was sent to the portal.

## Backend replay

Copy the script to an isolated output folder; it writes `StockListModelQa.java` and results beside itself.

```text
python stock-list-model-qa.py <absolute-pinned-repository-root> <absolute-java17-executable>
```

Java17 source execution uses exact extracted factory/service/auth/lookup/repository bodies. DTOs, role adapters, data repositories and a generic fluent-query evaluator are stand-ins; assembler/current membership and real SQL are inspected only. See the source/extraction hashes in the retained results. Networking and Java writes are blocked. The expected Java SecurityManager deprecation warning is not a test failure. No Spring/Java25/Gradle/PostgreSQL/concurrency verification is claimed.

## PDF replay

In an isolated output folder place `StockListRenderQA.java`, a DejaVuSans.ttf font and these public Maven jars: `com.openhtmltopdf:openhtmltopdf-core:1.0.10`, `com.openhtmltopdf:openhtmltopdf-pdfbox:1.0.10`, `org.apache.pdfbox:pdfbox:2.0.24`, `org.apache.pdfbox:fontbox:2.0.24`, `org.apache.pdfbox:xmpbox:2.0.24`, `de.rototor.pdfbox:graphics2d:0.32`, `commons-logging:commons-logging:1.2`. Java/javac must be available; the recorded run used Microsoft JDK11. The Python inspector requires pdfplumber.

```text
python stock-list-render-qa.py --source <absolute-pinned-repository-root> --output <absolute-isolated-output-folder>
python stock-list-pdf-inspect-qa.py <absolute-isolated-output-folder>
```

The generator reads the actual template and static logo, keeps CSS, replaces Thymeleaf text bindings with escaped fixture values, and invokes the same fast renderer/font-family setup. It does not execute Thymeleaf, Spring, actual model lookup or HTTP authorization. Local DejaVuSans bytes hash `3fdf69cabf06049ea70a00b5919340e2ce1e6d02b0cc3c4b44fb6801bd1e0d22`; template hash `47b0701452856aac00b88593f99555cd09559956f9fa1d7893f5eb92e087a898`. Deployment font identity is unverified.

Five fixtures produced eight pages: normal54 rows/three pages; short multiline notes/one; long unbroken reference and 2000-character note/two; 100 short note lines/one; root and long child ID/one. Every page was visually inspected. Six PDF assertions passed (four controls, two defect observations). Short lines A/B both top109.79 demonstrate collapsed line breaks; child ID ends x60.02 while Client starts57.90 demonstrate overlap. A known 2000-letter note retains all2000 letters across pages. These numbers describe synthetic local output only.

No production PDF, native browser popup, printer, deployed build or real database was tested. All full portal scenarios remain Not run. The source policy-loader failed on the archive's missing Git metadata; direct policy reading does not imply a successful loader snapshot.
