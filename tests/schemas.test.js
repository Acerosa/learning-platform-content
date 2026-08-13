const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const engine = require("../dist/learning-platform-content.cjs.js");

const schemaDir = path.join(__dirname, "../schemas");

const expected = [
  "package",
  "hub",
  "curriculum",
  "learning-outcome",
  "assignment",
  "week",
  "session",
  "activity",
  "block",
  "question",
  "asset"
];

test("canonical schemas cover the lp.content.* contract", function () {
  const ids = expected.map(function (name) {
    const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, name + ".schema.json"), "utf8"));
    assert.equal(schema.$id, "lp.content." + name);
    assert.deepEqual(schema.required.slice(0, 6), ["schema", "schemaVersion", "id", "version", "metadata", "relationships"]);
    return schema.$id;
  });
  assert.deepEqual(ids.sort(), [...engine.supportedSchemas].sort());
  assert.deepEqual([...engine.supportedVersions], ["0.1.0"]);
});
