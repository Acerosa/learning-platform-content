# Schemas

Canonical documents use the `lp.content.*` family. This package owns the JSON
Schema files in `schemas/`. Fields were not redesigned during extraction.

## Envelope

Every document uses:

- `schema` — for example `lp.content.week`
- `schemaVersion` — schema contract version (`0.1.0`)
- `id` — stable identifier
- `version` — document version
- `metadata` — display and planner fields
- `relationships` — ids of other documents, never nested HTML

## Supported objects

| Schema id | File |
| --- | --- |
| `lp.content.package` | `schemas/package.schema.json` |
| `lp.content.hub` | `schemas/hub.schema.json` |
| `lp.content.curriculum` | `schemas/curriculum.schema.json` |
| `lp.content.learning-outcome` | `schemas/learning-outcome.schema.json` |
| `lp.content.assignment` | `schemas/assignment.schema.json` |
| `lp.content.week` | `schemas/week.schema.json` |
| `lp.content.session` | `schemas/session.schema.json` |
| `lp.content.activity` | `schemas/activity.schema.json` |
| `lp.content.block` | `schemas/block.schema.json` |
| `lp.content.question` | `schemas/question.schema.json` |
| `lp.content.asset` | `schemas/asset.schema.json` |

Runtime validation is the JavaScript validator, not a JSON Schema engine. The
JSON files are the published contract for authors and Admin.

Activities are ordered block lists. Quiz, coding and reflection are block
compositions, not separate engines.

Session kinds: `session`, `independent-study`, `homework`, `revision`,
`retrieval`.

Statuses: `planned`, `available`, `archived`.
