# Consumer guide

Canonical repository: [Acerosa/learning-platform-content](https://github.com/Acerosa/learning-platform-content).

`@learning-platform/content` **0.1.2** is the official Learning Platform curriculum engine. Hubs and Admin must not keep a private copy of schemas, validation, rendering, the block registry, generic importers, sanitisation or the learner-safe package transform.

Learner hub production builds must ship a learner-safe derivative of curriculum packages. Authoring JSON in git may still contain marking specs for Admin, catalogue import and tests. Use `learnerSafeContentPlugin` and `check:learner-bundle` from this package rather than a hub-local field list.

## Unit 14 (GitHub Pages hub)

Keep in the hub:

- `content/unit-14/` teaching JSON
- branding, routes, `APP_CONFIG`
- `content/engine/state.js`, `submit.js`, `interactive.js`

Vendor the reviewed IIFE/CJS build:

```text
vendor/learning-platform-content/0.1.0/
```

Record the package commit in `PROVENANCE.md`. Load the IIFE before hub-local adapters. Point `APP_CONFIG.curriculumPackage` at `content/unit-14`.

Node tests require `content/engine/index.js`, which re-exports the vendored CJS build plus those adapters.

## Admin

Depend on the package:

```json
"@learning-platform/content": "file:../learning-platform-content"
```

Keep in Admin:

- authoring UI
- local drafts
- preview pane
- `.xlsx` parsing (`xlsx@0.18.5`)
- Options / Feedback sheet extensions
- export

Call `getLearningPlatformContent()` from `src/content/engine.ts`. Delegate import sanitisation to `sanitiseContent`. Do not vendor a second engine tree.

## Later hubs

T Level and Unit 3 are out of scope for this version. When they adopt the contract they should vendor the same IIFE. Do not copy package sources into those hubs.
