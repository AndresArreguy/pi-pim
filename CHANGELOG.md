# Changelog

## [1.0.0] - 2026-11-16

- Initial release.
- Insert/normal modal editor built on Pi's `CustomEditor`.
- `Esc` enters normal mode; `i`/`a` return to insert.
- `j`/`k` scroll the chat transcript one line; `Ctrl+D`/`Ctrl+U` half page; `Ctrl+F`/`Ctrl+B` page; `gg`/`G` top/bottom.
- Vim-style prompt editing in normal mode: `h`/`l`, `0`/`$`, `x`.
- `NORMAL` / `INSERT` indicator on the editor border.
- Requires fullscreen mode for transcript scrolling.
