# Open-Crab

自维护系统工具插件 for Claude Code。

## 架构

```
Open-Crab/
├── .claude-plugin/plugin.json   # 插件元信息
├── .mcp.json                    # MCP Server 配置（npx open-crab）
├── commands/                    # slash commands
│   ├── daily.md                 # 巡检调度器
│   ├── disk-clean.md            # 当前目录清理
│   ├── security.md              # 安全扫描
│   └── evolve.md                # 插件自维护
└── mcp/                         # MCP Server（发布为 npm: open-crab）
    ├── server.js                # 主入口，注册工具
    ├── llm.js                   # OpenAI 兼容 LLM 客户端
    └── tools/                   # 5 个工具
```

## MCP 工具使用规则

当 open-crab-llm MCP 工具可用时，优先使用本地 LLM 处理以下场景：
- **理解文件内容** → 用 `file_summarize` 而非直接读取全文
- **对文本/代码/日志提问** → 用 `content_qa` 而非自行分析
- **查找相关文件** → 用 `file_search` 做语义搜索，再用内置工具精确定位
- **分析巡检日志** → 用 `scan_log_analyze`

例外情况，回退到内置工具（Read/Grep/Glob）：
- MCP 工具不可用或返回错误时
- 用户明确要求"你来分析"、"用 Claude 看"等指令时

## 注意事项
- commands 里不要写死用户路径，保持通用
- scan_log.md 统一存放在 `~/.claude/scan_log.md`，是用户本地数据
- LLM 后端通过环境变量配置：`LLM_BASE_URL`、`LLM_MODEL`、`LLM_API_KEY`（可选）
- LLM 离线时工具返回友好错误，不能让 MCP Server 崩溃
