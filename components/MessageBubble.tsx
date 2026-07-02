"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "@/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export default function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("group flex gap-3 px-6 py-2 max-w-[820px] w-full mx-auto animate-in", isUser && "justify-end")}>
      {!isUser && (
        <span className="text-white/40 text-[11px] font-mono mt-1 flex-shrink-0 w-6">AI</span>
      )}

      <div className="relative max-w-[640px]">
        <div
          className={cn(
            "text-[13.5px] leading-[1.75] font-mono px-4 py-2 rounded-md backdrop-blur-sm",
            isUser
              ? "bg-black/60 text-white border border-white/20"
              : "bg-black/50 text-white/90 border border-white/10"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-nexus">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-[2px] h-[14px] bg-white/70 ml-0.5 align-middle animate-pulse" />
              )}
            </div>
          )}
        </div>

        {/* Bouton copier */}
        <button
          onClick={handleCopy}
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 border border-white/10 text-white/50 hover:text-white text-[10px] font-mono px-2 py-0.5 rounded"
        >
          {copied ? "✓" : "copy"}
        </button>
      </div>

      {isUser && (
        <span className="text-white/40 text-[11px] font-mono mt-1 flex-shrink-0 w-6">U</span>
      )}
    </div>
  );
}
