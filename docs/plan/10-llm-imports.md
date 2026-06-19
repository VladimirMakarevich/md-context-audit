# Task 10: LLM Eager Imports

## Goal

Implement parsing and traversal for LLM eager imports from configured entrypoint files.

## Dependencies

- Task 03: Config Loading
- Task 05: Markdown Parsing

## Implementation

- Add `llm/eager-imports` support for entrypoints from `config.llm.entrypoints`.
- Match entrypoints by normalized path against glob patterns.
- Parse import syntax:
  - `@path/to/file.md`;
  - match import tokens in normal Markdown text, not in Markdown link targets;
  - allow imports at token boundaries within paragraphs, list items, and blockquotes;
  - path is relative to the importing file's directory unless it starts with `/`, then treat as repo-root relative;
  - only `.md` imports are included in v1.
- Ignore import-like text inside fenced code blocks and inline code spans.
- Build an import tree for each entrypoint:
  - include direct and transitive imports;
  - resolve each import to a known Markdown file;
  - track missing imports as findings;
  - track cycles and prevent infinite recursion.
- Finding behavior:
  - missing import target: `llm/eager-imports`, warning;
  - import cycle: `llm/eager-imports`, warning with deterministic cycle path.
- Return structured import graph data for Task 11.

## Acceptance Criteria

- Entrypoints are discovered from config globs.
- Direct and transitive imports are resolved.
- Missing imports produce warnings.
- Cyclic imports produce warnings and traversal terminates.
- Import parsing is separate from standard Markdown link parsing.

## Tests

- Root `CLAUDE.md` imports `docs/context.md`.
- Nested import resolves relative to the importing file.
- Root-relative import resolves from scan root.
- Missing import warning.
- Two-file import cycle warning.
- Import-like text in a fenced code block is ignored.
- Import-like text in inline code is ignored.

## Notes

- Do not invent support for arbitrary agent import syntaxes in v1.
- Keep raw import text in findings so users can find the exact source.
