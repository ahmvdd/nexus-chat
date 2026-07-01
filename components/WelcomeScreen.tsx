"use client";

import { useEffect, useRef } from "react";

const SUGGESTIONS = [
  {
    icon: "🧠",
    label: "Comprendre les LLMs",
    sub: "Comment ça marche vraiment",
    prompt: "Explique moi comment fonctionne un transformer LLM en détail",
  },
  {
    icon: "⚡",
    label: "Architect une API",
    sub: "REST, GraphQL, tRPC",
    prompt: "Aide moi à designer une API REST pour une app de planning de shifts",
  },
  {
    icon: "🌿",
    label: "Idées de projets",
    sub: "Pour le portfolio",
    prompt: "Donne moi des idées de projets front-end originaux à coder pour mon portfolio",
  },
  {
    icon: "✦",
    label: "System prompt",
    sub: "Assistant code Next.js",
    prompt: "Génère moi un prompt système pour un assistant de code spécialisé en Next.js",
  },
];

interface WelcomeScreenProps {
  onSuggestion: (prompt: string) => void;
}

export default function WelcomeScreen({ onSuggestion }: WelcomeScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      op: Math.random(),
      speed: Math.random() * 0.005 + 0.001,
      dir: Math.random() > 0.5 ? 1 : -1,
    }));

    let frame: number;
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      stars.forEach((s) => {
        s.op += s.speed * s.dir;
        if (s.op > 0.9) s.dir = -1;
        if (s.op < 0.05) s.dir = 1;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.op})`;
        ctx.fill();
      });
      // Quelques étoiles vertes
      for (let i = 0; i < 7; i++) {
        const s = stars[i * 18];
        if (!s) continue;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(134,239,172,${s.op * 0.5})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 text-center">
      {/* Hero cosmique — juste cette section */}
      <div className="w-full max-w-[600px] rounded-[20px] overflow-hidden border border-white/[0.08] bg-[#050810] relative mb-9" style={{ height: 200 }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        {/* Nébuleuse CSS */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 60% at 80% 20%, rgba(74,222,128,0.12) 0%, transparent 60%),
              radial-gradient(ellipse 50% 50% at 15% 75%, rgba(30,50,120,0.2) 0%, transparent 55%)
            `,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <span className="text-[11px] text-green border border-green/20 bg-green/10 rounded-full px-3 py-1 tracking-wider">
            ✦ Nexus AI
          </span>
          <h1 className="text-3xl font-bold tracking-tight leading-tight">
            What can I help<br />
            you <span className="text-green">build today?</span>
          </h1>
        </div>
      </div>

      {/* Suggestions */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-[560px]">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => onSuggestion(s.prompt)}
            className="bg-white/[0.03] border border-white/[0.08] rounded-[12px] p-4 text-left hover:border-green/25 hover:bg-green/[0.04] transition-all group"
          >
            <div className="text-xl mb-2">{s.icon}</div>
            <p className="text-[13px] font-medium text-white/75 group-hover:text-white transition-colors">
              {s.label}
            </p>
            <p className="text-[11px] text-white/30 mt-1">{s.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
