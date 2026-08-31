# Changelog

## [0.1.2] - 2026-08-31

Learner-safe package transform so learner hub bundles exclude authoritative
marking data. Authoring source packages are unchanged. Hubs should apply the
shared Vite plugin and `check:learner-bundle` rather than maintaining a local
field list.

## [0.1.1] - 2026-08-31

Rendered activity markup no longer invents `0.1.0` when an activity version is missing. Explicit two-part versions such as `1.0` remain a metadata alias for `1.0.0`.

## [0.1.0] - 2026-08-13

Initial extract of the canonical `lp.content.*` engine: schemas, validator, block registry, loader, renderer, importers, sanitisation and a small public API. Canonical repository: `Acerosa/learning-platform-content`. No hub teaching content.
