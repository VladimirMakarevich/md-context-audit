# Task 03: Config Loading

## Goal

Load, merge, and validate v1 configuration from defaults, discovered config files, or an explicit `--config` path.

## Dependencies

- Task 01: Project Scaffold
- Task 02: CLI Shell

## Implementation

- Define `AuditConfig` in `src/types.ts`.
- Add defaults:
  - `include: ["**/*.md"]`;
  - `exclude: ["node_modules/**", "dist/**", ".git/**"]`;
  - `size.maxBytesDefault: 64 * 1024`;
  - `size.overrides` for `CLAUDE.md` and `skills/**/SKILL.md`;
  - `llm.entrypoints: ["CLAUDE.md", "AGENTS.md", "skills/**/SKILL.md"]`;
  - `llm.maxTokensPerEntrypoint: 5000`;
  - `links.checkExternal: false`;
  - `links.ignorePatterns: []`;
  - `structure.orphanDocs: "error"`;
  - `structure.orphanExemptions: ["README.md", "index.md", "CLAUDE.md", "AGENTS.md", "skills/**/SKILL.md"]`.
- Support config files:
  - `md-context-audit.config.json`;
  - `md-context-audit.config.cjs`;
  - `md-context-audit.config.mjs`.
- Discovery order:
  - explicit `--config` wins;
  - otherwise search the scan root for supported names in the order above;
  - otherwise use defaults.
- Merge behavior:
  - object fields deep-merge;
  - arrays replace defaults when provided;
  - unknown top-level keys are validation errors.
- Validation behavior:
  - invalid config shape throws a usage/config error before scanning;
  - unsupported `.ts` config returns a clear error explaining it is not in v1.

## Acceptance Criteria

- A caller can load config using only a root path and optional explicit config path.
- Loaded config includes resolved absolute config file path when present.
- Validation errors are formatted for CLI output.
- No file discovery or audit rule depends on raw unvalidated config.

## Tests

- Defaults load without a config file.
- Explicit config path overrides discovery.
- `.json`, `.cjs`, and `.mjs` configs load.
- Array replacement is tested.
- Deep object merge is tested.
- Unknown key and invalid type produce config errors.
- `structure.orphanDocs` accepts only `error`, `warning`, or `off`.
- Explicit missing config file produces a config error.

## Notes

- Keep config loading side effects limited to reading the config file.
- Avoid TypeScript runtime transpilation in v1.
