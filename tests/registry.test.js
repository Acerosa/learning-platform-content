const assert = require("node:assert/strict");
const test = require("node:test");
const engine = require("../dist/learning-platform-content.cjs.js");

test("BlockRegistry lists implemented interactive types", function () {
  const registry = engine.BlockRegistry;
  [
    "single-choice",
    "classification",
    "short-response",
    "code-editor",
    "python-exercise",
    "reflection",
    "heading",
    "paragraph"
  ].forEach(function (id) {
    const record = registry.get(id);
    assert.ok(record, id);
    assert.equal(record.implemented, true);
  });
  assert.equal(registry.isInteractive("python-exercise"), true);
  assert.equal(registry.isRegistered("multiple-choice"), true);
  assert.equal(registry.get("multiple-choice").implemented, false);
});
