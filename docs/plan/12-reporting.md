# Task 12: Reporting

## Goal

Render scan results as human-readable text and stable JSON.

## Dependencies

- Task 06: Local Link Rule
- Task 07: Size Rule
- Task 09: Structure Rules
- Task 11: Context Budget

## Implementation

- Define an `AuditResult` object containing:
  - `summary`;
  - `findings`;
  - `files`;
  - `graph`;
  - `budgets`.
- Text report:
  - title with root path;
  - summary counts by severity;
  - file count;
  - findings grouped by severity and rule id;
  - compact graph summary: nodes, edges, orphan count, cycle count;
  - make orphan-doc severity visible because it can be `error`, `warning`, or disabled by config;
  - context budget summary for entrypoints;
  - no stack traces for expected audit findings.
- JSON report:
  - match the contract from `00-meta-plan.md`;
  - pretty-print with two spaces;
  - stable array ordering.
- Finding format:
  - `ruleId`;
  - `severity`;
  - `path`;
  - optional `line`, `column`;
  - `message`;
  - optional `details` object.
- Sorting:
  - severity order: error, warning, info;
  - then path;
  - then line;
  - then rule id;
  - then message.

## Acceptance Criteria

- `scan --format text` prints readable output to stdout.
- `scan --format json` prints valid JSON to stdout.
- Empty scans are represented cleanly.
- Output is stable enough for snapshot testing.
- Expected user/config errors go to stderr, not JSON report.

## Tests

- Text report with no findings.
- Text report with multiple severities and rules.
- JSON report schema snapshot.
- Stable sorting snapshot.
- Empty repository scan.

## Notes

- Avoid making text output too verbose. Users should see what to fix first.
- Keep JSON output comprehensive because other tools may consume it.
