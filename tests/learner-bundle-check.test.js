const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

test("check:learner-bundle inspects dist content JSON and asset quoted keys", function () {
  const { inspectLearnerBundle, checkLearnerBundle, learnerSafePackage } = require("../scripts/learner-safe.js");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lp-learner-bundle-"));
  try {
    const unsafe = path.join(root, "unsafe");
    fs.mkdirSync(path.join(unsafe, "content"), { recursive: true });
    fs.mkdirSync(path.join(unsafe, "assets"), { recursive: true });
    fs.writeFileSync(path.join(unsafe, "content", "package.json"), JSON.stringify({
      schema: "lp.content.package",
      id: "demo",
      correctOptionId: "a"
    }));
    fs.writeFileSync(path.join(unsafe, "assets", "main.js"), "export default {\"correctOptionId\":\"a\"}");
    assert.ok(inspectLearnerBundle(unsafe).length >= 2);

    const safeRoot = path.join(root, "safe");
    fs.mkdirSync(path.join(safeRoot, "content"), { recursive: true });
    fs.mkdirSync(path.join(safeRoot, "assets"), { recursive: true });
    fs.writeFileSync(path.join(safeRoot, "content", "package.json"), JSON.stringify(learnerSafePackage({
      schema: "lp.content.package",
      id: "demo",
      correctOptionId: "a",
      prompt: "Choose"
    })));
    fs.writeFileSync(path.join(safeRoot, "assets", "main.js"), "export default {id:\"demo\",prompt:\"Choose\"}");
    assert.deepEqual(inspectLearnerBundle(safeRoot), []);
    assert.equal(checkLearnerBundle(safeRoot).ok, true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
