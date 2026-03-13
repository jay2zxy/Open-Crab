# Open-Crab 开发日志

## 2026-03-13 MCP Server 初始化 (`9ad94ab`)

### 进度
- [x] 创建目录结构 `mcp/`, `mcp/tools/`
- [x] npm init + 安装 `@modelcontextprotocol/sdk`, `zod`（22MB）
- [x] 实现 `llm.js` — OpenAI 兼容 LLM 客户端（替代原 ollama.js）
- [x] 实现 `server.js` — MCP Server 主入口，注册所有工具
- [x] 实现 4 个工具：`file_summarize`, `content_qa`, `file_search`, `scan_log_analyze`
- [x] 额外加了 `llm_status` 健康检查工具
- [x] 配置 `.mcp.json`
- [x] 更新 `CLAUDE.md` 和 `.gitignore`
- [x] 测试验证 MCP Server 启动（initialize + tools/list + file_summarize 均通过）
- [x] 全部 5 个工具测试通过：llm_status, file_summarize, content_qa, scan_log_analyze, file_search
- [ ] Commands 集成（引导 Claude 使用 MCP 工具）

### 决策记录
- **ollama.js → llm.js**：不绑死 Ollama，改用 OpenAI 兼容 API（`/v1/chat/completions`），支持 Ollama / LM Studio / llama.cpp 等后端，只需改 `LLM_BASE_URL` 环境变量
- **项目位置**：MCP 集成到现有插件，不单独建项目
- **plan 位置**：从 `~/.claude/plans/` 搬到项目内 `plan.md`

### 问题记录
（暂无）
