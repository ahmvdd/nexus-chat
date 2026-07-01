"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface InputAreaProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function InputArea({ value, onChange, onSubmit, isLoading }: InputAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = Math.min(ref.current.scrollHeight, 180) + "px";
    }
  }, [value]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="px-6 pb-6 pt-4 border-t border-[#222] bg-black flex-shrink-0">
      <div className={cn(
        "max-w-[800px] mx-auto border transition-all",
        value ? "border-white" : "border-[#333] focus-within:border-[#555]"
      )}>
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="> message..."
          disabled={isLoading}
          className="bg-black text-white w-full font-mono text-[13.5px] resize-none leading-relaxed min-h-[44px] max-h-[180px] overflow-y-auto placeholder:text-[#333] disabled:opacity-40 px-4 py-3 outline-none border-none"
        />
        <div className="flex items-center px-4 pb-3 gap-2">
          <span className="text-[10px] text-[#333] font-mono">
            enter ↵ envoyer · shift+enter nouvelle ligne
          </span>
          <button
            onClick={onSubmit}
            disabled={isLoading || !value.trim()}
            className="ml-auto text-[11px] font-mono uppercase tracking-widest px-3 py-1 border border-[#333] text-[#555] hover:bg-white hover:text-black hover:border-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "..." : "send"}
          </button>
        </div>
      </div>
    </div>
  );
}
