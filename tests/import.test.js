const assert = require("node:assert/strict");
const test = require("node:test");
const engine = require("../dist/learning-platform-content.cjs.js");

function envelope(schema, id, metadata, relationships) {
  return {
    schema: schema,
    schemaVersion: engine.SCHEMA_VERSION,
    id: id,
    version: engine.SCHEMA_VERSION,
    metadata: metadata,
    relationships: relationships
  };
}

const hub = envelope(engine.SCHEMAS.HUB, "demo-hub", { name: "Demo Hub" }, { curriculum: "demo-curriculum" });
const curriculum = envelope(engine.SCHEMAS.CURRICULUM, "demo-curriculum", { title: "Demo", course: "demo-course" }, {
  learningOutcomes: [],
  assignments: [],
  weeks: []
});

test("importJson accepts a canonical package", function () {
  const pkg = engine.importJson({
    hub: hub,
    curriculum: curriculum,
    activities: [{
      schema: engine.SCHEMAS.ACTIVITY,
      schemaVersion: engine.SCHEMA_VERSION,
      id: "json-activity",
      version: engine.SCHEMA_VERSION,
      metadata: { title: "JSON activity", status: "available" },
      relationships: {},
      blocks: [engine.normaliseBlock({ id: "h1", type: "heading", content: { text: "From JSON" } })]
    }]
  });
  assert.equal(pkg.activities[0].id, "json-activity");
  assert.equal(engine.validatePackage(pkg).valid, true, engine.formatIssues(engine.validatePackage(pkg).issues));
});

test("importExcel accepts parsed sheet objects", function () {
  const pkg = engine.importExcel({
    hub: hub,
    curriculum: curriculum,
    Activities: [{ id: "sheet-activity", title: "Sheet activity", status: "available" }],
    Blocks: [{ activityId: "sheet-activity", id: "h1", type: "heading", text: "From sheets" }]
  });
  assert.equal(pkg.activities[0].id, "sheet-activity");
  assert.match(engine.renderActivity(pkg.activities[0]), /From sheets/);
});

test("importExcel accepts CSV sheet text", function () {
  const pkg = engine.importExcel({
    Activities: "id,title,status\ncsv-activity,CSV activity,available\n",
    Blocks: "activityId,id,type,text\ncsv-activity,h1,heading,From CSV\n"
  }, hub, curriculum);
  assert.equal(pkg.activities[0].id, "csv-activity");
  assert.match(engine.renderActivity(pkg.activities[0]), /From CSV/);
});
