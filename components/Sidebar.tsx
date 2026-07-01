"use client";

import { Plus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation, Model, ModelOption } from "@/types";

const MODELS: ModelOption[] = [
  { id: "claude-sonnet-4-6", label: "Sonnet 4.6", description: "Rapide & intelligent" },
  { id: "claude-haiku-4-5-20251001", label: "Haiku 4.5", description: "Ultra rapide" },
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
    <aside className="w-[220px] min-w-[220px] bg-surface border-r border-white/[0.07] flex flex-col gap-1 px-3 py-5 h-dvh">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 pb-5 mb-2 border-b border-white/[0.07]">
        <div className="w-7 h-7 rounded-[7px] bg-gradient-to-br from-green-400 to-green-900 flex items-center justify-center text-sm font-bold text-[#0C0C0E]">
          N
        </div>
        <span className="text-sm font-bold tracking-tight">Nexus</span>
        <span className="ml-auto text-[10px] bg-green-dim text-green border border-green/20 rounded-full px-2 py-0.5">
          AI
        </span>
      </div>

      {/* New chat */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] bg-green-dim border border-green/20 text-green text-[13.5px] font-medium cursor-pointer hover:bg-green/[0.16] transition-all mb-2"
      >
        <Plus size={16} />
        New chat
      </button>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-0.5">
        {today.length > 0 && (
          <>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.09em] px-3 py-2">
              Today
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
            <p className="text-[10px] text-white/20 uppercase tracking-[0.09em] px-3 py-2 mt-2">
              Older
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
      <div className="border-t border-white/[0.07] pt-3 flex flex-col gap-2">
        {/* Model selector */}
        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.09em] px-2">
            Model
          </p>
          {MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => onModelChange(m.id)}
              className={cn(
                "flex items-center gap-2 px-2.5 py-2 rounded-[8px] text-left transition-all",
                model === m.id
                  ? "bg-green/[0.09] border border-green/20"
                  : "hover:bg-white/[0.04] border border-transparent"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full flex-shrink-0",
                  model === m.id ? "bg-green shadow-[0_0_5px_#4ADE80] blink" : "bg-white/20"
                )}
              />
              <div>
                <p className={cn("text-[12px] font-medium", model === m.id ? "text-green" : "text-white/50")}>
                  {m.label}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* User */}
        <div className="flex items-center gap-2 px-2 pt-1">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a3320] to-green flex-shrink-0" />
          <div>
            <p className="text-[12.5px] font-medium">Sayeh</p>
            <p className="text-[10px] text-white/30">Pro</p>
          </div>
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
        "w-full text-left px-3 py-2 rounded-[9px] text-[13px] truncate transition-all border",
        active
          ? "bg-white/[0.06] text-white border-white/[0.07]"
          : "text-white/40 hover:bg-white/[0.04] hover:text-white/75 border-transparent"
      )}
    >
      {conv.title}
    </button>
  );
}
