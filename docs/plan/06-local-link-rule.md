# Task 06: Local Link Rule

## Goal

Implement `links/broken-links` for local Markdown file links and anchors.

## Dependencies

- Task 05: Markdown Parsing

## Implementation

- Add a rule module with id `links/broken-links`.
- Check local links only:
  - `[x](./file.md)`;
  - `[x](../file.md)`;
  - `[x](#anchor)`;
  - `[x](file.md#anchor)`.
- External links:
  - parse and classify;
  - do not check HTTP status in v1;
  - never produce a broken-link finding solely because they are external.
- File target behavior:
  - resolve relative to source file directory;
  - normalize to repository-relative POSIX path;
  - report warning when target file does not exist;
  - only validate anchors when file exists.
- Anchor behavior:
  - same-file anchor checks source file's `AnchorIndex`;
  - cross-file anchor checks target file's `AnchorIndex`;
  - report warning when anchor does not exist.
- Finding shape:
  - `ruleId: "links/broken-links"`;
  - `severity: "warning"`;
  - source path, line, column where available;
  - message includes raw target and missing file or anchor.

## Acceptance Criteria

- Missing file links are detected.
- Missing anchors are detected.
- Valid links produce no findings.
- External URLs produce no findings in v1.
- Findings are sorted by source path, then position, then raw target.

## Tests

- Existing relative file link.
- Missing relative file link.
- Existing same-file anchor.
- Missing same-file anchor.
- Existing cross-file anchor.
- Missing cross-file anchor.
- External `https://example.com` ignored.
- Link with URL-encoded spaces resolves consistently.

## Notes

- Do not follow links outside the scan root in v1. Treat them as invalid local links and report a warning.
- Keep the rule pure: input parsed files and anchor index, output findings.
