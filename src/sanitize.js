(function (root) {
  "use strict";

  var ns = root.LearningPlatformContent = root.LearningPlatformContent || {};

  var SCRIPT = /<\s*script/i;
  var EVENT_ATTR = /\son[a-z]+\s*=/i;
  var JS_URL = /^\s*javascript:/i;

  ns.containsUnsafeMarkup = function (value) {
    return SCRIPT.test(String(value || "")) || EVENT_ATTR.test(String(value || "")) || JS_URL.test(String(value || ""));
  };

  ns.sanitizeImportedText = function (value) {
    var text = String(value == null ? "" : value);
    if (ns.containsUnsafeMarkup(text)) {
      var error = new Error("Imported content contains disallowed HTML or script.");
      error.code = "UNSAFE_CONTENT";
      throw error;
    }
    return text;
  };

  ns.sanitizeObject = function (value) {
    if (typeof value === "string") return ns.sanitizeImportedText(value);
    if (Array.isArray(value)) return value.map(ns.sanitizeObject);
    if (value && typeof value === "object") {
      var result = {};
      Object.keys(value).forEach(function (key) {
        result[key] = ns.sanitizeObject(value[key]);
      });
      return result;
    }
    return value;
  };

  ns.sanitiseContent = ns.sanitizeObject;
  ns.sanitizeContent = ns.sanitizeObject;
})(typeof globalThis !== "undefined" ? globalThis : this);
