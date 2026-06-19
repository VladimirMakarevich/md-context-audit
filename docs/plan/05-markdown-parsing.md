# Task 05: Markdown Parsing

## Goal

Parse Markdown files into links, headings, and anchor slugs needed by link validation and graph construction.

## Dependencies

- Task 04: File Discovery

## Implementation

- Define `MarkdownLink`:
  - `sourcePath`;
  - `rawTarget`;
  - `kind`: `local-file`, `same-file-anchor`, `external`, `mailto`, `other`;
  - `targetPath` when resolvable as a local file;
  - `anchor` when a fragment is present;
  - `line` and `column` when available.
- Define `AnchorIndex`:
  - map normalized file path to available heading slugs;
  - include duplicate GitHub slug behavior such as `heading`, `heading-1`, `heading-2`.
- Parse:
  - inline links: `[text](target)`;
  - reference-style links if supported by the parser;
  - image links as links for existence checks only when they point to `.md`;
  - headings `#`, `##`, and deeper.
- Implement GitHub-style slug generation:
  - lowercase;
  - trim;
  - spaces become `-`;
  - remove punctuation that GitHub ignores;
  - preserve non-Latin letters;
  - append numeric suffix for duplicates in the same file.
- Ignore links inside fenced code blocks.
- Preserve URL decoding behavior consistently:
  - decode path segments for filesystem lookup;
  - keep raw target in findings.

## Acceptance Criteria

- Parser returns deterministic links and anchors for every discovered Markdown file.
- Same-file anchors and `file.md#anchor` targets are represented distinctly.
- External URLs are classified but not checked in v1.
- Parser does not use ad hoc regex as the primary Markdown parser.

## Tests

- Extract inline local links.
- Extract same-file anchors.
- Extract cross-file anchors.
- Ignore fenced code block links.
- Generate duplicate heading slugs.
- Preserve Cyrillic or other non-Latin heading text in slugs.
- Classify `https:`, `mailto:`, and unsupported schemes.

## Notes

- `remark` with `mdast-util` packages is a good fit if it gives reliable positions.
- If parser positions are missing for a link form, use line-only positions rather than inventing exact columns.
