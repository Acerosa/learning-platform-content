const assert = require("node:assert/strict");
const test = require("node:test");
const engine = require("../dist/learning-platform-content.cjs.js");

function envelope(schema, id, metadata, extra) {
  return Object.assign({
    schema: schema,
    schemaVersion: engine.SCHEMA_VERSION,
    id: id,
    version: engine.SCHEMA_VERSION,
    metadata: metadata,
    relationships: {}
  }, extra || {});
}

function samplePackage(activities) {
  return {
    hub: envelope(engine.SCHEMAS.HUB, "demo-hub", { name: "Demo Hub" }, {
      relationships: { curriculum: "demo-curriculum" }
    }),
    curriculum: envelope(engine.SCHEMAS.CURRICULUM, "demo-curriculum", { title: "Demo", course: "demo-course" }, {
      relationships: { learningOutcomes: [], assignments: [], weeks: [] }
    }),
    learningOutcomes: [],
    assignments: [],
    weeks: [],
    sessions: [],
    activities: activities,
    questions: [],
    assets: []
  };
}

function activityWithBlocks(id, blocks) {
  return envelope(engine.SCHEMAS.ACTIVITY, id, { title: id, status: "available" }, { blocks: blocks });
}

function dragDropContent(overrides) {
  return Object.assign({
    formative: true,
    questionId: "demo-dd",
    prompt: "Match each item to a target.",
    items: [
      { id: "find", label: "Find courses" },
      { id: "register", label: "Record attendance" }
    ],
    targets: [
      { id: "learner", label: "Learner" },
      { id: "tutor", label: "Tutor" }
    ],
    correct: { find: "learner", register: "tutor" },
    feedback: { correct: "Those placements match.", incorrect: "Check the targets." }
  }, overrides || {});
}

function dragDropBlock(overrides) {
  return engine.normaliseBlock({
    id: "dd-1",
    type: "drag-drop",
    content: dragDropContent(overrides)
  });
}

function validateBlocks(blocks) {
  return engine.validatePackage(samplePackage([activityWithBlocks("demo-activity", blocks)]));
}

test("valid drag-drop block passes package validation", function () {
  const result = validateBlocks([dragDropBlock()]);
  assert.equal(result.valid, true, engine.formatIssues(result.issues));
});

test("drag-drop missing required fields fails", function () {
  const missingPrompt = validateBlocks([dragDropBlock({ prompt: "" })]);
  assert.equal(missingPrompt.valid, false);
  assert.ok(missingPrompt.issues.some(function (issue) {
    return issue.code === "MISSING_FIELD" && /prompt/.test(issue.path);
  }));

  const missingItems = validateBlocks([dragDropBlock({ items: [] })]);
  assert.equal(missingItems.valid, false);
  assert.ok(missingItems.issues.some(function (issue) {
    return issue.code === "MISSING_FIELD" && /items/.test(issue.path);
  }));

  const missingTargets = validateBlocks([dragDropBlock({ targets: [] })]);
  assert.equal(missingTargets.valid, false);
  assert.ok(missingTargets.issues.some(function (issue) {
    return issue.code === "MISSING_FIELD" && /targets/.test(issue.path);
  }));

  const missingMapping = validateBlocks([dragDropBlock({ correct: null })]);
  assert.equal(missingMapping.valid, false);
  assert.ok(missingMapping.issues.some(function (issue) {
    return issue.code === "MISSING_FIELD" && /correct/.test(issue.path);
  }));
});

test("malformed drag-drop item/target mapping fails", function () {
  const unknownTarget = validateBlocks([dragDropBlock({ correct: { find: "missing", register: "tutor" } })]);
  assert.equal(unknownTarget.valid, false);
  assert.ok(unknownTarget.issues.some(function (issue) {
    return issue.code === "INVALID_RELATIONSHIP" && /unknown target/.test(issue.message);
  }));

  const missingItemMap = validateBlocks([dragDropBlock({ correct: { find: "learner" } })]);
  assert.equal(missingItemMap.valid, false);
  assert.ok(missingItemMap.issues.some(function (issue) {
    return issue.code === "MISSING_FIELD" && /register/.test(issue.path);
  }));

  const extraItem = validateBlocks([dragDropBlock({
    correct: { find: "learner", register: "tutor", extra: "learner" }
  })]);
  assert.equal(extraItem.valid, false);
  assert.ok(extraItem.issues.some(function (issue) {
    return issue.code === "INVALID_RELATIONSHIP" && /unknown item/.test(issue.message);
  }));

  const duplicateTarget = validateBlocks([dragDropBlock({
    correct: { find: "learner", register: "learner" }
  })]);
  assert.equal(duplicateTarget.valid, false);
  assert.ok(duplicateTarget.issues.some(function (issue) {
    return issue.code === "INVALID_RELATIONSHIP" && /more than once/.test(issue.message);
  }));
});

test("existing single-choice still passes", function () {
  const result = validateBlocks([engine.normaliseBlock({
    id: "sc-1",
    type: "single-choice",
    content: {
      prompt: "Choose one",
      options: [{ id: "a", label: "A" }, { id: "b", label: "B" }],
      correctOptionId: "a"
    }
  })]);
  assert.equal(result.valid, true, engine.formatIssues(result.issues));
});

test("existing classification still passes", function () {
  const result = validateBlocks([engine.normaliseBlock({
    id: "cl-1",
    type: "classification",
    content: {
      prompt: "Classify",
      categories: [{ id: "threat", label: "Threat" }],
      items: [{ id: "phish", label: "Phishing", correctCategoryId: "threat" }]
    }
  })]);
  assert.equal(result.valid, true, engine.formatIssues(result.issues));
});

test("existing short-response still passes", function () {
  const result = validateBlocks([engine.normaliseBlock({
    id: "sr-1",
    type: "short-response",
    content: { prompt: "Explain the constraint." }
  })]);
  assert.equal(result.valid, true, engine.formatIssues(result.issues));
});

test("unsupported unknown type still fails", function () {
  const result = validateBlocks([{
    schema: "lp.content.block",
    schemaVersion: "0.1.0",
    id: "unknown-1",
    version: "0.1.0",
    metadata: {},
    relationships: {},
    type: "not-a-real-type",
    content: { prompt: "Nope" }
  }]);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some(function (issue) {
    return issue.code === "UNSUPPORTED_BLOCK_TYPE";
  }));
});

test("drag-drop HTML fallback does not emit the answer map", function () {
  const html = engine.renderActivity(activityWithBlocks("render-dd", [dragDropBlock()]));
  assert.match(html, /data-lp-block="drag-drop"/);
  assert.match(html, /Find courses/);
  assert.match(html, /Learner/);
  assert.doesNotMatch(html, /correct":\{/);
  assert.doesNotMatch(html, /find":"learner"/);
});

test("markBlock scores a complete drag-drop placement", function () {
  const block = dragDropBlock();
  const complete = engine.markBlock(block, { find: "learner", register: "tutor" });
  assert.equal(complete.complete, true);
  assert.equal(complete.correct, true);
  const wrong = engine.markBlock(block, { find: "tutor", register: "learner" });
  assert.equal(wrong.complete, true);
  assert.equal(wrong.correct, false);
});

test("object correct mappings are stripped from learner packages; feedback.correct is kept", function () {
  const safe = engine.learnerSafePackage({
    type: "drag-drop",
    prompt: "Match each item",
    correct: { find: "learner" },
    feedback: { correct: "Well done", incorrect: "Try again" }
  });
  assert.equal(safe.prompt, "Match each item");
  assert.equal("correct" in safe, false);
  assert.equal(safe.feedback.correct, "Well done");
});
