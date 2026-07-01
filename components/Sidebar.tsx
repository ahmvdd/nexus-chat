"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation, Model, ModelOption } from "@/types";

const MODELS: ModelOption[] = [
  { id: "llama3.2", label: "llama3.2", description: "défaut" },
  { id: "mistral", label: "mistral", description: "alternatif" },
];

interface SidebarProps {
  conversations: Conversation[];
  currentId: string | null;
  model: Model;
  onNewChat: () => void;
  onSelectConv: (id: string) => void;
  onModelChange: (model: Model) => void;
}

export default function Sidebar({
  conversations,
  currentId,
  model,
  onNewChat,
  onSelectConv,
  onModelChange,
}: SidebarProps) {
  const today = conversations.filter((c) => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const older = conversations.filter((c) => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return d.toDateString() !== now.toDateString();
  });

  return (
    <aside className="w-[200px] min-w-[200px] bg-black border-r border-[#222] flex flex-col gap-1 px-3 py-4 h-dvh">
      {/* Logo */}
      <div className="flex items-center gap-2 px-1 pb-4 mb-2 border-b border-[#222]">
        <span className="text-sm font-bold tracking-widest uppercase">NEXUS</span>
      </div>

      {/* New chat */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 px-3 py-2 border border-[#333] text-[12px] uppercase tracking-widest cursor-pointer hover:bg-white hover:text-black transition-all mb-3"
      >
        <Plus size={12} />
        New chat
      </button>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-0.5">
        {today.length > 0 && (
          <>
            <p className="text-[9px] text-[#444] uppercase tracking-[0.12em] px-1 py-2">
              Aujourd'hui
            </p>
            {today.map((c) => (
              <ConvItem
                key={c.id}
                conv={c}
                active={c.id === currentId}
                onClick={() => onSelectConv(c.id)}
              />
            ))}
          </>
        )}
        {older.length > 0 && (
          <>
            <p className="text-[9px] text-[#444] uppercase tracking-[0.12em] px-1 py-2 mt-2">
              Ancien
            </p>
            {older.map((c) => (
              <ConvItem
                key={c.id}
                conv={c}
                active={c.id === currentId}
                onClick={() => onSelectConv(c.id)}
              />
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#222] pt-3 flex flex-col gap-2">
        <p className="text-[9px] text-[#444] uppercase tracking-[0.12em] px-1">Modèle</p>
        {MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => onModelChange(m.id)}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 text-left transition-all text-[11px]",
              model === m.id
                ? "bg-white text-black"
                : "text-[#555] hover:text-white"
            )}
          >
            <span className="font-mono">{m.label}</span>
          </button>
        ))}

        <div className="flex items-center gap-2 px-1 pt-2 border-t border-[#222]">
          <div className="w-5 h-5 bg-white flex items-center justify-center text-black text-[10px] font-bold">S</div>
          <span className="text-[11px] text-[#555]">Sayeh</span>
        </div>
      </div>
    </aside>
  );
}

function ConvItem({
  conv,
  active,
  onClick,
}: {
  conv: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-2 py-1.5 text-[11px] truncate transition-all font-mono",
        active
          ? "bg-white text-black"
          : "text-[#555] hover:text-white"
      )}
    >
      {conv.title}
    </button>
  );
}
