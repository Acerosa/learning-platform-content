# Learning Platform Content

`@learning-platform/content` is the shared curriculum contract for Learning Platform hubs and the Admin authoring portal.

It owns canonical `lp.content.*` schemas, validation, block types, importers and generic render helpers. It does not own teaching copy, learner records, or publication.

Version **0.1.0**.

## Install

```bash
npm install
npm run check
```

Builds:

- `dist/learning-platform-content.iife.js` — browser global `LearningPlatformContent`
- `dist/learning-platform-content.esm.js` — `getLearningPlatformContent()`
- `dist/learning-platform-content.cjs.js` — Node `require`

## Static hub usage

Copy the reviewed IIFE into the hub vendor tree (same pattern as Core):

```html
<script src="./vendor/learning-platform-content/0.1.0/learning-platform-content.iife.js"></script>
```

Hubs keep learner draft/submit adapters locally. Point `APP_CONFIG.curriculumPackage` at that hub's canonical JSON directory.

## Node

```js
const engine = require("@learning-platform/content");
const result = engine.validateDirectory("./content/my-hub");
if (!result.valid) {
  console.error(engine.formatIssues(result.issues));
  process.exit(1);
}
```

## Documents

- [Architecture](docs/architecture.md)
- [Changelog](CHANGELOG.md)
