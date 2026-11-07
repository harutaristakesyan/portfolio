#!/usr/bin/env bash
# PostToolUse hook shared by Claude Code (Edit|Write) and Codex (apply_patch): format only the
# touched files with Biome, mirroring the Lefthook pre-commit step. Claude sends
# tool_input.file_path; Codex sends the patch text in tool_input.command. Always exits 0 so a
# formatter problem never interrupts the agent; Lefthook remains the gate at commit time.
files=$(node -e '
let s = "";
process.stdin.on("data", (d) => (s += d)).on("end", () => {
  try {
    const input = JSON.parse(s).tool_input ?? {};
    const paths = input.file_path
      ? [input.file_path]
      : [...String(input.command ?? "").matchAll(/^\*\*\* (?:Add File|Update File|Move to): (.+)$/gm)].map((m) => m[1]);
    process.stdout.write(paths.join("\n"));
  } catch {}
});' 2>/dev/null)
[[ -n "$files" ]] || exit 0
cwd=$PWD
root=${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}
cd "${root:-.}" || exit 0
while IFS= read -r file; do
  [[ "$file" == /* ]] || file="$cwd/$file"
  [[ -f "$file" ]] || continue
  case "$file" in
    *.js | *.mjs | *.ts | *.json | *.jsonc | *.css)
      pnpm exec biome check --write --no-errors-on-unmatched "$file" >/dev/null 2>&1
      ;;
  esac
done <<<"$files"
exit 0
