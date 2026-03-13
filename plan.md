# Open-Crab MCP Server 计划

## Context

Open-Crab 是一个 Claude Code 自维护插件，通过 MCP Server 将文件理解、内容分析等吃 token 的操作卸载到本地 LLM（OpenAI 兼容 API），Claude API 只做代码生成和决策。

## 文件结构

```
Open-Crab/
├── .claude-plugin/plugin.json   # 插件元信息
├── .mcp.json                    # MCP Server 配置
├── commands/                    # slash commands
│   ├── daily.md
│   ├── disk-clean.md
│   ├── security.md
│   └── evolve.md
├── mcp/
│   ├── package.json             # 依赖: @modelcontextprotocol/sdk, zod
│   ├── server.js                # MCP Server 主入口
│   ├── llm.js                   # OpenAI 兼容 LLM 客户端
│   └── tools/
│       ├── file-summarize.js
│       ├── content-qa.js
│       ├── file-search.js
│       └── scan-analyze.js
├── log.md                       # 开发日志
└── scan_log.md                  # 巡检日志（gitignored）
```

## .mcp.json

```json
{
  "mcpServers": {
    "open-crab-llm": {
      "command": "node",
      "args": ["mcp/server.js"],
      "env": {
        "LLM_BASE_URL": "http://localhost:11434/v1",
        "LLM_MODEL": "qwen3:8b"
      }
    }
  }
}
```

## MCP 工具

| 工具 | 用途 | 关键参数 |
|------|------|----------|
| `file_summarize` | 读文件 + LLM 生成摘要 | path, max_lines, focus |
| `content_qa` | 对文本内容提问 | content, question |
| `file_search` | 目录搜索 + LLM 判断相关性 | directory, pattern, criteria |
| `scan_log_analyze` | 分析 scan_log 趋势 | log_path, query |
| `llm_status` | 检查 LLM 服务器状态 | （无） |

## 分阶段实现

### 第一阶段：最小可用 ✅
1. 创建 `mcp/` 目录，npm init，装依赖
2. 实现 `llm.js` — OpenAI 兼容 LLM 客户端
3. 实现 `server.js` + `file_summarize`
4. 配置 `.mcp.json`

### 第二阶段：补全工具 ✅
1. 添加 `content_qa`、`file_search`、`scan_log_analyze`、`llm_status`
2. 错误处理（LLM 离线时友好提示）
3. 全部 5 个工具 stdio 测试通过

### 第三阶段：npm 发布 + npx 分发 ✅
1. `package.json` 加 `bin` 字段指向 `server.js` ✅
2. `server.js` 顶部加 `#!/usr/bin/env node` ✅
3. `npm publish` 发布到 npm（包名 `open-crab`）✅
4. `.mcp.json` 改为 npx 调用：`"command": "npx", "args": ["-y", "open-crab"]` ✅
5. 验证：npx 冒烟测试 ✅（initialize + tools/list 正常）

### 第四阶段：Commands 集成 ✅
1. daily.md、evolve.md 集成 MCP 工具（优先使用，不可用时回退）
2. scan_log.md 路径统一为 `~/.claude/scan_log.md`
3. disk-clean、security 为纯系统命令，无需集成

### 第五阶段：优化（可选）⬜
1. prompt 缓存（相同文件+问题不重复调 LLM）
2. 模型选择逻辑（简单任务用小模型）

## 关键 commit
- `9ad94ab` — MCP Server 实现 + 全部工具
- `427a47d` — README 更新

## 验证方式
1. stdio 测试：`printf JSON | node mcp/server.js`（已通过）
2. 插件集成测试：Claude Code 加载插件后调用 MCP 工具（已通过，5/5 工具正常）
3. npx 分发测试：`npx -y open-crab` ✅
