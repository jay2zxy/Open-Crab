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

### Commands only (no MCP)

```
/install Open-Crab
```

Or clone manually:

```bash
git clone https://github.com/jay2zxy/Open-Crab.git ~/.claude/plugins/Open-Crab
```

Commands work immediately — no extra setup needed.

### Commands + MCP Tools

1. Install a local LLM backend (pick one):
   - [Ollama](https://ollama.com) (recommended) — `ollama pull qwen3:8b`
   - [LM Studio](https://lmstudio.ai) — download a model, start server
   - Any OpenAI-compatible server (llama.cpp, vLLM, etc.)

2. Install MCP dependencies:

```bash
cd ~/.claude/plugins/Open-Crab/mcp && npm install
```

3. Test the connection:

```bash
node mcp/llm.js
```

4. If not using Ollama defaults, edit `.mcp.json` in the plugin root:

```json
{
  "env": {
    "LLM_BASE_URL": "http://localhost:1234/v1",
    "LLM_MODEL": "your-model-name"
  }
}
```

## Requirements

- Claude Code CLI
- Works on Windows / macOS / Linux
- (Optional) Node.js + local LLM server for MCP tools

### MCP Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_BASE_URL` | `http://localhost:11434/v1` | OpenAI-compatible API endpoint |
| `LLM_MODEL` | `qwen3:8b` | Model to use |
| `LLM_API_KEY` | `no-key` | API key (if required) |

## Customization

- Add `daily: true` to any command's frontmatter to include it in daily patrol
- Add new commands to `commands/` and `/evolve` will automatically review them
- Scan logs are stored in the plugin directory (`scan_log.md`, gitignored)
