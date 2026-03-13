# Open-Crab 🦀

Self-maintaining system toolkit for Claude Code. Set up the ecosystem and it runs itself.

## Commands

| Command | Description | Daily |
|---------|-------------|-------|
| `/daily` | Run all `daily: true` commands, output summary table, log results | - |
| `/disk-clean` | Scan current directory for large files and cleanable caches | No |
| `/security` | System security scan (ports, users, services, sensitive files) | Yes |
| `/evolve` | Self-review all commands, check scan history, fix issues | No |

## MCP Tools

Offload file understanding and content analysis to a local LLM, saving Claude API tokens.

| Tool | Description |
|------|-------------|
| `file_summarize` | Read a file and generate a summary |
| `content_qa` | Ask questions about text content |
| `file_search` | Search files and rank by relevance |
| `scan_log_analyze` | Analyze scan_log trends and patterns |
| `llm_status` | Check local LLM server status |

Supports any OpenAI-compatible backend (Ollama, LM Studio, llama.cpp, vLLM, etc.) via environment variables.

## How it works

```
/daily ──→ scans commands with `daily: true` ──→ runs them ──→ logs to scan_log.md
              │
/evolve ──→ reviews all commands ──→ reads scan_log.md
              │                         │
              ├─ fixes outdated commands │
              ├─ detects OS compatibility │
              └─ checks recurring errors  │
                                          ▼
                               self-healing loop

Claude Code ←─stdio─→ MCP Server ←─HTTP─→ Local LLM (e.g. Ollama)
                        │
                        ├─ file understanding
                        ├─ content analysis
                        └─ relevance ranking
```

## Install

```
/install Open-Crab
```

Or clone manually:

```bash
git clone https://github.com/jay2zxy/Open-Crab.git ~/.claude/plugins/Open-Crab
```

## Requirements

- Claude Code CLI
- Works on Windows / macOS / Linux
- (Optional) Local LLM server for MCP tools — install [Ollama](https://ollama.com) or any OpenAI-compatible server

### MCP Setup

MCP tools work out of the box if Ollama is running on default port. To customize:

Edit `.mcp.json` environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_BASE_URL` | `http://localhost:11434/v1` | OpenAI-compatible API endpoint |
| `LLM_MODEL` | `qwen3:8b` | Model to use |
| `LLM_API_KEY` | `no-key` | API key (if required) |

Then install MCP dependencies:

```bash
cd mcp && npm install
```

## Customization

- Add `daily: true` to any command's frontmatter to include it in daily patrol
- Add new commands to `commands/` and `/evolve` will automatically review them
- Scan logs are stored in the plugin directory (`scan_log.md`, gitignored)
