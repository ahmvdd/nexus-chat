import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "@/types";
import { cn } from "@/lib/utils";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 px-6 py-2 max-w-[820px] w-full mx-auto animate-in", isUser && "justify-end")}>
      {!isUser && (
        <span className="text-[#444] text-[11px] font-mono mt-1 flex-shrink-0 w-6">AI</span>
      )}

      <div
        className={cn(
          "max-w-[640px] text-[13.5px] leading-[1.75] font-mono",
          isUser
            ? "text-white border-l-2 border-white pl-3"
            : "text-[#ccc]"
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
        <span className="text-[#444] text-[11px] font-mono mt-1 flex-shrink-0 w-6">U</span>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 px-6 py-2 max-w-[820px] w-full mx-auto animate-in">
      <span className="text-[#444] text-[11px] font-mono mt-1 flex-shrink-0 w-6">AI</span>
      <div className="flex gap-2 items-center h-5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 h-1 bg-[#444]"
            style={{
              animation: `dot-bounce 1.2s infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
