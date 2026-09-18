import React from "react";
import StatusBadge from "./StatusBadge";
import { Brain, Database, Activity, Zap, Megaphone } from "lucide-react";

export default function AgentCard({ agent }) {
  const name = agent?.name || "Agent";
  const status = agent?.status || "Ready";
  const description = agent?.description || "Coordinates mission tasks.";
  const reasoning = agent?.reasoning || null;

  const getAgentIcon = (agentName) => {
    switch (agentName.toLowerCase()) {
      case "goal planner": return Brain;
      case "demand radar": return Database;
      case "opportunity engine": return Activity;
      case "offer agent": return Zap;
      default: return Megaphone;
    }
  };

  const Icon = getAgentIcon(name);

  return (
    <div className="bg-[#0B1624] hover:bg-[#0F1D2D] border border-white/[0.08] rounded-2xl p-5 shadow-lg transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1683FF]/15 border border-[#1683FF]/20 text-[#2EA8FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Icon size={19} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F5F8FC]">{name}</h3>
              <p className="text-xs text-[#94A3B8] mt-0.5 leading-snug">{description}</p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </div>

      {reasoning && (
        <div className="mt-3 bg-[#08111D] rounded-xl p-3 border border-white/[0.06]">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">
            Latest Reasoning
          </p>
          <p className="text-xs text-[#F5F8FC] mt-1 font-medium leading-normal">{reasoning}</p>
        </div>
      )}
    </div>
  );
}