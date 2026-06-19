# AGENTS.md

## Scope

These instructions apply to the entire repository.

## Project

`md-context-audit` is planned as a TypeScript CLI for auditing Markdown context in repositories. The v1 runtime target is Node.js 24.17.0 LTS. The v1 goal is deterministic local analysis for LLM/agent context hygiene:

- discover Markdown files;
- parse Markdown links and headings;
- validate local file links and anchors;
- build a Markdown dependency graph;
- report file size, orphan docs, graph cycles, eager imports, and context budgets;
- emit text and JSON reports;
- support CI-friendly exit codes.

## Sources Of Truth

- Product idea: `PLAN.md`.
- Implementation breakdown: `docs/plan/00-meta-plan.md`.
- Granular task files: `docs/plan/01-project-scaffold.md` through `docs/plan/16-npm-publishing.md`.

When implementing, follow the numbered task order unless the user explicitly asks for a different slice.

## V1 Boundaries

Include in v1:

- `md-context-audit scan [path] --config <file> --format text|json --fail-on error|warning|off`.
- `md-context-audit graph [path] --out graph.json`.
- Node.js 24.17.0 LTS, with future `package.json` `engines.node` set to `>=24.17.0 <25`.
- Config files: `md-context-audit.config.json`, `.cjs`, `.mjs`.
- Local Markdown file links and anchors.
- Directed file dependency graph.
- Size limits with glob overrides.
- Orphan docs and dependency cycles. Orphan docs are `error` by default and configurable through `structure.orphanDocs: "error" | "warning" | "off"`.
- `CLAUDE.md`, `AGENTS.md`, and `skills/**/SKILL.md` style LLM entrypoints.
- `@path/to/file.md` eager imports.
- Deterministic heuristic token estimates.

Do not include in v1 unless the user explicitly changes scope:

- HTTP checks for external links.
- External link cache.
- Runtime loading of TypeScript config files.
- Full `structure.requiredSections` enforcement.
- Visualization UI.
- Watch mode.

## Engineering Guidelines

- Prefer small modules with explicit data handoff between CLI, config, discovery, parsing, rules, graph, budgets, and reporting.
- Keep rule modules pure where practical: inputs in, findings out.
- Use normalized repository-relative POSIX paths in public data structures and reports.
- Keep JSON output deterministic by sorting arrays before rendering.
- Avoid ad hoc Markdown parsing when a parser library can provide correct links, headings, and positions.
- Keep token estimation isolated so a real tokenizer can replace the heuristic later.
- Do not introduce broad abstractions before the first concrete rule or pipeline needs them.

## Expected Core Types

The implementation should converge on these public/internal contracts:

- `AuditConfig`
- `Finding`
- `FindingSeverity`
- `MarkdownFile`
- `MarkdownLink`
- `AnchorIndex`
- `DependencyGraph`
- `EntrypointBudget`

## Testing

Use focused fixtures rather than this repository's real Markdown files as test data. Cover:

- config defaults and overrides;
- file discovery and path normalization;
- Markdown link and heading parsing;
- GitHub-style slug generation;
- broken local links and anchors;
- size limits;
- graph edges, orphan docs, and cycles;
- eager import traversal;
- context budget totals;
- text and JSON scan output;
- `graph --out`;
- `--fail-on error|warning|off`.

After the project scaffold exists, prefer these checks before finishing code changes:

```bash
npm run typecheck
npm test
npm run build
```

## Repository Hygiene

- Do not rewrite existing user changes unless explicitly requested.
- Keep documentation changes in `docs/plan/` when they describe implementation sequencing.
- Keep user-facing usage docs in `README.md`.
- Keep implementation details aligned with the task files; update the relevant task file if implementation decisions intentionally diverge.
