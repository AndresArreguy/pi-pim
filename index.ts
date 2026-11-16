/**
 * Pim — nvim-style navigation in Pi.
 *
 * A modal editor for Pi. Insert mode keeps Pi's normal editing; Esc enters
 * normal mode, where j/k scroll the chat transcript and Vim-style keys edit the
 * prompt.
 *
 * - Insert mode: normal Pi editor behavior.
 * - Esc: insert -> normal.
 * - i: normal -> insert.
 * - a: normal -> insert after the cursor.
 * - j / k: scroll the chat transcript down / up one line (normal mode).
 * - Ctrl+D / Ctrl+U: half page down / up.
 * - Ctrl+F / Ctrl+B: page down / up.
 * - G: scroll to bottom. gg: scroll to top.
 * - h / l: cursor left / right (normal mode).
 * - 0 / $: line start / end (normal mode).
 * - x: delete character (normal mode).
 * - Esc in normal mode: passes through to Pi (interrupt / abort).
 *
 * Based on Pi's official examples/extensions/modal-editor.ts.
 */

import { CustomEditor, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { matchesKey, truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";

type Mode = "normal" | "insert";

export class VimEditor extends CustomEditor {
  private mode: Mode = "insert";
  private pendingG = false;

  private scrollChat(lines: number): void {
    const tui = this.tui as unknown as { scrollBy?: (lines: number) => void };
    if (typeof tui.scrollBy === "function") tui.scrollBy(lines);
  }

  private scrollToTop(): void {
    const tui = this.tui as unknown as { scrollToTop?: () => void };
    if (typeof tui.scrollToTop === "function") tui.scrollToTop();
  }

  private scrollToBottom(): void {
    const tui = this.tui as unknown as { scrollToBottom?: () => void };
    if (typeof tui.scrollToBottom === "function") tui.scrollToBottom();
  }

  private pageSize(): number {
    const rows = this.tui.terminal?.rows ?? 24;
    return Math.max(1, rows - 2);
  }

  private halfPageSize(): number {
    return Math.max(1, Math.floor(this.pageSize() / 2));
  }

  handleInput(data: string): void {
    if (matchesKey(data, "escape")) {
      this.pendingG = false;
      if (this.mode === "insert") {
        this.mode = "normal";
        return;
      }
      // In normal mode, Esc keeps Pi's interrupt behavior.
      super.handleInput(data);
      return;
    }

    if (this.mode === "insert") {
      super.handleInput(data);
      return;
    }

    // Normal mode
    if (this.pendingG) {
      this.pendingG = false;
      if (data === "g") {
        this.scrollToTop();
        return;
      }
    }
    if (data === "g") {
      this.pendingG = true;
      return;
    }
    if (data === "G") {
      this.scrollToBottom();
      return;
    }
    if (matchesKey(data, "ctrl+d")) {
      this.scrollChat(this.halfPageSize());
      return;
    }
    if (matchesKey(data, "ctrl+u")) {
      this.scrollChat(-this.halfPageSize());
      return;
    }
    if (matchesKey(data, "ctrl+f")) {
      this.scrollChat(this.pageSize());
      return;
    }
    if (matchesKey(data, "ctrl+b")) {
      this.scrollChat(-this.pageSize());
      return;
    }

    switch (data) {
      case "i":
        this.mode = "insert";
        return;
      case "a":
        this.mode = "insert";
        super.handleInput("\x1b[C"); // right
        return;
      case "k":
        this.scrollChat(-1);
        return;
      case "j":
        this.scrollChat(1);
        return;
      case "h":
        super.handleInput("\x1b[D");
        return;
      case "l":
        super.handleInput("\x1b[C");
        return;
      case "0":
        super.handleInput("\x01"); // line start
        return;
      case "$":
        super.handleInput("\x05"); // line end
        return;
      case "x":
        super.handleInput("\x1b[3~"); // delete char
        return;
      default:
        break;
    }

    // Let control sequences (Enter, Ctrl+C, ...) reach Pi. Ignore printable keys.
    if (data.length === 1 && data.charCodeAt(0) >= 32) return;
    super.handleInput(data);
  }

  render(width: number): string[] {
    const lines = super.render(width);
    if (lines.length === 0) return lines;
    const label = this.mode === "normal" ? " NORMAL " : " INSERT ";
    const last = lines.length - 1;
    if (visibleWidth(lines[last]!) >= label.length) {
      lines[last] = truncateToWidth(lines[last]!, width - label.length, "") + label;
    }
    return lines;
  }
}

export default function vimEditorExtension(pi: ExtensionAPI): void {
  pi.on("session_start", (_event, ctx) => {
    if (ctx.mode !== "tui") return;
    ctx.ui.setEditorComponent((tui, theme, keybindings) => new VimEditor(tui, theme, keybindings));
  });

  pi.on("session_shutdown", (_event, ctx) => {
    try {
      ctx.ui.setEditorComponent(undefined);
    } catch {}
  });
}
