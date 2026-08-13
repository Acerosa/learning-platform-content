# Versioning

Package version, schema version and compatibility policy are independent.

Canonical repository: [Acerosa/learning-platform-content](https://github.com/Acerosa/learning-platform-content).

The first release is tagged **v0.1.0**. That tag marks package **0.1.0** and schema **0.1.0**.

## Package version

`@learning-platform/content` starts at **0.1.0**.

This is the npm/package version. It covers JavaScript API, builds and
documentation. Bump it when the public API or builds change.

## Schema version

`schemaVersion` on each `lp.content.*` document is currently **0.1.0**.

`supportedVersions` lists the schema versions this package will validate.
Unsupported versions fail with `UNSUPPORTED_VERSION`.

A package release may keep the same schema version. A schema bump does not
have to match the package version.

## Compatibility policy (`0.1.x`)

- Additive, curriculum-neutral changes may land in `0.1.x`.
- Existing Unit 14 Week 1 documents and Admin exports must keep validating.
- Do not rename envelope fields or `lp.content.*` schema ids in `0.1.x`.
- COMPAT namespace names stay until `1.0.0`.

## Deprecation policy

Mark a name deprecated in `docs/public-api.md` and CHANGELOG before removal.
Do not remove STABLE or COMPAT names in `0.1.x`. Removal waits for a later
major version after a documented replacement exists.

Hubs vendor a reviewed IIFE by versioned directory
(`vendor/learning-platform-content/0.1.0/`). Rolling forward is a hub commit,
not a live npm fetch.
