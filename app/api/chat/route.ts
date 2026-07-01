import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, model = "claude-sonnet-4-6" } = await req.json();

  const result = await streamText({
    model: anthropic(model),
    system: `Tu es Nexus, un assistant IA personnel élégant, direct et compétent.
Tu réponds de manière concise et utile, avec une touche de personnalité.
Tu peux répondre en français ou en anglais selon la langue de l'utilisateur.
Pour le code, tu utilises toujours des blocs de code avec la syntaxe appropriée.`,
    messages,
    maxTokens: 2048,
  });

  return result.toDataStreamResponse();
}
