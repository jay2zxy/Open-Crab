# Open-Crab

自维护系统工具插件 for Claude Code。

## 项目状态

### 已完成
- 插件基础架构（plugin.json + 4 个 commands）
- commands 通用化（去掉硬编码路径，适配跨平台）
- 全部 commands 测试通过（security、disk-clean、daily、evolve）
- GitHub 仓库：https://github.com/jay2zxy/Open-Crab
- 已提交到 Anthropic 官方 marketplace 审核（通过表单提交）

### 进行中
- MCP Server 开发：通过本地 LLM（OpenAI 兼容 API）处理文件理解，省 API 费用
  - 已完成：llm.js + 5 个工具 + server.js，全部测试通过
  - 待做：Commands 集成
  - 详细计划：`plan.md`

### 分支
- `master` — 稳定版
- `jay-dev` — 开发分支（主要在这里工作）

## 架构

```
Open-Crab/
├── .claude-plugin/plugin.json   # 插件元信息
├── .mcp.json                    # MCP Server 配置
├── commands/                    # slash commands
│   ├── daily.md                 # 巡检调度器
│   ├── disk-clean.md            # 当前目录清理
│   ├── security.md              # 安全扫描
│   └── evolve.md                # 插件自维护
├── mcp/                         # MCP Server
│   ├── package.json             # 依赖
│   ├── server.js                # 主入口，注册工具
│   ├── llm.js                   # OpenAI 兼容 LLM 客户端
│   └── tools/
│       ├── file-summarize.js    # 文件摘要
│       ├── content-qa.js        # 内容问答
│       ├── file-search.js       # 文件搜索+相关性
│       └── scan-analyze.js      # scan_log 分析
├── log.md                       # 开发日志/进度追踪
└── scan_log.md                  # 巡检日志（gitignored）
```

## 注意事项
- commands 里不要写死用户路径，保持通用
- scan_log.md 是用户本地数据，已 gitignore
- 本地开发用 jay-dev 分支，master 只接受合并
- `llm.js` 统一封装 LLM 调用，其他文件不直接发 HTTP 请求
- LLM 后端通过环境变量配置：`LLM_BASE_URL`、`LLM_MODEL`、`LLM_API_KEY`（可选）
- LLM 离线时工具返回友好错误，不能让 MCP Server 崩溃
