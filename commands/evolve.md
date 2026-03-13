# 全局进化：Commands + 规则 + 知识库 + 记忆

## 执行步骤

### 阶段一：Commands 审查
1. 列出 `~/.claude/commands/` 下所有 .md 文件（排除本文件）
2. 为每个 command **派 Agent 并行审查**：
   - 步骤是否清晰、无冗余，超 50 行则精简
   - 快速验证关键路径/命令是否仍有效
   - 需要改就直接改，不需要改就跳过

### 阶段二：知识反哺 + 规则提升
3. 读取 log.md + lessons.md，检查：
   - 新知识能否改进现有 commands
   - lessons.md 中反复出现的教训 → 提升为 CLAUDE.md 全局规则
   - 已在 CLAUDE.md 中硬编码的教训 → lessons.md 中标记 `→ 已提升为规则`

### 阶段三：知识库治理
4. 扫描 log.md + lessons.md：
   - 合并重复/高度相似的条目，确保日期升序
   - log.md 超 50 条 → 早期条目移入 `~/.claude/log-archive.md`
   - lessons.md 已解决的 → 标记 `~~已解决~~`

5. 输出变更摘要

## 原则
- 每个 command 文件 ≤ 50 行
- 不改变原有功能意图
- 没问题的不要强行修改
