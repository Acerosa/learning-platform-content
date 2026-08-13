const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

test("public package metadata and build outputs exist", function () {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(pkg.name, "@learning-platform/content");
  assert.equal(pkg.version, "0.1.0");
  [
    "dist/learning-platform-content.iife.js",
    "dist/learning-platform-content.cjs.js",
    "dist/learning-platform-content.mjs",
    "dist/learning-platform-content.esm.js",
    "schemas/week.schema.json",
    "schemas/activity.schema.json"
  ].forEach(function (relative) {
    assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  });
});

test("engine sources do not contain hub-specific identifiers", function () {
  const srcDir = path.join(root, "src");
  const source = fs.readdirSync(srcDir).map(function (name) {
    return fs.readFileSync(path.join(srcDir, name), "utf8");
  }).join("\n");
  assert.doesNotMatch(source, /Unit 14|H\/507\/5017|ocr-level-3-it|unit-3-cyber|tlevel-software/i);
});

test("ESM bundle exports getLearningPlatformContent without Node helpers", function () {
  const esm = fs.readFileSync(path.join(root, "dist/learning-platform-content.mjs"), "utf8");
  assert.match(esm, /export function getLearningPlatformContent/);
  assert.doesNotMatch(esm, /require\("node:fs"\)/);
});

test("required documentation exists", function () {
  [
    "README.md",
    "docs/architecture.md",
    "docs/public-api.md",
    "docs/schemas.md",
    "docs/versioning.md",
    "docs/browser-builds.md",
    "docs/integration.md",
    "docs/consumer-guide.md",
    "docs/migration-guide.md"
  ].forEach(function (relative) {
    const content = fs.readFileSync(path.join(root, relative), "utf8");
    assert.ok(content.length > 300, relative);
  });
});

test("CJS bundle exposes Node directory helpers", function () {
  const engine = require("../dist/learning-platform-content.cjs.js");
  assert.equal(typeof engine.nodeIo, "function");
  assert.equal(typeof engine.loadPackageFromDirectory, "function");
  assert.equal(typeof engine.validateDirectory, "function");
});

test("Node ESM import exposes the documented public API", async function () {
  const mod = await import("../dist/learning-platform-content.mjs");
  assert.equal(typeof mod.getLearningPlatformContent, "function");
  assert.equal(typeof mod.validatePackage, "function");
  assert.equal(typeof mod.renderActivity, "function");
  assert.equal(typeof mod.renderSession, "function");
  assert.equal(typeof mod.importJson, "function");
  assert.equal(typeof mod.importExcel, "function");
  assert.equal(typeof mod.sanitiseContent, "function");
  assert.ok(mod.BlockRegistry);
  assert.ok(mod.supportedSchemas.includes("lp.content.activity"));
  assert.deepEqual([...mod.supportedVersions], ["0.1.0"]);
  assert.equal(mod.getLearningPlatformContent().SCHEMA_VERSION, "0.1.0");
});
