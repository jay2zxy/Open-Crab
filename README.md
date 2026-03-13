# Open-Crab 🦀

Self-maintaining system toolkit for Claude Code. Set up the ecosystem and it runs itself.

## Commands

| Command | Description | Daily |
|---------|-------------|-------|
| `/daily` | Run all `daily: true` commands, output summary table, log to `scan_log.md` | - |
| `/disk-clean` | Scan current directory for large files and cleanable caches | No |
| `/security` | System security scan (ports, users, services, sensitive files) | Yes |
| `/evolve` | Self-review all commands, feed back lessons into rules, clean up logs | No |

## How it works

```
/daily ──→ scans commands with `daily: true` ──→ runs them ──→ logs results
              │
/evolve ──→ reviews all commands ──→ reads log.md + lessons.md
              │                         │
              ├─ fixes outdated commands │
              ├─ promotes lessons → rules│
              └─ cleans up logs          │
                                         ▼
                              self-improving loop
```

## Install

Copy this folder to `~/.claude/plugins/Open-Crab/` or clone it:

```bash
git clone <repo-url> ~/.claude/plugins/Open-Crab
```

## Requirements

- Claude Code CLI
- Works on Windows / macOS / Linux

## Customization

- Add `daily: true` to any command's frontmatter to include it in daily patrol
- Add new commands to `commands/` and `/evolve` will automatically review them
- Logs are stored in `~/.claude/scan_log.md`, `~/.claude/log.md`, `~/.claude/lessons.md`
