# Task 16: npm Publishing Setup

## Goal

Configure the package so `md-context-audit` can be published to npm and installed later with:

```bash
npm install --global md-context-audit
npx md-context-audit scan .
```

## Dependencies

- Task 15: README And Release Checklist

## Implementation

- Confirm package naming before the first publish:
  - prefer unscoped `md-context-audit` if the npm name is available;
  - if unavailable, switch all install docs and `package.json` to a scoped public package such as `@OWNER/md-context-audit`;
  - remember that an already-published `name@version` can never be reused.
- Complete publish-ready `package.json` metadata:
  - `name`;
  - `version`;
  - `description`;
  - `license`;
  - `repository`;
  - `homepage`;
  - `bugs`;
  - `keywords`;
  - `"type": "module"`;
  - `"bin": { "md-context-audit": "./dist/cli.js" }`;
  - `"engines": { "node": ">=24.17.0 <25" }`;
  - `"files": ["dist", "README.md", "LICENSE"]`;
  - `"publishConfig": { "registry": "https://registry.npmjs.org/", "access": "public", "provenance": true }`.
- Ensure the published CLI is executable:
  - `dist/cli.js` starts with `#!/usr/bin/env node`;
  - `npm pack --dry-run` includes `dist/cli.js`;
  - installing the packed tarball exposes the `md-context-audit` command.
- Add release scripts:
  - `prepack`: run the build;
  - `release:check`: run typecheck, tests, build, and `npm pack --dry-run`;
  - do not add a script that runs `npm publish` locally by default.
- Configure GitHub Actions publishing through npm Trusted Publishing:
  - create `.github/workflows/publish.yml`;
  - trigger on version tags such as `v*`;
  - use GitHub-hosted runners;
  - grant `permissions: { contents: "read", id-token: "write" }`;
  - use Node from `.node-version`;
  - set `registry-url: "https://registry.npmjs.org"`;
  - disable package manager caching in the release job;
  - run `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, `npm pack --dry-run`, and `npm publish`.
- Configure npmjs.com Trusted Publisher settings for the package:
  - provider: GitHub Actions;
  - organization or user: repository owner;
  - repository: this repository name;
  - workflow filename: `publish.yml`;
  - allowed action: `npm publish`;
  - environment name only if GitHub deployment environments are used.
- After Trusted Publishing is verified:
  - restrict traditional token publishing in npm package settings;
  - remove any unused npm automation tokens;
  - keep manual maintainer publishing protected by 2FA.
- Document install commands in `README.md`:
  - global install;
  - `npx` usage;
  - optional pinned install such as `npm install --global md-context-audit@x.y.z`.

Suggested workflow:

```yaml
name: Publish Package

on:
  push:
    tags:
      - "v*"

permissions:
  contents: read
  id-token: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version-file: ".node-version"
          registry-url: "https://registry.npmjs.org"
          package-manager-cache: false
      - run: npm ci
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
      - run: npm pack --dry-run
      - run: npm publish
```

## Acceptance Criteria

- `npm pack --dry-run` shows only intended package files.
- Installing the local tarball in a temp project exposes the `md-context-audit` command.
- `md-context-audit --help` works from a packed install.
- The GitHub Actions workflow uses OIDC Trusted Publishing and does not require `NPM_TOKEN`.
- npmjs.com Trusted Publisher configuration exactly matches repository owner, repository name, and `publish.yml`.
- README install commands match the final package name.

## Tests

- Run `npm run release:check`.
- Run `npm pack --dry-run`.
- Create and install the generated tarball:

```bash
TARBALL=$(npm pack --silent)
npm install --global "./$TARBALL"
md-context-audit --help
md-context-audit scan --format json .
```

- After the first real publish, verify package metadata:

```bash
npm view md-context-audit name version bin engines --json
```

- After the first real publish, verify:
  - `npm install --global md-context-audit` works;
  - `npx md-context-audit --help` works;
  - npm package page shows provenance when published from a public repository through Trusted Publishing.

## Notes

- Prefer npm Trusted Publishing over a long-lived `NPM_TOKEN`.
- Trusted Publishing currently requires a supported cloud CI provider and a recent npm/Node toolchain; Node.js 24.17.0 satisfies the Node requirement.
- npm's package docs require `name` and `version` for published packages, and the `bin` field is what makes CLI commands available after install.
- Use `npm pack --dry-run` before every release to verify package contents.
- Official references:
  - https://docs.npmjs.com/trusted-publishers/
  - https://docs.npmjs.com/cli/v11/configuring-npm/package-json/
  - https://docs.npmjs.com/cli/v11/commands/npm-publish/
