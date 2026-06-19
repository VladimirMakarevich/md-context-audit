# Task 15: README And Release Checklist

## Goal

Document how to install, configure, and use `md-context-audit` after v1 implementation.

## Dependencies

- All implementation tasks through Task 14

## Implementation

- Update `README.md` with:
  - concise product description;
  - Node.js 24.17.0 LTS runtime requirement;
  - install instructions;
  - quick start;
  - CLI reference for `scan` and `graph`;
  - config example;
  - explanation of v1 rules;
  - explanation that orphan docs are errors by default and can be configured as warnings or disabled;
  - CI example;
  - JSON output note;
  - v1 limitations.
- Include this config example:

```js
export default {
  include: ["**/*.md"],
  exclude: ["node_modules/**", "dist/**"],
  size: {
    maxBytesDefault: 64 * 1024,
    overrides: [
      { pattern: "CLAUDE.md", maxBytes: 32 * 1024 },
      { pattern: "skills/**/SKILL.md", maxBytes: 24 * 1024 },
    ],
  },
  llm: {
    entrypoints: ["CLAUDE.md", "AGENTS.md", "skills/**/SKILL.md"],
    maxTokensPerEntrypoint: 5000,
  },
  links: {
    checkExternal: false,
    ignorePatterns: [],
  },
  structure: {
    orphanDocs: "error",
    orphanExemptions: ["README.md", "index.md", "CLAUDE.md", "AGENTS.md", "skills/**/SKILL.md"],
  },
};
```

- Add release checklist:
  - `node --version` reports `v24.17.0`;
  - `npm run typecheck`;
  - `npm test`;
  - `npm run build`;
  - run CLI against this repository;
  - inspect package contents with `npm pack --dry-run`.
- Link to `docs/plan/16-npm-publishing.md` for publishing workflow setup and npm registry configuration.

## Acceptance Criteria

- A new user can run a scan using README instructions.
- README clearly states external HTTP link checks are not in v1.
- README includes examples for both text and JSON output.
- README includes a CI command using `--fail-on warning`.
- Release checklist is accurate for the actual package scripts.

## Tests

- Manually run README quick-start commands after implementation.
- Run `npm pack --dry-run` and confirm package contents match the npm publishing task.
- Validate code blocks in README during review.

## Notes

- Keep README user-facing. Detailed implementation sequencing stays in `docs/plan/`.
- Do not document `.ts` config as supported until runtime loading exists.
- Keep npm registry and CI publishing details in Task 16.
