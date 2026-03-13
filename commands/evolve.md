# 插件自维护

审查并修复本插件自身的 commands，保持健康运转。

## 执行步骤

### 阶段一：Commands 自检
1. 定位本插件目录，列出 `commands/` 下所有 .md 文件（排除本文件）
2. 如果 MCP 工具 `file_summarize` 可用，用它让本地 LLM 审查每个 command（省 Claude token）：
   - 对每个 command 调用 `file_summarize`，focus 设为 "检查步骤是否清晰、有无冗余或过时内容、是否超 50 行"
   - 根据返回的摘要决定是否需要修改
3. 如果 MCP 不可用，回退为 **派 Agent 并行审查**：
   - 步骤是否清晰、无冗余，超 50 行则精简
   - 检测当前系统（Windows/macOS/Linux），标记不兼容的步骤
4. 需要改就直接改，不需要改就跳过

### 阶段二：执行反馈
5. 如果 MCP 工具 `scan_log_analyze` 可用，用它分析 scan_log.md：
   - query: "连续报错的 command、未解决的 ⚠️ 项、可通过修改 command 修复的问题"
6. 如果 MCP 不可用，直接读取 scan_log.md 检查：
   - 某个 command 是否连续报错或报警
   - 报错原因能否通过修改 command 修复
   - 上次 ⚠️ 项是否已解决

### 阶段三：输出
4. 输出变更摘要表格（command / 行数 / 状态 / 说明）

## 原则
- 每个 command 文件 ≤ 50 行
- 不改变原有功能意图
- 没问题的不要强行修改
