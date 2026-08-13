const assert = require("node:assert/strict");
const test = require("node:test");
const engine = require("../dist/learning-platform-content.cjs.js");

function envelope(schema, id, metadata, relationships, extra) {
  return Object.assign({
    schema: schema,
    schemaVersion: engine.SCHEMA_VERSION,
    id: id,
    version: engine.SCHEMA_VERSION,
    metadata: metadata,
    relationships: relationships
  }, extra || {});
}

function samplePackage() {
  return {
    hub: envelope(engine.SCHEMAS.HUB, "demo-hub", { name: "Demo Hub" }, { curriculum: "demo-curriculum" }),
    curriculum: envelope(engine.SCHEMAS.CURRICULUM, "demo-curriculum", { title: "Demo", course: "demo-course" }, {
      learningOutcomes: [],
      assignments: [],
      weeks: []
    }),
    learningOutcomes: [],
    assignments: [],
    weeks: [],
    sessions: [],
    activities: [],
    questions: [],
    assets: []
  };
}

test("package exports the canonical 0.1.0 engine", function () {
  assert.equal(engine.SCHEMA_VERSION, "0.1.0");
  assert.deepEqual([...engine.SESSION_KINDS], ["session", "independent-study", "homework", "revision", "retrieval"]);
  assert.equal(typeof engine.validatePackage, "function");
  assert.equal(typeof engine.renderActivity, "function");
  assert.equal(typeof engine.renderSession, "function");
  assert.equal(typeof engine.importJson, "function");
  assert.equal(typeof engine.importExcel, "function");
  assert.equal(typeof engine.sanitiseContent, "function");
  assert.ok(engine.BlockRegistry.get("single-choice").implemented);
});

test("an empty canonical package validates", function () {
  const result = engine.validatePackage(samplePackage());
  assert.equal(result.valid, true, engine.formatIssues(result.issues));
});

test("unsupported schema versions are rejected", function () {
  const issues = engine.validateDocument({
    schema: engine.SCHEMAS.ACTIVITY,
    schemaVersion: "9.9.9",
    id: "x",
    version: "9.9.9",
    metadata: { title: "X", status: "planned" },
    relationships: {},
    blocks: []
  }, engine.SCHEMAS.ACTIVITY);
  assert.ok(issues.some(function (issue) { return issue.code === "UNSUPPORTED_VERSION"; }));
});

test("renderActivity emits escaped HTML for a heading block", function () {
  const activity = envelope(engine.SCHEMAS.ACTIVITY, "demo-activity", { title: "Demo activity", status: "available" }, {}, {
    blocks: [engine.normaliseBlock({ id: "h1", type: "heading", content: { text: "Hello <script>", level: 3 } })]
  });
  const html = engine.renderActivity(activity);
  assert.match(html, /Demo activity/);
  assert.match(html, /Hello &lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});

test("importJSON accepts a canonical activity package", function () {
  const activity = envelope(engine.SCHEMAS.ACTIVITY, "demo-activity", { title: "Imported activity", status: "available" }, {}, {
    blocks: [engine.normaliseBlock({ id: "h1", type: "heading", content: { text: "Imported", level: 2 } })]
  });
  const pkg = engine.importJSON({
    hub: envelope(engine.SCHEMAS.HUB, "demo-hub", { name: "Demo Hub" }, { curriculum: "demo-curriculum" }),
    curriculum: envelope(engine.SCHEMAS.CURRICULUM, "demo-curriculum", { title: "Demo", course: "demo-course" }, {
      learningOutcomes: [],
      assignments: [],
      weeks: []
    }),
    activities: [activity]
  });
  const result = engine.validatePackage(pkg);
  assert.equal(result.valid, true, engine.formatIssues(result.issues));
  assert.equal(pkg.activities[0].id, "demo-activity");
});
