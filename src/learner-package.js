(function (root) {
  "use strict";

  var ns = root.LearningPlatformContent = root.LearningPlatformContent || {};

  /**
   * Canonical learner-facing marking fields. Must stay aligned with
   * platform.strip_learner_answer_keys in learning-platform-backend.
   * Boolean `correct` and object `correct` maps are handled separately
   * (same as the SQL function). Teaching strings such as feedback.correct
   * are retained.
   */
  ns.LEARNER_ANSWER_KEY_FIELDS = Object.freeze([
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
  ]);

  var PROTECTED = Object.create(null);
  ns.LEARNER_ANSWER_KEY_FIELDS.forEach(function (key) {
    PROTECTED[key] = true;
  });

  function isProtectedKey(key, value) {
    if (PROTECTED[key]) return true;
    if (key !== "correct") return false;
    if (typeof value === "boolean") return true;
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  ns.stripLearnerAnswerKeys = function (value) {
    if (value == null) return value;
    if (Array.isArray(value)) {
      return value.map(ns.stripLearnerAnswerKeys);
    }
    if (typeof value !== "object") return value;
    var result = {};
    Object.keys(value).forEach(function (key) {
      var item = value[key];
      if (isProtectedKey(key, item)) return;
      result[key] = ns.stripLearnerAnswerKeys(item);
    });
    return result;
  };

  ns.learnerSafePackage = function (value) {
    return ns.stripLearnerAnswerKeys(value);
  };

  ns.collectLearnerAnswerKeyHits = function (value, path) {
    path = path || "$";
    var hits = [];
    if (value == null) return hits;
    if (Array.isArray(value)) {
      value.forEach(function (item, index) {
        hits = hits.concat(ns.collectLearnerAnswerKeyHits(item, path + "[" + index + "]"));
      });
      return hits;
    }
    if (typeof value !== "object") return hits;
    Object.keys(value).forEach(function (key) {
      var item = value[key];
      var child = path + "." + key;
      if (isProtectedKey(key, item)) {
        hits.push({ path: child, key: key });
        return;
      }
      hits = hits.concat(ns.collectLearnerAnswerKeyHits(item, child));
    });
    return hits;
  };

  ns.assertLearnerSafePackage = function (value) {
    var hits = ns.collectLearnerAnswerKeyHits(value);
    if (!hits.length) return value;
    var error = new Error("Learner package contains authoritative marking fields.");
    error.code = "LEARNER_UNSAFE_PACKAGE";
    error.hitCount = hits.length;
    error.keys = Array.from(new Set(hits.map(function (hit) { return hit.key; })));
    throw error;
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
