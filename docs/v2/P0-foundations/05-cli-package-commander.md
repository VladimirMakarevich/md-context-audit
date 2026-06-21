# P0.05 · `@md-context-audit/cli` + commander scaffold

> Phase: [P0 — Workspace & Foundations](index.md) · Roadmap: [v2 Index](../Index.md) ·
> Size **M** · Status **Not started**.

## Goal

Create the `@md-context-audit/cli` package, adopt `commander` ([D5](../Index.md)), and port
the MVP `scan` and `graph` commands onto it **with identical behavior**, importing all logic
from `@md-context-audit/core`.

## Sequence

- **Previous:** [P0.04 — Migrate MVP source into core](04-migrate-mvp-to-core.md) put the
  pipeline (config, discovery, parse, rules, graph, reporting) inside `@md-context-audit/core`
  and exported it.
- **Next:** [P0.06 — mcp-server skeleton](06-mcp-server-skeleton.md) (parallel sibling, also
  on core) and then [P0.07 — CI & packaging](07-ci-packaging-baseline.md).
- **Depends on:** P0.04 · **Can run in parallel with:** P0.06 · **Blocks:** P0.07.

## Inputs (from previous work)

- The hand-rolled arg parser and command handlers currently in `src/cli.ts`.
- Core's exported pipeline functions from P0.04.

## Deliverables / steps

1. `packages/cli/package.json`: name `@md-context-audit/cli`, bin `md-context-audit` →
   `dist/index.js`, dependency `@md-context-audit/core` (`workspace:*`) + `commander`
   (and `@inquirer/prompts` reserved for the P6 `init`).
2. Set up a `commander` program with subcommands `scan` and `graph`, mapping the existing
   options (`--config`, `--format`, `--fail-on`, `--out`) and exit-code logic 1:1 onto the
   MVP behavior. Reuse, don't reimplement, the handlers (delegate to core).
3. Relocate `src/cli.ts` logic into `packages/cli/src/`; remove the old root entry.
4. Preserve exit codes (0 success / 1 findings / 2 usage) exactly.

> **Scope note:** `lint` as the default command with `scan` as an alias ([D4](../Index.md))
> arrives **with the new rule engine** in [P2/P3](../Index.md) — its semantics depend on the
> new config + engine. P0 only ports the existing `scan`/`graph` to keep parity.

## Decisions applied

- [D5](../Index.md) commander + inquirer · [core-hosts-the-pipeline](../decisions/core-hosts-the-pipeline.md)
  CLI is a thin host over core.

## Exit criteria

- [ ] `md-context-audit scan` and `graph` produce byte-identical output to the MVP (parity).
- [ ] Exit codes unchanged.
- [ ] CLI imports only from `@md-context-audit/core` (no duplicated pipeline logic).

## Hand-off to next

P0.07 has a real bin to pack and test in CI. P2/P3 will add `lint`, `slice`, `impact`,
`compile`, `init` as new subcommands onto this commander scaffold.
