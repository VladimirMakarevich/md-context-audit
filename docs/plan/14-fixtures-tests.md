# Task 14: Fixtures And Tests

## Goal

Create a focused fixture suite that proves v1 behavior end to end.

## Dependencies

- All behavior tasks through Task 13

## Implementation

- Add fixture directories under `test/fixtures/`:
  - `minimal/`;
  - `links-valid/`;
  - `links-broken/`;
  - `anchors/`;
  - `size-overrides/`;
  - `graph-cycles/`;
  - `orphans/`;
  - `orphans-warning/`;
  - `orphans-off/`;
  - `llm-imports/`;
  - `config/`.
- Each fixture should include only files needed for the scenario.
- Add helper utilities:
  - copy fixture to a temp directory;
  - run CLI against temp directory;
  - normalize absolute paths in output for snapshots;
  - parse JSON report.
- Test layers:
  - unit tests for pure functions;
  - integration tests for scan pipeline;
  - CLI tests for process behavior.
- Add coverage expectations only after the suite is stable. Do not block early implementation on arbitrary coverage thresholds.

## Acceptance Criteria

- Every v1 rule has at least one positive and one negative test.
- `scan --format json` is tested against fixture output.
- `scan --format text` has at least one snapshot or targeted string assertion.
- `graph --out` is tested against deterministic JSON.
- Tests do not depend on the repository's real Markdown files.

## Tests

- Config:
  - defaults;
  - explicit config;
  - invalid config.
- Markdown:
  - slug generation;
  - link classification.
- Rules:
  - broken links;
  - size;
  - orphan docs;
  - orphan severity config: default error, warning downgrade, and off;
  - cycles;
  - eager imports;
  - context budget.
- CLI:
  - scan text;
  - scan JSON;
  - graph output;
  - fail-on modes.

## Notes

- Prefer small fixture files with clear names over large realistic repositories.
- Snapshot only stable outputs. Avoid snapshotting timestamps or absolute temp paths.
