# Architecture

`@learning-platform/content` owns the canonical curriculum contract extracted
from the proven Unit 14 engine and Admin authoring MVP.

Canonical repository: [Acerosa/learning-platform-content](https://github.com/Acerosa/learning-platform-content).

```text
Authoring formats (JSON / Excel)
        │
        ▼
  canonical lp.content.* documents
        │
        ├── validator
        ├── block registry
        ├── sanitisation
        ├── learner-safe package transform
        ├── loader / resolver
        └── renderer
                │
                ▼
     learner hub / Admin preview
```

## Package responsibilities

- `lp.content.*` JSON schemas (`0.1.0`)
- block type registry
- package and document validation
- JSON and sheet importers
- import sanitisation (script tags, event handlers, `javascript:` URLs)
- learner-safe package transform (learner bundles exclude authoritative marking data)
- generic HTML render helpers
- IIFE, ESM and CJS builds
- documentation for ownership, API, schemas, versioning and integration

## Consumer responsibilities

Hubs own teaching copy, branding, navigation and learner draft/submit
adapters. Admin owns authoring UI, local drafts, `.xlsx` parsing and
workbook-specific sheet extensions. Core owns Auth. Backend owns learner
records.

## What this package does not own

- hub teaching copy or question banks
- learner Auth, attempts, marks or RLS
- Admin draft persistence or publication
- GitHub publishing
- Core evidence / `submit_attempt` wiring
- credentials or database code

The renderer is curriculum-neutral. It has no `if hub === "unit14"` branch.

## Provenance

Extracted after Parts 1–5 proved:

canonical JSON → learner renderer → Core evidence → backend attempts

and Admin preview/export against the same objects.
