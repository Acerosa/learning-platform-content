import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const files = [
  "constants.js",
  "block-registry.js",
  "validate.js",
  "load.js",
  "resolve.js",
  "checks.js",
  "render.js",
  "importer.js",
  "excel.js",
  "sanitize.js",
  "learner-package.js",
  "browser.js",
  "public-api.js"
];

const nodeHelpers = `
(function (root) {
  "use strict";
  var ns = root.LearningPlatformContent;
  if (!ns || ns.nodeIo) return;
  var fs, path;
  try {
    fs = require("node:fs");
    path = require("node:path");
  } catch (error) {
    return;
  }
  ns.nodeIo = function (baseDir) {
    return {
      readText: function (filePath) {
        return fs.readFileSync(filePath, "utf8");
      },
      joinPath: function (base, rel) {
        return path.join(base || baseDir, rel);
      }
    };
  };
  ns.loadPackageFromDirectory = function (directory) {
    return ns.loadPackageSync(directory, ns.nodeIo(directory));
  };
  ns.validateDirectory = function (directory) {
    var pkg = ns.loadPackageFromDirectory(directory);
    return Object.assign({ package: pkg }, ns.validatePackage(pkg));
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
`;

const esmExports = `
export function getLearningPlatformContent() {
  return globalThis.LearningPlatformContent;
}
export function validateDocument() {
  var api = getLearningPlatformContent();
  return api.validateDocument.apply(api, arguments);
}
export function validatePackage() {
  var api = getLearningPlatformContent();
  return api.validatePackage.apply(api, arguments);
}
export function renderActivity() {
  var api = getLearningPlatformContent();
  return api.renderActivity.apply(api, arguments);
}
export function renderWeek() {
  var api = getLearningPlatformContent();
  return api.renderWeek.apply(api, arguments);
}
export function renderSession() {
  var api = getLearningPlatformContent();
  return api.renderSession.apply(api, arguments);
}
export function importJson() {
  var api = getLearningPlatformContent();
  return api.importJson.apply(api, arguments);
}
export function importExcel() {
  var api = getLearningPlatformContent();
  return api.importExcel.apply(api, arguments);
}
export function sanitiseContent() {
  var api = getLearningPlatformContent();
  return api.sanitiseContent.apply(api, arguments);
}
export function stripLearnerAnswerKeys() {
  var api = getLearningPlatformContent();
  return api.stripLearnerAnswerKeys.apply(api, arguments);
}
export function learnerSafePackage() {
  var api = getLearningPlatformContent();
  return api.learnerSafePackage.apply(api, arguments);
}
export function assertLearnerSafePackage() {
  var api = getLearningPlatformContent();
  return api.assertLearnerSafePackage.apply(api, arguments);
}
export const LEARNER_ANSWER_KEY_FIELDS = getLearningPlatformContent().LEARNER_ANSWER_KEY_FIELDS;
export const BlockRegistry = getLearningPlatformContent().BlockRegistry;
export const supportedSchemas = getLearningPlatformContent().supportedSchemas;
export const supportedVersions = getLearningPlatformContent().supportedVersions;
`;

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

const body = (await Promise.all(files.map((name) => readFile("src/" + name, "utf8")))).join("\n");

await writeFile("dist/learning-platform-content.iife.js", body + "\n");
await writeFile(
  "dist/learning-platform-content.cjs.js",
  body + nodeHelpers + "\nmodule.exports = globalThis.LearningPlatformContent;\n"
);
await writeFile("dist/learning-platform-content.mjs", body + esmExports);
await writeFile("dist/learning-platform-content.esm.js", body + esmExports);
