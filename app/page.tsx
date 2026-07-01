"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import Sidebar from "@/components/Sidebar";
import WelcomeScreen from "@/components/WelcomeScreen";
import MessageBubble, { TypingIndicator } from "@/components/MessageBubble";
import InputArea from "@/components/InputArea";
import { Conversation, Model } from "@/types";
import { generateId, getConversationTitle } from "@/lib/utils";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [model, setModel] = useState<Model>("claude-sonnet-4-6");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, handleSubmit, isLoading, setMessages } =
    useChat({
      api: "/api/chat",
      body: { model },
      onFinish: (message) => {
        // Update conversation in history
        setConversations((prev) =>
          prev.map((c) =>
            c.id === currentId
              ? { ...c, messages: [...c.messages, { id: message.id, role: "assistant", content: message.content }] }
              : c
          )
        );
      },
    });

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create new conv when first message is sent
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "user") {
      const title = getConversationTitle(messages[0].content);
      const newConv: Conversation = {
        id: currentId ?? generateId(),
        title,
        messages: [],
        createdAt: new Date(),
      };
      if (!currentId) {
        setCurrentId(newConv.id);
        setConversations((prev) => [newConv, ...prev]);
      } else {
        setConversations((prev) =>
          prev.map((c) => (c.id === currentId ? { ...c, title } : c))
        );
      }
    }
  }, [messages]);

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setCurrentId(null);
  };

  const handleSelectConv = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setCurrentId(id);
      setMessages(
        conv.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        }))
      );
    }
  };

  const handleSuggestion = (prompt: string) => {
    setInput(prompt);
    // Auto submit
    setTimeout(() => {
      const form = document.querySelector("form");
      if (!form) {
        // Trigger manually
        setInput(prompt);
        handleSubmit(new Event("submit") as any, { data: { prompt } });
      }
    }, 50);
  };

  const submit = () => {
    if (!input.trim() || isLoading) return;
    handleSubmit(new Event("submit") as any);
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
        {/* Topbar */}
        <div className="px-7 py-4 border-b border-white/[0.07] flex items-center gap-3 flex-shrink-0 bg-[rgba(12,12,14,0.8)] backdrop-blur-md">
          <span className="text-sm font-semibold tracking-tight">{currentTitle}</span>
          <span className="ml-auto text-[12px] text-white/30">
            {messages.length > 0
              ? `${messages.length} message${messages.length > 1 ? "s" : ""}`
              : "Prêt"}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestion={handleSuggestion} />
          ) : (
            <div className="py-8 flex flex-col gap-0">
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={{ id: m.id, role: m.role as "user" | "assistant", content: m.content }}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <InputArea
          value={input}
          onChange={setInput}
          onSubmit={submit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
