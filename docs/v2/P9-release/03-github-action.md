# P9.03 · First-class GitHub Action / reusable CI workflow

> Phase: [P9 — Release](index.md) · Roadmap: [v2 Index](../Index.md) · Size **M** · Status **Not started**.

## Goal

Ship a publishable/reusable GitHub Action so consumers run `md-context-audit` in CI in one
step — a major adoption lever ([I6](../requirements/06-installation.md)).

## Sequence

- **Previous:** [P9.01 — Package metadata](01-package-metadata.md).
- **Next:** [P9.05 — Release verification](05-release-verification.md).
- **Depends on:** P9.01 · **Parallel with:** P9.02, P9.04 · **Blocks:** P9.05.

## Deliverables / steps

1. A reusable composite Action (`md-context-audit`) that installs and runs `lint` with
   configurable `--fail-on`/`--config`/`--format`, surfacing findings in CI.
2. A documented workflow snippet (`.github/workflows/md-context-audit.yml`) that the
   [`init` P6.04](../P6-init/04-config-writer-schema.md) optionally drops into a repo.
3. (Optional) SARIF output mapping from structured findings
   ([R3](../requirements/02-rules-engine.md)) so results appear in GitHub code scanning.

## Decisions applied

- [I6](../requirements/06-installation.md) first-class Action · [R3](../requirements/02-rules-engine.md)
  structured findings → SARIF.

## Exit criteria

- [ ] Reusable Action runs the linter in CI and reports findings.
- [ ] The `init`-droppable workflow references this Action.

## Hand-off to next

P9.05 includes the Action in the end-to-end launch smoke test.
