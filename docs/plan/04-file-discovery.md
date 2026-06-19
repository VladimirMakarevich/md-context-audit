# Task 04: File Discovery

## Goal

Discover Markdown files under the target root using include and exclude globs, then return normalized file metadata.

## Dependencies

- Task 03: Config Loading

## Implementation

- Define `MarkdownFile`:
  - `path`: normalized repository-relative POSIX path;
  - `absolutePath`: absolute path for reading;
  - `bytes`: file size in bytes;
  - `text`: optional field only when loaded by later stages, not required from discovery.
- Add a discovery module that:
  - resolves the scan root to an absolute path;
  - applies `include` globs;
  - applies `exclude` globs;
  - only returns regular files;
  - normalizes all relative paths to POSIX separators;
  - sorts files by normalized path.
- Handle symlinks conservatively:
  - include symlinked files only if the resolved target is still inside the scan root;
  - skip symlinked directories in v1.
- Provide a helper for matching config glob patterns against normalized paths.

## Acceptance Criteria

- Discovery returns deterministic ordering.
- Paths never contain backslashes, even on Windows.
- Excluded folders are not traversed when the glob library supports pruning.
- Missing root path is reported as a usage/config error.
- Empty result is valid and produces an empty scan, not a crash.

## Tests

- Includes all `**/*.md` files by default.
- Excludes `node_modules`, `dist`, and `.git`.
- Honors custom include and exclude arrays.
- Normalizes nested paths.
- Skips non-Markdown files.
- Handles empty repository fixture.

## Notes

- Use `fast-glob` or an equivalent well-maintained glob library.
- Do not parse Markdown in this task.
