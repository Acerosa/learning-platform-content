const assert = require("node:assert/strict");
const test = require("node:test");
const engine = require("../dist/learning-platform-content.cjs.js");

test("sanitiseContent rejects script tags, event handlers and javascript URLs", function () {
  assert.equal(engine.containsUnsafeMarkup("<script>alert(1)</script>"), true);
  assert.throws(function () {
    engine.sanitiseContent("<img src=x onerror=alert(1)>");
  }, function (error) {
    return error && error.code === "UNSAFE_CONTENT";
  });
  assert.throws(function () {
    engine.sanitiseContent({ text: "javascript:alert(1)" });
  }, function (error) {
    return error && error.code === "UNSAFE_CONTENT";
  });
});

test("sanitiseContent keeps safe strings", function () {
  assert.equal(engine.sanitiseContent("Heading text"), "Heading text");
  assert.deepEqual(engine.sanitiseContent({ title: "Safe" }), { title: "Safe" });
});
