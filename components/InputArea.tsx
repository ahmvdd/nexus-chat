"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { ArrowRight } from "lucide-react";
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
    <div className="px-7 pb-6 pt-4 border-t border-white/[0.07] bg-[rgba(12,12,14,0.9)] backdrop-blur-md flex-shrink-0">
      <div
        className={cn(
          "max-w-[800px] mx-auto bg-white/[0.05] border rounded-2xl px-4 py-3.5 transition-all",
          value
            ? "border-green/40"
            : "border-white/10 focus-within:border-green/40"
        )}
      >
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Message Nexus..."
          disabled={isLoading}
          className="bg-transparent border-none outline-none text-white w-full font-sans text-[14.5px] resize-none leading-relaxed min-h-6 max-h-[180px] overflow-y-auto placeholder:text-white/22 disabled:opacity-50"
        />
        <div className="flex items-center mt-2.5 gap-2">
          <span className="text-[11px] text-white/20">
            ⏎ Envoyer · Shift+⏎ Nouvelle ligne
          </span>
          {value.length > 0 && (
            <span className="text-[11px] text-white/20">{value.length}</span>
          )}
          <button
            onClick={onSubmit}
            disabled={isLoading || !value.trim()}
            className="ml-auto w-9 h-9 rounded-[10px] bg-green flex items-center justify-center hover:bg-green-light disabled:bg-green/30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <ArrowRight size={16} color="#0C0C0E" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
