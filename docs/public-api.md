# Public API

This document defines the supported `0.1.0` contract for hubs and Admin. It is
normative for package consumers.

Canonical repository: [Acerosa/learning-platform-content](https://github.com/Acerosa/learning-platform-content).

Classifications:

- **STABLE** — supported within the `0.1.x` compatibility policy.
- **COMPAT** — retained so existing Unit 14 and Admin call sites keep working.
- **INTERNAL** — implementation detail. Do not deep-import `src/`.

The GitHub Pages IIFE still attaches the full `LearningPlatformContent`
namespace. Named ESM exports are the small explicit API.

## Entry

```js
import {
  getLearningPlatformContent,
  validateDocument,
  validatePackage,
  renderActivity,
  renderWeek,
  renderSession,
  importJson,
  importExcel,
  sanitiseContent,
  BlockRegistry,
  supportedSchemas,
  supportedVersions
} from "@learning-platform/content";
```

Browser (vendored IIFE):

```js
const api = globalThis.LearningPlatformContent;
```

`getLearningPlatformContent()` returns the same namespace. Admin uses that
COMPAT entry so existing adapters do not rewrite every call.

## STABLE exports

| Name | Purpose |
| --- | --- |
| `validateDocument(doc, expectedSchema?)` | Validate one envelope. Returns `{ code, path, message }[]`. |
| `validatePackage(pkg)` | Validate a loaded package. Returns `{ valid, issues }`. |
| `renderActivity(activity, options?)` | HTML for one activity. |
| `renderWeek(resolved, options?)` | HTML for a resolved week. |
| `renderSession(resolved, options?)` | HTML for a resolved session. |
| `importJson(value)` | Canonical package from JSON object or string. |
| `importExcel(sheets, hub?, curriculum?)` | Canonical package from parsed sheet objects or CSV text. |
| `sanitiseContent(value)` | Reject script tags, event handlers and `javascript:` URLs. |
| `BlockRegistry` | Registered block types and lookup helpers. |
| `supportedSchemas` | Frozen `lp.content.*` schema ids. |
| `supportedVersions` | Frozen supported `schemaVersion` values. Currently `["0.1.0"]`. |

`importExcel` does not parse `.xlsx` binaries. Admin keeps the `xlsx@0.18.5`
workbook adapter and Options/Feedback sheet extensions.

## COMPAT names

These remain on the namespace and must not be removed in `0.1.x`:

`SCHEMA_VERSION`, `SCHEMAS`, `SESSION_KINDS`, `BLOCK_TYPES`, `validateDirectory`,
`loadPackageFromDirectory`, `loadPackageFromFiles`, `importJSON`,
`importFromSheets`, `importFromCsvSheets`, `formatIssues`, `resolveWeek`,
`resolveActivity`, `normaliseBlock`, `getBlockType`.

## Not exported as a hub/Admin contract

Node filesystem helpers (`nodeIo`) exist only on the CJS build. Learner draft
storage, Core `submit_attempt`, Admin drafts and Excel Options/Feedback merging
stay in consumers.
