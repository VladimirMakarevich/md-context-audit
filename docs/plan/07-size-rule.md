# Task 07: Size Rule

## Goal

Implement `size/max-file-size` using byte limits and optional token estimates.

## Dependencies

- Task 03: Config Loading
- Task 04: File Discovery

## Implementation

- Add `size/max-file-size` rule.
- Use actual file byte size from discovery.
- Resolve limit per file:
  - first matching override in `config.size.overrides` wins;
  - fallback to `config.size.maxBytesDefault`.
- Add `estimateTokens(text: string): number`:
  - deterministic heuristic for v1;
  - recommended formula: `Math.ceil(text.length / 4)`;
  - keep function isolated for future tokenizer adapter.
- Rule output:
  - warning by default when `bytes > maxBytes`;
  - include actual bytes, max bytes, and percent over limit;
  - include estimated tokens when text is available in scan pipeline.
- Add config severity support only if already present in the agreed type. Otherwise keep severity fixed to warning in v1.

## Acceptance Criteria

- Files under limit produce no finding.
- Files over default limit produce a warning.
- Glob overrides change the effective limit.
- Token estimate is deterministic and covered by tests.
- Rule does not read files itself unless the pipeline has not already loaded text.

## Tests

- Default limit pass.
- Default limit fail.
- Override for `CLAUDE.md`.
- Override for `skills/**/SKILL.md`.
- First matching override wins.
- Token estimate for empty, short, and long text.

## Notes

- Byte size is the enforcement source of truth in v1.
- Token estimate is advisory until a real tokenizer adapter is introduced.
