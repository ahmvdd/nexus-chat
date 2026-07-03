"use client";

import { useRef, useEffect, KeyboardEvent, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface InputAreaProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  onVoiceResult: (transcript: string) => void;
  isLoading: boolean;
}

export default function InputArea({ value, onChange, onSubmit, onStop, onVoiceResult, isLoading }: InputAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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

  const toggleVoice = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Reconnaissance vocale non supportée sur ce navigateur.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setIsListening(false);
      onVoiceResult(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening, onVoiceResult]);

  return (
    <div className="px-6 pb-6 pt-4 border-t border-white/10 backdrop-blur-xl bg-black/30 flex-shrink-0">
      <div className={cn(
        "max-w-[800px] mx-auto border transition-all backdrop-blur-md rounded-md",
        isListening ? "border-white/60 bg-white/5" :
        isLoading ? "border-white/20 bg-white/5" :
        value ? "border-white/40 bg-white/5" :
        "border-white/10 bg-white/5 focus-within:border-white/25"
      )}>
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder={isListening ? "écoute..." : isLoading ? "génération en cours..." : "> message..."}
          disabled={isLoading || isListening}
          className="bg-transparent text-white w-full font-mono text-[13.5px] resize-none leading-relaxed min-h-[44px] max-h-[180px] overflow-y-auto placeholder:text-white/20 disabled:opacity-40 px-4 py-3 outline-none border-none"
        />
        <div className="flex items-center px-4 pb-3 gap-2">
          <span className="text-[10px] text-white/20 font-mono">
            {isListening ? "parle maintenant..." : isLoading ? "esc pour arrêter" : "enter ↵ envoyer · shift+enter nouvelle ligne"}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggleVoice}
              disabled={isLoading}
              className={cn(
                "text-[13px] px-2 py-1 border transition-all rounded-sm",
                isListening
                  ? "border-white text-white animate-pulse"
                  : "border-white/20 text-white/40 hover:border-white/40 hover:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed"
              )}
            >
              {isListening ? "⏹" : "🎤"}
            </button>

            {isLoading ? (
              <button
                onClick={onStop}
                className="text-[11px] font-mono uppercase tracking-widest px-3 py-1 border border-white/20 text-white/40 hover:bg-white hover:text-black hover:border-white transition-all rounded-sm"
              >
                ■ stop
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={!value.trim()}
                className="text-[11px] font-mono uppercase tracking-widest px-3 py-1 border border-white/20 text-white/40 hover:bg-white hover:text-black hover:border-white disabled:opacity-20 disabled:cursor-not-allowed transition-all rounded-sm"
              >
                send
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
