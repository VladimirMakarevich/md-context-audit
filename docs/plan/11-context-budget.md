# Task 11: Context Budget

## Goal

Compute per-entrypoint eager context totals and report `llm/context-budget` findings.

## Dependencies

- Task 10: LLM Eager Imports

## Implementation

- Define `EntrypointBudget`:
  - `entrypoint`;
  - `ownBytes`;
  - `ownEstimatedTokens`;
  - `importedFiles`;
  - `totalBytes`;
  - `totalEstimatedTokens`;
  - `maxTokens`;
  - `overLimit`;
  - `cycles`;
  - `missingImports`.
- Use the same token estimator from Task 07.
- Counting rules:
  - include entrypoint text once;
  - include each imported file once per entrypoint budget, even if reachable through multiple paths;
  - do not include missing files;
  - stop recursion at already visited files and report cycles from Task 10.
- Config:
  - use `config.llm.maxTokensPerEntrypoint` as default max;
  - if per-pattern limits are added later, keep current field as fallback.
- Finding behavior:
  - when `totalEstimatedTokens > maxTokens`, emit `llm/context-budget` warning;
  - message includes total tokens, max tokens, and percentage over limit.
- Include budgets in JSON report.

## Acceptance Criteria

- Every configured entrypoint that exists has a budget record.
- Missing entrypoint files are not findings by default; absent patterns are allowed.
- Duplicate imports are counted once per entrypoint.
- Cycles do not inflate totals.
- Budget findings are deterministic and sorted by entrypoint.

## Tests

- Entrypoint without imports.
- Entrypoint with one import.
- Entrypoint with transitive imports.
- Duplicate import counted once.
- Import cycle does not loop or double-count.
- Over-budget entrypoint produces warning.
- Under-budget entrypoint produces no finding.

## Notes

- Use token estimate consistently across size and context rules.
- JSON budget records should include enough detail for later visualization.
