# Task 08: Graph Model

## Goal

Build a deterministic directed graph of Markdown file dependencies and implement `graph --out`.

## Dependencies

- Task 05: Markdown Parsing

## Implementation

- Define `DependencyGraph`:
  - `nodes`: sorted list of `{ path, bytes }`;
  - `edges`: sorted list of `{ from, to, kind }`;
  - edge `kind` is `markdown-link` for v1.
- Build one node per discovered Markdown file.
- Build edge `A -> B` when file `A` links to local Markdown file `B`.
- Do not create graph edges for:
  - same-file anchors;
  - missing target files;
  - external URLs;
  - non-Markdown assets.
- Deduplicate edges by `from`, `to`, and `kind`.
- Implement `md-context-audit graph [path] --out graph.json`:
  - loads config;
  - discovers files;
  - parses Markdown;
  - builds graph;
  - writes pretty JSON with stable ordering.
- Include graph data in `scan --format json`.

## Acceptance Criteria

- Graph output is deterministic across repeated runs.
- Duplicate links do not create duplicate edges.
- Missing links do not create nodes for missing files.
- `graph --out` creates parent directories for output when needed.
- `graph --out` refuses to overwrite a directory path with a clear error.

## Tests

- Single edge from one doc to another.
- Duplicate links dedupe to one edge.
- Same-file anchor creates no edge.
- Missing local file creates no edge.
- External link creates no edge.
- JSON snapshot for a small fixture graph.

## Notes

- Keep graph construction independent of reporting.
- Use the same graph builder for `scan` and `graph`.
