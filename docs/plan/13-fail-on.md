# Task 13: Fail-on Exit Behavior

## Goal

Implement CI-friendly process exit behavior for `scan --fail-on error|warning|off`.

## Dependencies

- Task 12: Reporting

## Implementation

- Centralize exit decision in one function:
  - `off`: always exit `0` for completed scans;
  - `warning`: exit `1` if any warning or error finding exists;
  - `error`: exit `1` only if any error finding exists.
- Keep usage/config/runtime errors separate:
  - usage error: exit `2`;
  - config error: exit `2`;
  - unexpected runtime error: exit `1` with concise stderr message.
- Ensure report output is still printed for completed scans before non-zero audit exit.
- `graph` command:
  - does not use `--fail-on`;
  - exits `0` when graph file is written;
  - exits `1` for write/runtime errors;
  - exits `2` for usage/config errors.

## Acceptance Criteria

- `--fail-on off` exits `0` even with warnings.
- `--fail-on warning` exits `1` for warnings.
- `--fail-on error` exits `0` for warnings-only reports.
- Usage errors never produce audit JSON.
- Completed scans always emit the requested report before exiting.

## Tests

- CLI integration test for each `--fail-on` mode.
- Warning-only fixture.
- Error fixture if v1 includes any error-level rule; otherwise test the decision function directly with synthetic findings.
- Invalid option exits `2`.
- Config validation error exits `2`.

## Notes

- `structure/orphan-docs` is an error by default, so a default `scan` exits non-zero when non-exempt Markdown files have no incoming links.
- Other v1 audit findings are mostly warnings. The exit policy still needs error support for future rules.
- Do not call `process.exit` inside rule or report modules.
