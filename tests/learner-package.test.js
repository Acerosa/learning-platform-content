const assert = require("node:assert/strict");
const test = require("node:test");
const engine = require("../dist/learning-platform-content.cjs.js");

const BACKEND_PROTECTED_FIELDS = [
  "correctOptionId",
  "correctCategoryId",
  "correctValues",
  "accepted",
  "checks",
  "modelAnswer",
  "markScheme",
  "answerKey",
  "correctAnswers",
  "correctOption",
  "correctOptions"
];

test("JS strip policy matches backend strip_learner_answer_keys field list", function () {
  assert.deepEqual([...engine.LEARNER_ANSWER_KEY_FIELDS].sort(), BACKEND_PROTECTED_FIELDS.slice().sort());
});

test("top-level correctOptionId is removed", function () {
  const safe = engine.learnerSafePackage({ id: "q1", correctOptionId: "a", prompt: "Choose" });
  assert.equal(safe.id, "q1");
  assert.equal(safe.prompt, "Choose");
  assert.equal("correctOptionId" in safe, false);
});

test("nested correctOptionId is removed", function () {
  const safe = engine.stripLearnerAnswerKeys({
    activities: [{ blocks: [{ content: { correctOptionId: "opt-2", prompt: "Q" } }] }]
  });
  assert.equal(safe.activities[0].blocks[0].content.prompt, "Q");
  assert.equal("correctOptionId" in safe.activities[0].blocks[0].content, false);
});

test("correctCategoryId is removed", function () {
  const safe = engine.learnerSafePackage({ items: [{ id: "c1", correctCategoryId: "Malware", text: "Item" }] });
  assert.equal(safe.items[0].id, "c1");
  assert.equal(safe.items[0].text, "Item");
  assert.equal("correctCategoryId" in safe.items[0], false);
});

test("correctValues is removed", function () {
  const safe = engine.learnerSafePackage({ type: "multi-field-exact", correctValues: { a: "1" }, requiredFields: ["a"] });
  assert.equal("correctValues" in safe, false);
  assert.deepEqual(safe.requiredFields, ["a"]);
});

test("answerKey, markScheme and modelAnswer are removed", function () {
  const safe = engine.learnerSafePackage({
    prompt: "Explain",
    answerKey: { points: ["x"] },
    markScheme: "1 mark",
    modelAnswer: "A model"
  });
  assert.equal(safe.prompt, "Explain");
  assert.equal("answerKey" in safe, false);
  assert.equal("markScheme" in safe, false);
  assert.equal("modelAnswer" in safe, false);
});

test("correctOptions, correctOption and correctAnswers are removed", function () {
  const safe = engine.learnerSafePackage({
    correctOptions: ["a"],
    correctOption: "a",
    correctAnswers: ["a"],
    options: [{ id: "a", label: "Alpha" }]
  });
  assert.deepEqual(safe.options, [{ id: "a", label: "Alpha" }]);
  assert.equal("correctOptions" in safe, false);
  assert.equal("correctOption" in safe, false);
  assert.equal("correctAnswers" in safe, false);
});

test("accepted and checks are removed to match backend", function () {
  const safe = engine.learnerSafePackage({
    accepted: ["print"],
    checks: { contains: "for" },
    language: "python"
  });
  assert.equal(safe.language, "python");
  assert.equal("accepted" in safe, false);
  assert.equal("checks" in safe, false);
});

test("boolean correct is removed; string correct is retained", function () {
  const safe = engine.learnerSafePackage({
    options: [
      { id: "a", label: "Yes", correct: true },
      { id: "b", label: "No", correct: false }
    ],
    note: { correct: "use this wording in teaching copy" }
  });
  assert.equal("correct" in safe.options[0], false);
  assert.equal("correct" in safe.options[1], false);
  assert.equal(safe.note.correct, "use this wording in teaching copy");
});

test("unrelated teaching metadata and requiredFields are retained", function () {
  const safe = engine.learnerSafePackage({
    schema: "lp.content.activity",
    id: "act-1",
    metadata: { title: "Lesson", difficulty: "foundation" },
    requiredFields: ["name", "date"],
    feedback: { correct: "Well done", incorrect: "Try again" }
  });
  assert.equal(safe.schema, "lp.content.activity");
  assert.equal(safe.metadata.title, "Lesson");
  assert.deepEqual(safe.requiredFields, ["name", "date"]);
  assert.equal(safe.feedback.correct, "Well done");
});

test("ordinary text containing the words correct answer is retained", function () {
  const text = "Write the correct answer in the box after you have checked your working.";
  const safe = engine.learnerSafePackage({ prompt: text, id: "q-text" });
  assert.equal(safe.prompt, text);
});

test("source/full authoring package remains unchanged", function () {
  const source = {
    id: "full",
    correctOptionId: "b",
    nested: { correctCategoryId: "text", label: "Keep" }
  };
  const snapshot = JSON.stringify(source);
  const safe = engine.learnerSafePackage(source);
  assert.equal(JSON.stringify(source), snapshot);
  assert.equal(source.correctOptionId, "b");
  assert.equal(safe.id, "full");
  assert.equal("correctOptionId" in safe, false);
  assert.equal(safe.nested.label, "Keep");
});

test("assertLearnerSafePackage rejects marking fields without dumping values", function () {
  assert.throws(function () {
    engine.assertLearnerSafePackage({ correctOptionId: "secret-value-do-not-print" });
  }, function (error) {
    return error && error.code === "LEARNER_UNSAFE_PACKAGE" && !String(error.message).includes("secret-value");
  });
  assert.equal(engine.assertLearnerSafePackage({ id: "safe", prompt: "Hello" }).id, "safe");
});
