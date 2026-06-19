# Task 09: Structure Rules

## Goal

Implement graph-based structure checks for orphan docs and cycles.

## Dependencies

- Task 08: Graph Model

## Implementation

- Add `structure/orphan-docs`:
  - a file is orphaned when it has no incoming edges;
  - exempt configured entrypoints and root docs;
  - default exemptions include `README.md`, `index.md`, `CLAUDE.md`, `AGENTS.md`, and `skills/**/SKILL.md`;
  - read `config.structure.orphanDocs` as `error`, `warning`, or `off`;
  - default to `error` so `md-context-audit scan` fails with default `--fail-on error` when a non-exempt Markdown file has no incoming links;
  - when configured as `warning`, emit warnings instead of errors;
  - when configured as `off`, skip orphan-doc findings entirely;
  - message recommends linking from an index, deleting, or marking standalone in a future version.
- Add `graph/dependencies` cycle reporting:
  - find strongly connected components with size greater than 1;
  - emit warning for each component;
  - message includes a deterministic cycle path.
- Provide pure graph algorithms:
  - incoming edge count;
  - Tarjan or equivalent SCC detection;
  - deterministic path rendering.
- Do not implement `@standalone` suppression in v1 unless it already exists in config before this task starts.

## Acceptance Criteria

- Orphan docs are detected from the dependency graph.
- Orphan docs are error findings by default.
- `structure.orphanDocs: "warning"` downgrades orphan findings to warnings.
- `structure.orphanDocs: "off"` disables orphan findings.
- Default root docs and entrypoints are exempt.
- Cycles are detected and rendered deterministically.
- Rule output is stable regardless of filesystem ordering.

## Tests

- Single orphan file.
- Single orphan file is an error by default.
- Single orphan file is a warning when configured.
- Single orphan file is ignored when disabled.
- README is exempt.
- Configured entrypoint is exempt.
- Simple two-file cycle.
- Three-file cycle.
- Acyclic graph produces no cycle findings.

## Notes

- A file with outgoing links but no incoming links is still an orphan unless exempt.
- Cycle findings should be concise; avoid one finding per edge in the same SCC.
