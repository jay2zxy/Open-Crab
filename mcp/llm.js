// Generic OpenAI-compatible LLM client
// Works with: Ollama, LM Studio, llama.cpp, vLLM, LocalAI, etc.

const LLM_BASE_URL = process.env.LLM_BASE_URL || "http://localhost:11434/v1";
const LLM_MODEL = process.env.LLM_MODEL || "qwen3:8b";
const LLM_API_KEY = process.env.LLM_API_KEY || "no-key";

export async function askLLM(prompt, { model = LLM_MODEL, timeout = 60000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`LLM API error ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`LLM request timed out after ${timeout}ms`);
    }
    if (err.cause?.code === "ECONNREFUSED") {
      throw new Error(`LLM server not reachable at ${LLM_BASE_URL}. Check that your local model server is running.`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function checkLLMStatus() {
  try {
    const res = await fetch(`${LLM_BASE_URL}/models`, {
      headers: { "Authorization": `Bearer ${LLM_API_KEY}` },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { online: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    const models = data.data?.map((m) => m.id) || [];
    return { online: true, models, baseUrl: LLM_BASE_URL, defaultModel: LLM_MODEL };
  } catch {
    return { online: false, error: `Cannot reach ${LLM_BASE_URL}` };
  }
}

// Run directly: node llm.js
if (process.argv[1] && process.argv[1].endsWith("llm.js")) {
  checkLLMStatus().then((s) => {
    if (s.online) {
      console.log(`OK - ${s.baseUrl}`);
      console.log(`Models: ${s.models.join(", ")}`);
      console.log(`Default: ${s.defaultModel}`);
    } else {
      console.error(`FAIL - ${s.error}`);
      process.exit(1);
    }
  });
}
