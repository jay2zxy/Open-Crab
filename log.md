# Open-Crab 开发日志

## 2026-03-13 第一阶段：MCP Server 初始化 (`9ad94ab`)

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

### 决策记录
- **ollama.js → llm.js**：不绑死 Ollama，改用 OpenAI 兼容 API（`/v1/chat/completions`），支持 Ollama / LM Studio / llama.cpp 等后端，只需改 `LLM_BASE_URL` 环境变量
- **项目位置**：MCP 集成到现有插件，不单独建项目
- **plan 位置**：从 `~/.claude/plans/` 搬到项目内 `plan.md`

---

## 2026-03-13 第二阶段：工具优化 + npm 发布

### 进度
- [x] 优化 5 个工具的 description（引导 Claude 优先选用）
- [x] npm 发布改造：server.js 加 shebang，package.json 加 bin/files/keywords
- [x] npm 发布：`open-crab@0.1.0` 已上线
- [x] .mcp.json 改用 npx 调用
- [x] npx 冒烟测试通过（initialize + tools/list）
- [x] npm token 轮换（旧 token 暴露后撤销，重新登录）
- [x] npm 发布 `open-crab@0.1.1`（手动终端发布，CLI 内 OTP 链接被掩码）
- [x] Commands 集成：daily、evolve 优先使用 MCP 工具，不可用时回退
- [x] server.js 版本号改为动态读取 package.json
- [x] CLAUDE.md 项目状态更新

### 决策记录
- **工具 description 优化**：去掉"省 API 费用"的开发者视角，改为强调工具独特能力（如语义搜索）和 "Preferred tool" 引导词，让 Claude 有明确理由选用
- **npm 分发**：插件安装后不会自动 npm install，需发布到 npm 通过 npx 调用，用户零手动操作
- **包名选择**：用 `open-crab` 而非 `open-crab-mcp`，更简洁

### 问题记录
- **npm 2FA**：npm 强制要求发布者开启 2FA，第一个 token 没勾 bypass 2FA 导致 publish 失败，第二个勾了才成功
