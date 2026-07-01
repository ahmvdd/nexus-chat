"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import WelcomeScreen from "@/components/WelcomeScreen";
import MessageBubble, { TypingIndicator } from "@/components/MessageBubble";
import InputArea from "@/components/InputArea";
import { Conversation, Message, Model } from "@/types";
import { generateId, getConversationTitle } from "@/lib/utils";

const SYSTEM_PROMPT = `Tu es Nexus, un assistant IA personnel élégant, direct et compétent.
Tu réponds de manière concise et utile, avec une touche de personnalité.
Tu peux répondre en français ou en anglais selon la langue de l'utilisateur.
Pour le code, tu utilises toujours des blocs de code avec la syntaxe appropriée.`;

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [model, setModel] = useState<Model>("llama3.2");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: generateId(), role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    if (newMessages.length === 1) {
      const title = getConversationTitle(userMsg.content);
      const id = generateId();
      setCurrentId(id);
      setConversations((prev) => [{ id, title, messages: [], createdAt: new Date() }, ...prev]);
    }

    const assistantId = generateId();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      abortRef.current = new AbortController();
      const res = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model,
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n").filter(Boolean);
        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              full += json.message.content;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: full } : m))
              );
            }
          } catch {}
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: "Erreur : Ollama ne répond pas. Vérifie qu'il tourne." } : m
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, model, isLoading]);

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setCurrentId(null);
  };

  const handleSelectConv = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setCurrentId(id);
      setMessages(conv.messages);
    }
  };

  const handleSuggestion = (prompt: string) => {
    setInput(prompt);
  };

  const currentTitle =
    conversations.find((c) => c.id === currentId)?.title ?? "New conversation";

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar
        conversations={conversations}
        currentId={currentId}
        model={model}
        onNewChat={handleNewChat}
        onSelectConv={handleSelectConv}
        onModelChange={setModel}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-[#222] flex items-center flex-shrink-0 bg-black">
          <span className="text-[12px] font-mono text-[#555] uppercase tracking-widest">{currentTitle}</span>
          <span className="ml-auto text-[11px] text-[#333] font-mono">
            {messages.length > 0 ? `${messages.length} msgs` : "prêt"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestion={handleSuggestion} />
          ) : (
            <div className="py-8 flex flex-col gap-0">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {isLoading && messages[messages.length - 1]?.content === "" && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <InputArea
          value={input}
          onChange={setInput}
          onSubmit={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
