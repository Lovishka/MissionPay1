import React from "react";
import { Sparkles, Sun, CloudRain, Trophy, Zap, ShieldCheck } from "lucide-react";

export default function HackathonDemoBar({ onSelectScenario, activeScenario }) {
  const scenarios = [
    {
      id: "heatwave",
      name: "38°C Delhi Heatwave",
      icon: Sun,
      color: "text-amber-500 bg-amber-50 border-amber-200",
      description: "High heat signal → Boosts cold beverages & summer stock",
      goal: "Clear cold beverage stock during high heatwave",
    },
    {
      id: "monsoon",
      name: "Heavy Monsoon Rain",
      icon: CloudRain,
      color: "text-blue-500 bg-blue-50 border-blue-200",
      description: "Rain signal → Promotes rain gear & indoor comfort items",
      goal: "Clear seasonal rain gear before monsoon ends",
    },
    {
      id: "ipl_match",
      name: "IPL Match (Feroz Shah Kotla)",
      icon: Trophy,
      color: "text-purple-500 bg-purple-50 border-purple-200",
      description: "Local event signal → High stadium footfall promotion",
      goal: "Maximize game-day snack & beverage sales",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-[#071a49] via-[#0b276b] to-[#071a49] text-white p-3 px-4 rounded-2xl shadow-xl border border-blue-400/30 mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30 shrink-0">
          <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30">
              Judges Demo Mode
            </span>
            <span className="text-xs text-blue-200 font-medium">Test Real AI Reaction</span>
          </div>
          <p className="text-xs text-slate-300">
            Simulate live environmental signals to see MissionPay adapt demand & pricing in real time.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isSelected = activeScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap border ${
                isSelected
                  ? "bg-white text-blue-900 border-white shadow-md scale-105"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/10"
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-amber-300"}`} />
              <span>{sc.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
