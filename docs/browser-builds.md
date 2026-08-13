# Browser builds

GitHub Pages hubs have no bundler. Admin is an ESM application. This package
ships both.

## Outputs

| File | Use |
| --- | --- |
| `dist/learning-platform-content.iife.js` | Browser global `LearningPlatformContent` |
| `dist/learning-platform-content.esm.js` | Bundler ESM (`module` field) |
| `dist/learning-platform-content.mjs` | Node-native ESM named exports |
| `dist/learning-platform-content.cjs.js` | Node `require`, including directory helpers |

Build:

```bash
npm run build
```

## GitHub Pages

Copy the reviewed IIFE (and LICENSE) into the hub:

```text
vendor/learning-platform-content/0.1.0/learning-platform-content.iife.js
```

Record the package commit in `PROVENANCE.md`. Load it before hub-local learner
adapters:

```html
<script defer src="./vendor/learning-platform-content/0.1.0/learning-platform-content.iife.js"></script>
<script defer src="./content/engine/state.js"></script>
<script defer src="./content/engine/submit.js"></script>
<script defer src="./content/engine/interactive.js"></script>
```

Set `APP_CONFIG.curriculumPackage` to that hub's JSON directory. The package
default path is `content`, not a unit identifier.

## Admin

```js
import { getLearningPlatformContent } from "@learning-platform/content";
```

Do not vendor a second engine copy inside Admin. Workbook binary parsing stays
in Admin (`xlsx@0.18.5`).
