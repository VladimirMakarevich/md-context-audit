# P6.03 · Interactive prompts + `--yes`

> Phase: [P6 — init](index.md) · Roadmap: [v2 Index](../Index.md) · Size **M** · Status **Not started**.

## Goal

Drive the init flow interactively (and non-interactively for CI), confirming the inferred
config before writing.

## Sequence

- **Previous:** [P6.02 — Rule inference](02-rule-inference.md) (draft rule set + rationale).
- **Next:** [P6.04 — Config writer](04-config-writer-schema.md).
- **Depends on:** P6.02 + `@inquirer/prompts` (P0.05) · **Blocks:** P6.04.

## Deliverables / steps

1. Prompts (via `@inquirer/prompts`, [D5](../Index.md)): language, include patterns
   (pre-filled from clusters), rule categories (pre-checked from inference), and confirmation
   of the draft with per-rule rationale.
2. `--yes` non-interactive mode: accept the inferred draft without prompts (for CI / the
   `-init` skill orchestration).
3. Handle existing config: overwrite / merge / skip.
4. Ctrl+C exits gracefully with code 0.

## Decisions applied

- [D5](../Index.md) inquirer · [I2](../requirements/06-installation.md) confirm-with-rationale.

## Exit criteria

- [ ] Interactive flow works; `--yes` produces the same config without prompts.
- [ ] Existing-config handling + graceful Ctrl+C verified.

## Hand-off to next

P6.04 serializes the confirmed selections into `md-context-audit.config.json` and wires the
local schema.
