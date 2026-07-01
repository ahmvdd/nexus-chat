import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "@/types";
import { cn } from "@/lib/utils";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 px-7 py-1.5 max-w-[860px] w-full mx-auto animate-in", isUser && "justify-end")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a3320] to-green flex items-center justify-center text-xs flex-shrink-0 mt-1">
          ✦
        </div>
      )}

      <div
        className={cn(
          "max-w-[640px] px-4 py-3 rounded-2xl text-[14.5px] leading-[1.7]",
          isUser
            ? "bg-green/10 border border-green/18 rounded-tr-[4px] text-white/90"
            : "bg-surface border border-white/[0.07] rounded-tl-[4px] text-white/88"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose-nexus">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a1a3e] to-indigo-400 flex items-center justify-center text-[11px] font-semibold flex-shrink-0 mt-1">
          S
        </div>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 px-7 py-1.5 max-w-[860px] w-full mx-auto animate-in">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a3320] to-green flex items-center justify-center text-xs flex-shrink-0 mt-1">
        ✦
      </div>
      <div className="bg-surface border border-white/[0.07] rounded-2xl rounded-tl-[4px] px-4 py-3">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-green"
              style={{
                animation: `dot-bounce 1.2s infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
