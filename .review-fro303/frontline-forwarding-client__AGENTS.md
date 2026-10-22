## Shared Engineering Workflow

Read the [root instructions](../AGENTS.md) and load or resume the task's local
playbook from the repository root before frontend work. Follow its coherent
slices, separate model checkpoints, and approval of the actual diff before
every commit. Preserve the framework skill loading and app-specific rules below.
Use the loaded testing policy and local browser validation for consequential
operational UI changes, and regenerate affected GraphQL documents as required.

<!-- intent-skills:start -->

## Skill Loading

Before substantial work:

- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Project Context

## Scaffold provenance

- Created from the TanStack CLI with: `npx @tanstack/cli@latest create my-tanstack-app --agent`
- The initial CLI process created the project and git repository, then dependency installation was continued with `npm install` after the command timed out in the execution environment.
- Follow-up Intent commands run from the project root:
  - `npx @tanstack/intent@latest install`
  - `npx @tanstack/intent@latest list`
  - `npx @tanstack/intent@latest load @tanstack/react-start#react-start @tanstack/router-core#router-core @tanstack/router-core#router-core/data-loading @tanstack/start-client-core#start-core @tanstack/start-client-core#start-core/execution-model @tanstack/start-client-core#start-core/server-functions @tanstack/router-plugin#router-plugin`

## Chosen stack

- React
- TanStack Start blank starter
- TanStack Router via file routes in `src/routes`
- TanStack Query demonstrated on the home route
- TanStack Table demonstrated on the home route
- TanStack Form demonstrated on the home route
- TanStack Store demonstrated on the home route
- TanStack CLI retained as a dev dependency and exposed through package scripts
- TanStack Intent retained as a dev dependency and exposed through package scripts
- CodeRabbit represented as external repository tooling through `.coderabbit.yaml`

## Runtime

- Use Node.js `22.13.0` for local frontend development and CI.
- The package declares `engines.node >=22.13.0` because Vite 8 requires Node `20.19+` or `22.12+`; the project standardizes on Node 22.13+ so pnpm and Vite share a compatible runtime.

## Partner integration notes

CodeRabbit is not a runtime SDK for this app and was not added to app code. Use the standard CodeRabbit GitHub App repository installation path for pull request reviews, then keep `.coderabbit.yaml` as repository-level review guidance.

## Environment variables

No required runtime environment variables are currently defined.

For future server-only secrets, keep them unprefixed and read them only from server code. Only expose client-safe values with the `VITE_` prefix when intentionally needed in browser code.

## Deployment notes

- Build with `npm run build`.
- Preview locally with `npm run preview`.
- Use the TanStack Start deployment guidance for the target host before adding host-specific adapters or environment variables.

## Architecture decisions

- Preserved the TanStack CLI project shape: Vite config, route generation, `src/router.tsx`, and filesystem routes.
- Removed nonessential starter feature pages/components to keep the app blank/minimal.
- Kept demonstrations small and local to the index route to avoid feature scaffolding.
- Kept CodeRabbit out of runtime app code.

## Route Boundaries

- Keep route files thin. A route should handle route params, query state, loading/error rendering, and passing loaded data into feature components.
- Put feature-specific UI sections, cards, tables, and detail layouts under `src/features/<feature>/components`.
- For detail pages such as `$userId.tsx` and `$companyId.tsx`, keep the route responsible for params and query state, then pass `userQuery.data` or `companyQuery.data` into a feature component such as `UserDetailCard` or `CompanyDetailCard`.
- Do not embed substantial detail-card markup directly in route files unless it is temporary scaffolding being immediately extracted.

## Form Boundaries

