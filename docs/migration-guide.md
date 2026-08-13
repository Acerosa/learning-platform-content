# Migration guide

Canonical repository: [Acerosa/learning-platform-content](https://github.com/Acerosa/learning-platform-content).

This guide records how the proven Unit 14 engine and Admin vendored snapshot became `@learning-platform/content` **0.1.0**. It is not a licence to redesign the contract.

## What moved

From Unit 14 `content/engine/` and the Admin vendored snapshot:

- `lp.content.*` schemas
- validator
- block registry
- JSON and sheet importers
- generic renderer
- import sanitisation

## What stayed

| Consumer | Stays in the consumer |
| --- | --- |
| Unit 14 | `content/unit-14/`, branding, routes, `state.js`, `submit.js`, `interactive.js` |
| Admin | authoring UI, drafts, preview adapters, `.xlsx` parsing, Options/Feedback merge, export |

## Unit 14 sequence (completed)

1. Extract generic engine files into `@learning-platform/content`.
2. Vendor the reviewed IIFE and CJS build under `vendor/learning-platform-content/0.1.0/`.
3. Replace the multi-script engine tags with one IIFE plus hub adapters.
4. Point `content/engine/index.js` at the vendored CJS build.
5. Delete hub copies of constants, registry, validate, load, resolve, checks, render, importer, excel and browser helpers.
6. Keep Week 1 JSON and learner draft/submit behaviour unchanged.

## Admin sequence (completed)

1. Replace `vendor/learning-platform-content/` with `"@learning-platform/content": "file:../learning-platform-content"`.
2. Import `getLearningPlatformContent()` from the package.
3. Keep workbook Options/Feedback merging in Admin.
4. Delegate sanitisation to `sanitiseContent` while keeping Admin wrapper names for existing tests.

## Checks

- Package: `npm test`
- Unit 14: `node --test`
- Admin: `npm run lint && npm run typecheck && npm test`

Week 1 validation, rendering, interactive blocks and draft recovery must still pass. Admin validation, preview, import and export must still pass.

## Do not migrate here

Publication, GitHub curriculum automation, Weeks 2–19 teaching copy, Core Auth and backend RPCs are later specifications.
