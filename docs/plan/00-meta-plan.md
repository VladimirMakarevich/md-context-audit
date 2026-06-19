# Meta Plan: md-context-audit v1

## Goal

Build a TypeScript CLI for auditing Markdown context in repositories. The v1 product focuses on local, deterministic checks that are useful for LLM/agent context hygiene:

- discover Markdown files;
- parse links and headings;
- validate local file and anchor links;
- build a file dependency graph;
- report size, orphan docs, cycles, eager imports, and context budgets;
- emit stable text and JSON reports;
- support CI-friendly exit codes.

## V1 Scope

Included:

- TypeScript CLI targeting Node.js 24.17.0 LTS.
- `md-context-audit scan [path]`.
- `md-context-audit graph [path] --out graph.json`.
- Config files: `md-context-audit.config.json`, `.cjs`, `.mjs`.
- Local Markdown links and anchors.
- Graph edges for Markdown file-to-file links.
- Size checks with glob overrides.
- Orphan docs and dependency cycles.
- Configurable orphan doc severity: `error`, `warning`, or `off`, defaulting to `error` for `scan`.
- LLM entrypoints, `@path/to/file.md` imports, recursive import tree, and context budget checks.
- Text and JSON reports.
- `--fail-on error|warning|off`.

Excluded from v1:

- HTTP checking for external links.
- External link cache.
- Runtime loading of `.ts` config.
- Full `structure.requiredSections` enforcement.
- Visualization UI.
- Watch mode.

## Architecture

Use small modules with explicit data handoff:

1. CLI parses command, options, and root path.
2. Config loader resolves defaults plus user config.
3. File discovery returns normalized Markdown file records.
4. Markdown parser extracts links and headings for each file.
5. Rule modules produce `Finding[]`.
6. Graph builder produces a deterministic dependency graph.
7. LLM budget modules compute import trees and entrypoint totals.
8. Reporter renders text or stable JSON.
9. CLI maps findings to process exit code.

Core types:

- `AuditConfig`
- `Finding`
- `FindingSeverity`
- `MarkdownFile`
- `MarkdownLink`
- `AnchorIndex`
- `DependencyGraph`
- `EntrypointBudget`

## Task Order

Implement tasks in numeric order. Each task should be small enough for a single focused commit or PR.

| Order | Task | Depends on |
| --- | --- | --- |
| 01 | Project scaffold | none |
| 02 | CLI shell | 01 |
| 03 | Config loading | 01, 02 |
| 04 | File discovery | 03 |
| 05 | Markdown parsing | 04 |
| 06 | Local link rule | 05 |
| 07 | Size rule | 03, 04 |
| 08 | Graph model | 05 |
| 09 | Structure rules | 08 |
| 10 | LLM imports | 03, 05 |
| 11 | Context budget | 10 |
| 12 | Reporting | 06, 07, 09, 11 |
| 13 | Fail-on | 12 |
| 14 | Fixtures and tests | all behavior tasks |
| 15 | README and release | all implementation tasks |
| 16 | npm publishing setup | 15 |

## Shared Task Format

Every task file uses:

- Goal
- Dependencies
- Implementation
- Acceptance Criteria
- Tests
- Notes

## Public CLI Contract

```bash
md-context-audit scan [path] [options]
md-context-audit graph [path] --out graph.json
```

`scan` options:

- `--config <file>`
- `--format text|json`
- `--fail-on error|warning|off`

`graph` options:

- `--config <file>`
- `--out <file>`

Defaults:

- `path`: current working directory.
- `format`: `text`.
- `fail-on`: `error`.
- `node`: `24.17.0` for local development and CI.
- `structure.orphanDocs`: `error`.
- `include`: `["**/*.md"]`.
- `exclude`: `["node_modules/**", "dist/**", ".git/**"]`.

## JSON Report Contract

The v1 JSON report must be stable and deterministic:

```ts
type AuditJsonReport = {
  summary: {
    root: string;
    files: number;
    findings: { error: number; warning: number; info: number };
  };
  findings: Finding[];
  files: MarkdownFile[];
  graph: DependencyGraph;
  budgets: EntrypointBudget[];
};
```

Sort all arrays by normalized path, then rule id, then message where relevant.

## Definition Of Done

V1 is done when:

- `.nvmrc`, `.node-version`, and package `engines.node` agree on Node.js 24 LTS.
- npm package metadata, package contents, and publishing workflow are documented and dry-run tested.
- `scan` reports all v1 rules in text and JSON.
- `graph --out` writes deterministic JSON.
- config defaults and overrides are covered by tests.
- local links and anchors are validated against fixtures.
- orphan docs, cycles, eager imports, and context budgets are covered by fixtures.
- default orphan docs produce error findings, while config can downgrade them to warnings or disable them.
- `--fail-on` behavior is tested at CLI level.
- README has installation, usage, config, and CI examples.
