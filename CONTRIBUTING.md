# Contributing to Pim

Thanks for taking the time to contribute. Issues and pull requests can be written
in English or Spanish.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- Report a bug with the bug report template.
- Request a keymap or workflow improvement.
- Improve the docs or README translations.
- Send a focused pull request for a bug fix or feature.
- Share your setup or a GIF of your workflow.

## Before you start

- For anything non-trivial, open an issue first so we can agree on scope.
- Keep one PR focused on one change.
- Check existing issues and PRs first.
- Do not open a public issue for a security vulnerability; see
  [SECURITY.md](SECURITY.md).

## Development setup

Requirements:

- Node.js **22.6+**
- Pi **1.5.x**
- Fullscreen mode for `j/k`, `Ctrl+D/U`, `Ctrl+F/B` and `gg/G` transcript scrolling

```bash
git clone https://github.com/AndresArreguy/pi-pim.git
cd pi-pim
npm run check          # syntax check; there is no build step
pi install .           # load the local package
```

Then run `/reload` in Pi. You can also try it without installing:

```bash
pi -e ./index.ts
```

### What to test

- Insert mode behaves like the normal Pi editor.
- `Esc` enters normal mode; `i`/`a` return to insert.
- `j`/`k` scroll the chat transcript, not prompt history.
- `Ctrl+D`/`Ctrl+U`, `Ctrl+F`/`Ctrl+B`, `gg`/`G`.
- `h`/`l`, `0`/`$`, `x` edit the prompt in normal mode.
- The `NORMAL`/`INSERT` indicator on the editor border.
- Prompt history still works with `↑`/`↓` in insert mode.
- Regular mode: modal editing works, transcript scrolling is a no-op.

## Code guidelines

- TypeScript, no build step. Keep the package as Pi source.
- Extend `CustomEditor`; forward keys you do not handle to `super.handleInput`.
- Keep app shortcuts working (Ctrl+C, Ctrl+D, model cycling, paste, autocomplete).
- `j/k` and page keys must use the fullscreen TUI `scrollBy`/`scrollToTop`/
  `scrollToBottom`, not prompt history.
- Keep `@earendil-works/pi-coding-agent` and `@earendil-works/pi-tui` as peer
  dependencies.
- Avoid new runtime dependencies unless there is a clear reason.

## Commits

Use Conventional Commits:

```text
feat: add ...
fix: ...
docs: ...
test: ...
chore: ...
```

Do not bump the package version in a feature PR; maintainers handle releases.

## Pull requests

Include:

- What changed and why.
- Which keys/modes are affected.
- How you tested it (fullscreen, regular mode, platforms).
- Screenshots/GIFs for visible changes.

Checklist:

- [ ] `npm run check` passes.
- [ ] Tested in Pi fullscreen.
- [ ] Insert-mode behavior and prompt history still work.
- [ ] Docs/README updated if behavior changed.

## License

By contributing, you agree that your contributions are licensed under the MIT
license of this repository.
