import { ChatAnthropic } from "@langchain/anthropic";

const DEFAULT_MODEL = "claude-sonnet-5";

export function createClaudeModel() {
  const apiKey = process.env["ANTHROPIC_API_KEY"];

  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY não definida. Configure-a no arquivo .env para usar a IA."
    );
  }

  return new ChatAnthropic({
    model: process.env["CLAUDE_MODEL"] ?? DEFAULT_MODEL,
    apiKey,
  });
}
