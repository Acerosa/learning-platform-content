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
  "browser.js"
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

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

const body = (await Promise.all(files.map((name) => readFile("src/" + name, "utf8")))).join("\n");

await writeFile("dist/learning-platform-content.iife.js", body + "\n");
await writeFile(
  "dist/learning-platform-content.cjs.js",
  body + nodeHelpers + "\nmodule.exports = globalThis.LearningPlatformContent;\n"
);
await writeFile(
  "dist/learning-platform-content.mjs",
  body + "\nexport function getLearningPlatformContent() {\n  return globalThis.LearningPlatformContent;\n}\n"
);
