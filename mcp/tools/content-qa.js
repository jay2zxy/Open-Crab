import { askLLM } from "../llm.js";

export const schema = {
  name: "content_qa",
  description: "Ask a question about provided text content using local LLM. Useful for analyzing code snippets, logs, or documentation without consuming Claude API tokens.",
  inputSchema: {
    type: "object",
    properties: {
      content: { type: "string", description: "The text content to analyze" },
      question: { type: "string", description: "The question to ask about the content" },
    },
    required: ["content", "question"],
  },
};

export async function handler({ content, question }) {
  const prompt = `Given the following content, answer the question concisely.\n\nContent:\n---\n${content}\n---\n\nQuestion: ${question}\n\nAnswer:`;
  const answer = await askLLM(prompt);
  return {
    content: [{ type: "text", text: answer }],
  };
}
