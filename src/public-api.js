(function (root) {
  "use strict";

  var ns = root.LearningPlatformContent = root.LearningPlatformContent || {};

  ns.importJson = ns.importJSON;

  ns.importExcel = function (input, hub, curriculum) {
    if (!input || typeof input !== "object") {
      throw new Error("Unsupported Excel import shape");
    }
    var keys = Object.keys(input);
    if (keys.length && keys.every(function (key) { return typeof input[key] === "string"; })) {
      return ns.importFromCsvSheets(input, hub, curriculum);
    }
    return ns.importFromSheets(input);
  };

  ns.supportedSchemas = Object.freeze(Object.keys(ns.SCHEMAS).map(function (key) {
    return ns.SCHEMAS[key];
  }));

  ns.supportedVersions = ns.SUPPORTED_SCHEMA_VERSIONS;

  ns.BlockRegistry = Object.freeze({
    get types() {
      return ns.BLOCK_TYPES;
    },
    get: ns.getBlockType,
    isRegistered: ns.isRegisteredBlockType,
    isInteractive: ns.isInteractiveBlockType,
    register: ns.registerBlockType,
    normalise: ns.normaliseBlockType
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
