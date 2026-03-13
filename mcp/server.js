#!/usr/bin/env node
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { checkLLMStatus } from "./llm.js";
import { schema as fileSummarizeSchema, handler as fileSummarizeHandler } from "./tools/file-summarize.js";
import { schema as contentQaSchema, handler as contentQaHandler } from "./tools/content-qa.js";
import { schema as fileSearchSchema, handler as fileSearchHandler } from "./tools/file-search.js";
import { schema as scanAnalyzeSchema, handler as scanAnalyzeHandler } from "./tools/scan-analyze.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf8"));

const server = new McpServer({
  name: "open-crab-llm",
  version: pkg.version,
});

// Helper: wrap handler with LLM error handling
function wrapHandler(handler) {
  return async (args) => {
    try {
      return await handler(args);
    } catch (err) {
      return {
        content: [{ type: "text", text: `⚠ LLM error: ${err.message}` }],
        isError: true,
      };
    }
  };
}

// Convert JSON Schema properties to Zod schema
function toZodShape(properties, required = []) {
  const shape = {};
  for (const [key, prop] of Object.entries(properties)) {
    let field;
    if (prop.type === "number") {
      field = z.number().describe(prop.description || "");
    } else {
      field = z.string().describe(prop.description || "");
    }
    shape[key] = required.includes(key) ? field : field.optional();
  }
  return shape;
}

// Register tools
const tools = [
  { schema: fileSummarizeSchema, handler: fileSummarizeHandler },
  { schema: contentQaSchema, handler: contentQaHandler },
  { schema: fileSearchSchema, handler: fileSearchHandler },
  { schema: scanAnalyzeSchema, handler: scanAnalyzeHandler },
];

for (const { schema, handler } of tools) {
  const zodShape = toZodShape(schema.inputSchema.properties, schema.inputSchema.required);
  server.tool(schema.name, schema.description, zodShape, wrapHandler(handler));
}

// Bonus: llm_status tool
server.tool(
  "llm_status",
  "Check local LLM server health — returns online status, available models, and current configuration. Use this before other Open-Crab tools to verify the local model is ready.",
  {},
  async () => {
    const status = await checkLLMStatus();
    return {
      content: [{ type: "text", text: JSON.stringify(status, null, 2) }],
    };
  }
);

// Start
const transport = new StdioServerTransport();
await server.connect(transport);
