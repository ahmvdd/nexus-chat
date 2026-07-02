"use client";

const SUGGESTIONS = [
  {
    label: "Comprendre les LLMs",
    prompt: "Explique moi comment fonctionne un transformer LLM en détail",
  },
  {
    label: "Architect une API",
    prompt: "Aide moi à designer une API REST pour une app de planning de shifts",
  },
  {
    label: "Idées de projets",
    prompt: "Donne moi des idées de projets front-end originaux à coder pour mon portfolio",
  },
  {
    label: "System prompt",
    prompt: "Génère moi un prompt système pour un assistant de code spécialisé en Next.js",
  },
];

interface WelcomeScreenProps {
  onSuggestion: (prompt: string) => void;
}

export default function WelcomeScreen({ onSuggestion }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-end justify-end px-8 py-10">
      <div className="w-full max-w-[320px]">
        <div className="flex flex-col gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => onSuggestion(s.prompt)}
              className="text-left px-4 py-2.5 border border-white/10 text-[11px] font-mono text-white/40 hover:border-white/40 hover:text-white/80 transition-all backdrop-blur-sm bg-black/20"
            >
              <span className="text-white/20 mr-2">→</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
