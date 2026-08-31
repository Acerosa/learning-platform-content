# Learning Platform Content

`@learning-platform/content` is the shared curriculum contract for Learning Platform hubs and the Admin authoring portal.

Canonical repository: [Acerosa/learning-platform-content](https://github.com/Acerosa/learning-platform-content).

It owns canonical `lp.content.*` schemas, validation, block types, importers, sanitisation, learner-safe package transforms and generic render helpers. It does not own teaching copy, learner records, or publication.

Learner bundles exclude authoritative marking data. Authoring packages keep full marking specs for Admin, catalogue import and tests.

Version **0.1.2**. Schema version **0.1.0**. Tag **v0.1.2**.

## Install

```bash
npm install
npm run check
```

Builds:

- `dist/learning-platform-content.iife.js` — browser global `LearningPlatformContent`
- `dist/learning-platform-content.esm.js` / `.mjs` — named ESM exports
- `dist/learning-platform-content.cjs.js` — Node `require`

## Public API

```js
import {
  validatePackage,
  renderActivity,
  importJson,
  sanitiseContent,
  learnerSafePackage,
  BlockRegistry
} from "@learning-platform/content";
```

GitHub Pages hubs copy the reviewed IIFE into `vendor/learning-platform-content/0.1.0/`. Point `APP_CONFIG.curriculumPackage` at that hub's canonical JSON directory.

## Documents

- [Architecture](docs/architecture.md)
- [Public API](docs/public-api.md)
- [Schemas](docs/schemas.md)
- [Versioning](docs/versioning.md)
- [Browser builds](docs/browser-builds.md)
- [Integration](docs/integration.md)
- [Consumer guide](docs/consumer-guide.md)
- [Migration guide](docs/migration-guide.md)
- [Changelog](CHANGELOG.md)
