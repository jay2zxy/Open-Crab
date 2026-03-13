import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { askLLM } from "../llm.js";

export const schema = {
  name: "file_search",
  description: "Search files in a directory and use local LLM to judge relevance. Returns files ranked by relevance to your criteria.",
  inputSchema: {
    type: "object",
    properties: {
      directory: { type: "string", description: "Absolute path to search directory" },
      pattern: { type: "string", description: "Glob-like pattern to filter files, e.g. '*.js', '*.md'" },
      criteria: { type: "string", description: "What you're looking for, in natural language" },
      max_files: { type: "number", description: "Max files to evaluate (default: 20)", default: 20 },
    },
    required: ["directory", "criteria"],
  },
};

async function collectFiles(dir, pattern, maxFiles) {
  const results = [];
  const regex = pattern ? new RegExp(pattern.replace(/\*/g, ".*").replace(/\?/g, "."), "i") : null;

  async function walk(current) {
    if (results.length >= maxFiles) return;
    const entries = await readdir(current, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (results.length >= maxFiles) return;
      const fullPath = join(current, entry.name);
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (!regex || regex.test(entry.name)) {
        results.push(fullPath);
      }
    }
  }

  await walk(dir);
  return results;
}

export async function handler({ directory, pattern, criteria, max_files = 20 }) {
  const files = await collectFiles(directory, pattern, max_files);
  if (files.length === 0) {
    return { content: [{ type: "text", text: "No matching files found." }] };
  }

  const previews = [];
  for (const f of files) {
    const raw = await readFile(f, "utf-8").catch(() => null);
    if (!raw) continue;
    const preview = raw.split("\n").slice(0, 30).join("\n");
    previews.push(`### ${relative(directory, f)}\n${preview}`);
  }

  const prompt = `I'm searching for files related to: "${criteria}"\n\nHere are file previews from ${directory}:\n\n${previews.join("\n\n")}\n\nRank the files by relevance. For each relevant file, explain briefly why it matches. Skip irrelevant files.\n\nFormat:\n1. filename — reason\n2. filename — reason`;

  const analysis = await askLLM(prompt);
  return {
    content: [{ type: "text", text: analysis }],
  };
}
