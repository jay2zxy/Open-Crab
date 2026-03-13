# 日常巡检

扫描本插件 `commands/` 目录下所有 .md 文件，找到标记了 `daily: true` 的 command，依次以 quick 模式执行，最后输出汇总表格（⚠️/✅）。

## 执行步骤

1. 定位本插件目录（含 `.claude-plugin/plugin.json` 的父目录）
2. 扫描其 `commands/` 下带 `daily: true` frontmatter 的 .md 文件
3. 依次以 quick 模式执行，自动执行 read 指令
4. 输出汇总表格

## 记录

执行完毕后，将本次结果追加到 插件根目录下的 `scan_log.md`，格式：
```
## YYYY-MM-DD
- **安全**: ✅/⚠️ 摘要
```
- 如果当天已有记录则覆盖，避免重复

## 历史对比

- 如果 MCP 工具 `scan_log_analyze` 可用，用它分析上次 ⚠️ 项是否已修复（query: "上次未解决的警告项"）
- 如果 MCP 不可用，直接读取 scan_log.md 查看历史对比
