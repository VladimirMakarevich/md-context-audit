# md-context-audit

`md-context-audit` is a planned TypeScript CLI for auditing Markdown context in repositories. It targets Node.js 24.17.0 LTS and focuses on documentation and agent-facing context files such as `README.md`, `CLAUDE.md`, `AGENTS.md`, and `skills/**/SKILL.md`.

The v1 CLI is intended to:

- scan Markdown files for size limits, broken local links, and missing anchors;
- build a directed dependency graph from Markdown file links;
- detect orphan docs and graph cycles, with orphan docs treated as errors by default;
- analyze LLM eager imports such as `@path/to/file.md`;
- estimate per-entrypoint context budgets;
- emit human-readable and JSON reports for local use and CI.

Planned commands:

```bash
md-context-audit scan [path] --format text|json --fail-on error|warning|off
md-context-audit graph [path] --out graph.json
```

See [PLAN.md](PLAN.md) for the product idea and [docs/plan/00-meta-plan.md](docs/plan/00-meta-plan.md) for the implementation plan.

After the package is published to npm, the intended install paths are:

```bash
npm install --global md-context-audit
npx md-context-audit scan .
```

The publishing setup is tracked separately in [docs/plan/16-npm-publishing.md](docs/plan/16-npm-publishing.md).

## Runtime

Use Node.js 24.17.0 LTS for local development and CI. The repository includes `.nvmrc` and `.node-version` with that exact version.

When the package scaffold is added, `package.json` should use:

```json
{
  "engines": {
    "node": ">=24.17.0 <25"
  }
}
```
