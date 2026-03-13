import { askLLM } from "../llm.js";

export const schema = {
  name: "content_qa",
  description: "Preferred tool for answering questions about text content. Pass in code snippets, logs, config, or documentation along with a question, and get a concise answer from a fast local model.",
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
