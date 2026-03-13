import { readFile } from "node:fs/promises";
import { askLLM } from "../llm.js";

export const schema = {
  name: "scan_log_analyze",
  description: "Analyze scan_log.md trends and patterns using local LLM. Useful for understanding project health over time.",
  inputSchema: {
    type: "object",
    properties: {
      log_path: { type: "string", description: "Path to scan_log.md (default: ~/.claude/scan_log.md)" },
      query: { type: "string", description: "What to analyze, e.g. 'disk usage trend', 'recurring issues', 'recent changes'" },
    },
    required: ["query"],
  },
};

export async function handler({ log_path, query }) {
  const path = log_path || `${process.env.HOME || process.env.USERPROFILE}/.claude/scan_log.md`;
  const raw = await readFile(path, "utf-8");

  // If log is very long, take last 200 lines for recency
  const lines = raw.split("\n");
  const content = lines.length > 200 ? lines.slice(-200).join("\n") : raw;

  const prompt = `Analyze this scan log and answer the query.\n\nQuery: ${query}\n\nScan Log (${lines.length > 200 ? "last 200 lines" : "full"}):\n---\n${content}\n---\n\nAnalysis:`;

  const analysis = await askLLM(prompt);
  return {
    content: [{ type: "text", text: analysis }],
  };
}
