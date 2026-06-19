# Task 02: CLI Shell

## Goal

Implement command parsing and validation for `scan` and `graph` without full audit behavior yet.

## Dependencies

- Task 01: Project Scaffold

## Implementation

- Implement `src/cli.ts` as the only executable entrypoint.
- Support:
  - `md-context-audit scan [path] --config <file> --format text|json --fail-on error|warning|off`;
  - `md-context-audit graph [path] --config <file> --out <file>`.
- Default `[path]` to `process.cwd()`.
- Validate options before invoking command handlers:
  - unknown command returns exit code `2`;
  - unknown option returns exit code `2`;
  - invalid `--format` returns exit code `2`;
  - invalid `--fail-on` returns exit code `2`;
  - `graph` without `--out` returns exit code `2`.
- Add `--help` and `--version`.
- Split parsing from execution:
  - parser returns a typed command object;
  - command handlers receive only validated input.
- Add placeholder handlers:
  - `scan` prints a short placeholder text report;
  - `graph` writes a minimal empty graph JSON only until Task 08 replaces it.

## Acceptance Criteria

- CLI behavior is deterministic and has clear error messages.
- Parser can be tested without spawning a process.
- Process exit codes are centralized and not scattered through business logic.
- No rule logic is implemented in this task.

## Tests

- Unit tests for command parsing:
  - default path;
  - explicit path;
  - valid scan options;
  - valid graph options;
  - invalid enum values;
  - missing graph `--out`.
- CLI integration smoke tests:
  - `--help`;
  - `--version`;
  - unknown command.

## Notes

- A small parser library is acceptable, but keep the public command contract explicit in tests.
- Treat parse failures as usage errors, not audit findings.