- Use TanStack Form (`@tanstack/react-form`) for create/edit forms and other non-trivial application forms.
- Keep form components under `src/features/<feature>/components`; routes should pass loaded records, mutation state, submit labels, and submit handlers into the form component.
- Keep persistence in feature services and mutation hooks; form components should collect and validate values, then call the provided submit handler.
- Purchase-order forms edit the PO header and create one permanent handling-unit identity per colli row. Collis are optional at creation because their count and details may remain unknown until supplier readiness or opening-warehouse intake. While a PO is `PENDING`, `EXPECTED_READINESS`, or `READY`, active colli rows may be corrected, added, or removed: edits preserve identity, additions create permanent identities, and removals create an audited `CANCELLED` terminal disposition. The colli set becomes immutable when the PO reaches `IN_STOCK`. Client company and vessel are immutable after creation; supplier, invoice company, collection agent, references, commercial fields, and notes remain editable only while the backend permits header changes.
- Never model a quantity row as several interchangeable packages. An “add identical” convenience may duplicate form values, but submission must expand them into separate handling-unit inputs.
- Purchase-order detail screens should expose overview/commercial data, collis, warehouse stays, status history, activities/messages, split lineage, active shipment, and state/authority-appropriate commands.
- Shipment creation starts from eligible POs at one origin warehouse: `IN_STOCK`, supplier `READY`, or `EXPECTED_READINESS` dated today or later. It may select individual nonterminal collis. Every selected colli is already a physical package and may ship individually. Pallets and cardboard boxes are optional overpacks; a colli may be assigned to at most one of them. If an `IN_STOCK` PO selection is partial, the wizard must obtain an explicit split decision; shipment creation atomically moves the selected collis into an in-stock child PO and reserves that child, while unselected and terminal collis remain on the parent.
- Handling-unit trace views may show a partner the traced colli’s PO, warehouse, shipment, document, load-unit, disposition, and handover context without exposing unrelated contents of a mixed shipment.
- PO and shipment attachments are shared, auditable records backed by the system
  file-storage abstraction. The database owns metadata and authorization scope;
  file bytes remain in object storage. Do not conflate attachments with the
  removed stock-era invoice-row or print-slip flows.
- Purchase-order attachments inherited through a split must show their source
  PO provenance and remain downloadable but read-only from the child PO.
- When purchase-order, handling-unit, or shipment GraphQL documents change, run `npm run graphql:codegen` and include the regenerated `src/graphql/generated` artifacts.
- GraphQL requests must send the selected UI locale through `Accept-Language`; do not display untranslated backend validation text when a localized message is available.

## Type Boundaries

- Prefer TypeScript `enum` declarations for frontend values that mirror backend Java enums, such as company types, user roles, user statuses, sort fields, and sort directions.
- Keep feature-specific enums in the owning feature `types.ts`; import and reuse them in forms, routes, services, tests, and components instead of repeating string literals.

## Authorization UI

- Backend authorization is authoritative. Client-side guards and wrappers only hide unavailable actions or sections for usability.
- Use `UserAuthority` from `src/features/auth/types.ts` for frontend values that mirror backend `UserAuthority`.
- Use the shared `Can` component or `hasAuthority` helpers for permission-aware page fragments such as create/edit buttons, restricted cards, and navigation items.
- Do not create separate route trees by role unless the workflow itself diverges. Prefer shared routes with backend-scoped data and permission-aware fragments.
- Never assume hidden UI means access is blocked; service calls must still handle backend access-denied errors.
- In user forms, keep owning company and case-routing coverage separate: `companyId` is the company the user belongs to, while `caseCoverage` only describes client companies and vessels used later to route imported freight-forwarding cases. Coverage is not direct company, vessel, user, or case access.
- For client-company users, the coverage company is always the owning `companyId`; show only the vessel picker for that company and submit at most one coverage entry for it. Non-shipping commercial client companies with no vessels should not submit case-routing coverage.
- Associated network agents use `CompanyType.ASSOCIATED_AGENT`; external
  third-party agents use `CompanyType.AGENT`. Both support only
  `UserRole.AGENT_OPERATOR`. Do not show or submit case-routing coverage for
  either agent type.

## Known gotchas

- `@tanstack/react-start` code is isomorphic by default. Put server-only logic behind server functions or server-only modules.
- TanStack Start requires `<HeadContent />` in `<head>` and `<Scripts />` in `<body>`.
- Keep `tanstackStart()` before `viteReact()` in Vite plugin ordering.
- `npm audit` currently reports 2 low-severity dev dependency vulnerabilities after adding local CLI/Intent packages.

## Next steps

- Install the CodeRabbit GitHub App on the repository for PR reviews.
- Add real application routes/features only when needed.
- Add deployment-specific configuration when the target platform is known.
