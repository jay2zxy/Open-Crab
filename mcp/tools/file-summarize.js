import { readFile } from "node:fs/promises";
import { askLLM } from "../llm.js";

export const schema = {
  name: "file_summarize",
  description: "Preferred tool for summarizing files. Reads a file and returns a structured summary (purpose, key functions, patterns) via a fast local model. Supports optional focus areas like 'exports', 'error handling', or 'dependencies'.",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Absolute path to the file" },
      max_lines: { type: "number", description: "Max lines to read (default: 500)", default: 500 },
      focus: { type: "string", description: "Optional focus area, e.g. 'exports', 'error handling', 'dependencies'" },
    },
    required: ["path"],
  },
};

export async function handler({ path, max_lines = 500, focus }) {
  const raw = await readFile(path, "utf-8");
  const lines = raw.split("\n");
  const content = lines.slice(0, max_lines).join("\n");
  const truncated = lines.length > max_lines;

  let prompt = `Summarize this file concisely. Include: purpose, key exports/functions, and notable patterns.\n\nFile: ${path}\n`;
  if (truncated) prompt += `(Showing first ${max_lines} of ${lines.length} lines)\n`;
  if (focus) prompt += `Focus on: ${focus}\n`;
  prompt += `\n---\n${content}\n---\n\nSummary:`;

  const summary = await askLLM(prompt);
  return {
    content: [{ type: "text", text: summary }],
  };
}
