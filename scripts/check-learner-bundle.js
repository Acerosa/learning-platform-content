#!/usr/bin/env node
const { checkLearnerBundle } = require("./learner-safe.js");

const distDir = process.argv[2] || "dist";
try {
  checkLearnerBundle(distDir);
  console.log("check:learner-bundle PASS");
} catch (error) {
  console.error("check:learner-bundle FAILED");
  (error.failures || [error.message]).forEach(function (line) {
    console.error(" - " + line);
  });
  process.exit(1);
}
