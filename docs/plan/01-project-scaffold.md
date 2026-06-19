# Task 01: Project Scaffold

## Goal

Create the Node.js 24.17.0 LTS TypeScript package foundation for the CLI, tests, and future npm publishing.

## Dependencies

None.

## Implementation

- Add `package.json` with:
  - package name `md-context-audit`;
  - `"type": "module"`;
  - `"engines": { "node": ">=24.17.0 <25" }`;
  - bin entry `"md-context-audit": "./dist/cli.js"`;
  - scripts: `build`, `test`, `typecheck`, `lint`, `format`, `prepack`.
- Add `tsconfig.json`:
  - `target`: `ES2022`;
  - `module`: `NodeNext`;
  - `moduleResolution`: `NodeNext`;
  - `rootDir`: `src`;
  - `outDir`: `dist`;
  - `strict`: `true`;
  - declaration output enabled.
- Add test runner configuration for Vitest.
- Add source folders:
  - `src/cli.ts`;
  - `src/config/`;
  - `src/discovery/`;
  - `src/markdown/`;
  - `src/rules/`;
  - `src/graph/`;
  - `src/report/`;
  - `src/types.ts`;
  - `test/fixtures/`.
- Add baseline tooling:
  - ESLint for TypeScript;
  - Prettier;
  - `.gitignore` entries for `dist/`, `coverage/`, `.vitest/`, and package manager cache folders.
- Keep runtime dependencies minimal. Prefer standard library for file operations and small focused libraries only where they remove real parser or glob complexity.

## Acceptance Criteria

- `node --version` matches `v24.17.0` in local development or CI setup.
- `npm run build` emits `dist/cli.js`.
- `npm run typecheck` passes.
- `npm test` runs with at least one placeholder test.
- The generated CLI file has a Node shebang after build.
- No implementation logic is added beyond a minimal executable placeholder.

## Tests

- Add a smoke test that imports the public module or a placeholder function from `src/types.ts`.
- Add a CLI build smoke check if the test setup can execute built files cheaply.

## Notes

- Use `tsx` only for development scripts if needed; the published CLI should run from compiled JavaScript.
- Do not add a runtime `.ts` config loader in this task.
