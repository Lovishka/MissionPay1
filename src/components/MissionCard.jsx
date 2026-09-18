import React from "react";
import { Target, ArrowUpRight, Clock, AlertCircle } from "lucide-react";

export default function MissionCard({ mission, onViewMission }) {
  if (!mission) {
    return (
      <div className="bg-[#0B1624] rounded-3xl border border-white/[0.08] p-8 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden h-full">
        <div className="w-12 h-12 rounded-2xl bg-[#1683FF]/15 text-[#2EA8FF] border border-[#1683FF]/20 flex items-center justify-center mb-4">
          <AlertCircle size={22} />
        </div>
        <h3 className="text-lg font-bold text-[#F5F8FC]">NO ACTIVE MISSION</h3>
        <p className="text-xs text-[#94A3B8] mt-2 max-w-sm">
          Create a mission to activate MissionPay's AI commerce autopilot.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    if (amount == null) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currentStatus = mission.status || "ACTIVE";

  return (
    <div className="bg-[#0B1624] rounded-3xl border border-white/[0.08] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#1683FF]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1683FF]/15 text-[#2EA8FF] border border-[#1683FF]/20 flex items-center justify-center shadow-sm">
              <Target size={18} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2EA8FF]">
              CURRENT MISSION
            </span>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
            ● {currentStatus}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mt-4 text-[#F5F8FC] leading-snug">
          "{mission.goal}"
        </h2>

        <p className="text-xs text-[#94A3B8] mt-1 font-medium">
          Autonomous multi-agent system executing strategy
        </p>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Live Revenue Status</p>
            <p className="text-xs font-semibold text-[#94A3B8] mt-1">
              Live revenue unavailable
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Target Outcome</p>
            <p className="text-lg font-black text-[#2EA8FF]">
              {formatCurrency(mission.target)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <Clock size={14} className="text-[#1683FF]" />
            <span>Target Deadline: {mission.deadline || "Today"}</span>
          </div>

          <button
            onClick={onViewMission}
            className="flex items-center gap-1.5 text-xs font-bold text-[#2EA8FF] hover:text-[#1683FF] transition-colors"
          >
            VIEW MISSION CONTROL
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}