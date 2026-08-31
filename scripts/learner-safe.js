const { cpSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } = require("node:fs");
const { dirname, join } = require("node:path");
const content = require("../dist/learning-platform-content.cjs.js");

const LEARNER_ANSWER_KEY_FIELDS = content.LEARNER_ANSWER_KEY_FIELDS;
const stripLearnerAnswerKeys = content.stripLearnerAnswerKeys;
const learnerSafePackage = content.learnerSafePackage;
const collectLearnerAnswerKeyHits = content.collectLearnerAnswerKeyHits;
const assertLearnerSafePackage = content.assertLearnerSafePackage;

const QUOTED_MARKING_KEY = /"(correctOptionId|correctCategoryId|correctValues|accepted|checks|modelAnswer|markScheme|answerKey|correctAnswers|correctOption|correctOptions)"\s*:/g;

function looksLikeCurriculumJson(data) {
  if (data == null || typeof data !== "object") return false;
  if (Array.isArray(data)) return data.some(looksLikeCurriculumJson);
  const schema = data.schema;
  if (typeof schema === "string" && schema.indexOf("lp.content.") === 0) return true;
  if (data.activities || data.hub || data.curriculum || data.blocks) return true;
  if (data.relationships && (data.metadata || data.id)) return true;
  return false;
}

function writeLearnerSafeJsonFile(sourcePath, destPath) {
  const data = JSON.parse(readFileSync(sourcePath, "utf8"));
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, JSON.stringify(learnerSafePackage(data)));
}

function copyLearnerSafeTree(sourceDir, destDir) {
  mkdirSync(destDir, { recursive: true });
  for (const name of readdirSync(sourceDir)) {
    const from = join(sourceDir, name);
    const to = join(destDir, name);
    const st = statSync(from);
    if (st.isDirectory()) {
      copyLearnerSafeTree(from, to);
    } else if (name.endsWith(".json")) {
      writeLearnerSafeJsonFile(from, to);
    } else {
      cpSync(from, to);
    }
  }
}

function learnerSafeContentPlugin(options) {
  options = options || {};
  return {
    name: "learning-platform-learner-safe-json",
    enforce: "pre",
    apply: function () {
      if (options.apply === false) return false;
      if (process.env.VITEST) return false;
      return true;
    },
    transform: function (code, id) {
      const file = id.split("?")[0].replace(/\\/g, "/");
      if (id.indexOf("authoring") !== -1) return null;
      if (!file.endsWith(".json")) return null;
      if (file.indexOf("/content/") === -1) return null;
      if (file.indexOf("/node_modules/") !== -1) return null;
      var data;
      try {
        data = JSON.parse(code);
      } catch (error) {
        return null;
      }
      if (!looksLikeCurriculumJson(data)) return null;
      return {
        code: JSON.stringify(learnerSafePackage(data)),
        map: { mappings: "" }
      };
    }
  };
}

function walkFiles(directory, acc) {
  acc = acc || [];
  if (!directory) return acc;
  var entries;
  try {
    entries = readdirSync(directory);
  } catch (error) {
    return acc;
  }
  for (var i = 0; i < entries.length; i++) {
    var full = join(directory, entries[i]);
    var st = statSync(full);
    if (st.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

function inspectLearnerBundle(distDir) {
  var failures = [];
  var contentDir = join(distDir, "content");
  walkFiles(contentDir).forEach(function (file) {
    if (!file.endsWith(".json")) return;
    var data;
    try {
      data = JSON.parse(readFileSync(file, "utf8"));
    } catch (error) {
      failures.push(file + ": invalid JSON (" + error.message + ")");
      return;
    }
    try {
      assertLearnerSafePackage(data);
    } catch (error) {
      failures.push(file + ": " + (error.code || error.message));
    }
  });
  walkFiles(join(distDir, "assets")).forEach(function (file) {
    if (!/\.(js|mjs|map)$/.test(file)) return;
    var text = readFileSync(file, "utf8");
    var matches = text.match(QUOTED_MARKING_KEY);
    if (matches && matches.length) {
      failures.push(file + ": bundled marking keys (" + matches.length + ")");
    }
  });
  return failures;
}

function checkLearnerBundle(distDir) {
  var failures = inspectLearnerBundle(distDir);
  if (failures.length) {
    var error = new Error("Learner bundle contains authoritative marking data.");
    error.code = "LEARNER_UNSAFE_BUNDLE";
    error.failures = failures;
    throw error;
  }
  return { ok: true, distDir: distDir };
}

module.exports = {
  LEARNER_ANSWER_KEY_FIELDS: LEARNER_ANSWER_KEY_FIELDS,
  stripLearnerAnswerKeys: stripLearnerAnswerKeys,
  learnerSafePackage: learnerSafePackage,
  collectLearnerAnswerKeyHits: collectLearnerAnswerKeyHits,
  assertLearnerSafePackage: assertLearnerSafePackage,
  writeLearnerSafeJsonFile: writeLearnerSafeJsonFile,
  copyLearnerSafeTree: copyLearnerSafeTree,
  learnerSafeContentPlugin: learnerSafeContentPlugin,
  inspectLearnerBundle: inspectLearnerBundle,
  checkLearnerBundle: checkLearnerBundle
};
