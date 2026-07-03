"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import WelcomeScreen from "@/components/WelcomeScreen";
import MessageBubble from "@/components/MessageBubble";
import InputArea from "@/components/InputArea";
import { Conversation, Message, Model } from "@/types";
import { generateId, getConversationTitle } from "@/lib/utils";

const SYSTEM_PROMPT = `Tu es Nexus, un assistant IA personnel élégant, direct et compétent.
Tu réponds de manière concise et utile, avec une touche de personnalité.
Tu peux répondre en français ou en anglais selon la langue de l'utilisateur.
Pour le code, tu utilises toujours des blocs de code avec la syntaxe appropriée.`;

const STORAGE_KEY = "nexus-conversations";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [model, setModel] = useState<Model>("llama3.2");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [pendingVoice, setPendingVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const voiceEnabledRef = useRef(false);

  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);

  const speak = useCallback((text: string) => {
    if (!voiceEnabledRef.current || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/```[\s\S]*?```/g, "bloc de code").replace(/[#*`_]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = "fr-FR";
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Charger les conversations depuis localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setConversations(parsed.map((c: Conversation) => ({ ...c, createdAt: new Date(c.createdAt) })));
      }
    } catch {}
  }, []);

  // Sauvegarder les conversations dans localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  // Scroll automatique qui suit la génération
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-submit après transcription vocale
  useEffect(() => {
    if (pendingVoice && input.trim()) {
      setPendingVoice(false);
      sendMessage();
    }
  }, [pendingVoice, input]);

  const stopGeneration = () => {
    abortRef.current?.abort();
    setIsLoading(false);
    setStreamingId(null);
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: generateId(), role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let convId = currentId;

    if (newMessages.length === 1) {
      const title = getConversationTitle(userMsg.content);
      const id = generateId();
      convId = id;
      setCurrentId(id);
      setConversations((prev) => [{ id, title, messages: newMessages, createdAt: new Date() }, ...prev]);
    } else {
      setConversations((prev) =>
        prev.map((c) => c.id === convId ? { ...c, messages: newMessages } : c)
      );
    }

    const assistantId = generateId();
    setStreamingId(assistantId);
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

      // Sauvegarder la réponse complète
      const finalMessages = [...newMessages, { id: assistantId, role: "assistant" as const, content: full }];
      setConversations((prev) =>
        prev.map((c) => c.id === convId ? { ...c, messages: finalMessages } : c)
      );
      speak(full);
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
      setStreamingId(null);
    }
  }, [input, messages, model, isLoading, currentId]);

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
        <div className="px-6 py-4 border-b border-white/10 flex items-center flex-shrink-0 backdrop-blur-xl bg-black/30">
          <span className="text-[12px] font-mono text-white/30 uppercase tracking-widest">{currentTitle}</span>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => { setVoiceEnabled(v => !v); window.speechSynthesis?.cancel(); }}
              className={`text-[11px] font-mono px-2 py-1 border rounded-sm transition-all ${voiceEnabled ? "border-white/40 text-white/70" : "border-white/10 text-white/20 hover:text-white/40"}`}
              title={voiceEnabled ? "Désactiver la voix" : "Activer la voix"}
            >
              {voiceEnabled ? "🔊 voix on" : "🔇 voix off"}
            </button>
            <span className="text-[11px] text-white/20 font-mono">
              {messages.length > 0 ? `${messages.length} msgs` : "prêt"}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto relative">
          {/* Fond fixe */}
          <div
            className="fixed inset-0 -z-10"
            style={{
              backgroundImage: "url('/chat-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          />
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestion={handleSuggestion} />
          ) : (
            <div className="py-8 flex flex-col gap-0">
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isStreaming={m.id === streamingId}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <InputArea
          value={input}
          onChange={setInput}
          onSubmit={sendMessage}
          onStop={stopGeneration}
          onVoiceResult={(transcript) => { setInput(transcript); setPendingVoice(true); }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
