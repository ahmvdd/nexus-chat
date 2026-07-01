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
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-10">
      <div className="w-full max-w-[520px]">
        <h1 className="text-4xl font-bold font-mono tracking-tight mb-1">NEXUS</h1>
        <p className="text-[#444] font-mono text-[13px] mb-10">assistant local · ollama</p>

        <div className="flex flex-col gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => onSuggestion(s.prompt)}
              className="text-left px-4 py-3 border border-[#222] text-[12px] font-mono text-[#555] hover:border-white hover:text-white transition-all"
            >
              <span className="text-[#333] mr-2">→</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
