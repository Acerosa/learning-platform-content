# Architecture

`@learning-platform/content` owns the canonical curriculum contract.

```text
Authoring formats (JSON / Excel)
        │
        ▼
  canonical lp.content.* documents
        │
        ├── validator
        ├── block registry
        ├── loader / resolver
        └── renderer
                │
                ▼
     learner hub / Admin preview
```

## What this package owns

- `lp.content.*` JSON schemas (`0.1.0`)
- block type registry
- package validation
- JSON and sheet importers
- generic HTML render helpers

## What this package does not own

- hub teaching copy or question banks
- learner Auth, attempts, marks or RLS
- Admin draft persistence
- GitHub publishing
- Core evidence / `submit_attempt` wiring

Learner draft storage and Core submission adapters stay in each hub.

## Browser and Node

GitHub Pages hubs copy the reviewed IIFE into `vendor/learning-platform-content/0.1.0/`, the same way they vendor Core.

Node and Admin import `@learning-platform/content`. Admin uses `getLearningPlatformContent()` from the ESM build.

## Provenance

Extracted from Unit 14 `content/engine` after the curriculum-engine MVP proved:

canonical JSON → learner renderer → Core evidence → backend attempts
