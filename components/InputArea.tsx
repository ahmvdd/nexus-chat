"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface InputAreaProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  isLoading: boolean;
}

export default function InputArea({ value, onChange, onSubmit, onStop, isLoading }: InputAreaProps) {
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
      if (!isLoading) onSubmit();
    }
    if (e.key === "Escape" && isLoading) {
      onStop();
    }
  };

  return (
    <div className="px-6 pb-6 pt-4 border-t border-white/10 backdrop-blur-xl bg-black/30 flex-shrink-0">
      <div className={cn(
        "max-w-[800px] mx-auto border transition-all backdrop-blur-md rounded-md",
        isLoading ? "border-white/20 bg-white/5" : value ? "border-white/40 bg-white/5" : "border-white/10 bg-white/5 focus-within:border-white/25"
      )}>
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder={isLoading ? "génération en cours..." : "> message..."}
          disabled={isLoading}
          className="bg-transparent text-white w-full font-mono text-[13.5px] resize-none leading-relaxed min-h-[44px] max-h-[180px] overflow-y-auto placeholder:text-white/20 disabled:opacity-40 px-4 py-3 outline-none border-none"
        />
        <div className="flex items-center px-4 pb-3 gap-2">
          <span className="text-[10px] text-white/20 font-mono">
            {isLoading ? "esc pour arrêter" : "enter ↵ envoyer · shift+enter nouvelle ligne"}
          </span>
          {isLoading ? (
            <button
              onClick={onStop}
              className="ml-auto text-[11px] font-mono uppercase tracking-widest px-3 py-1 border border-white/20 text-white/40 hover:bg-white hover:text-black hover:border-white transition-all rounded-sm"
            >
              ■ stop
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={!value.trim()}
              className="ml-auto text-[11px] font-mono uppercase tracking-widest px-3 py-1 border border-white/20 text-white/40 hover:bg-white hover:text-black hover:border-white disabled:opacity-20 disabled:cursor-not-allowed transition-all rounded-sm"
            >
              send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
