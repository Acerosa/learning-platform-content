# Integration

Canonical repository: [Acerosa/learning-platform-content](https://github.com/Acerosa/learning-platform-content).

## Ownership

| Owner | Responsibility |
| --- | --- |
| `@learning-platform/content` | Schemas, validator, importers, block registry, sanitisation, learner-safe package transform, generic render helpers, browser/Node builds |
| Unit 14 hub | Teaching JSON, branding, routes, learner draft/submit adapters, vendored IIFE |
| Admin | Authoring UI, local drafts, preview pane, `.xlsx` parsing, Options/Feedback sheet extensions, export |
| Core | Auth, theme, learner-safe API, evidence helpers |
| Backend | Identity, catalogue, attempts, RLS |

This package has no Auth, credentials, database code or GitHub automation.

## Unit 14

1. Vendor `learning-platform-content.iife.js` and the CJS build under
   `vendor/learning-platform-content/0.1.0/`.
2. Keep `content/unit-14/` as hub-owned curriculum.
3. Keep `content/engine/state.js`, `submit.js` and `interactive.js`.
4. Point `content/engine/index.js` at the vendored CJS build for Node tests.
5. Do not put Unit 14 identifiers into package sources.

Week 1 must keep validating and rendering from the same JSON.

## Admin

1. Depend on `@learning-platform/content` (`file:../learning-platform-content`
   during foundation development).
2. Call `getLearningPlatformContent()` from `src/content/engine.ts`.
3. Keep authoring UI, draft store, preview iframe and export in Admin.
4. Keep workbook-specific Options/Feedback merging in Admin.
5. Delegate import sanitisation to `sanitiseContent`.

## Future extraction

Later hubs (T Level, Unit 3) should vendor the same IIFE. Do not extract
question banks, assignment briefs or hub navigation into this package.

Publication, GitHub commit automation and backend curriculum RPCs are later
specifications. They are not part of 0.1.0.
