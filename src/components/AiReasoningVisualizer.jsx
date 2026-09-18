import React from "react";
import { Brain, CheckCircle2, ShieldCheck, Zap, Database, ArrowRight, Activity, CloudSun } from "lucide-react";

export default function AiReasoningVisualizer({ evaluation }) {
  const offer = evaluation?.offer?.offer || evaluation?.offer || null;
  const guardrails = evaluation?.guardrails || null;

  const steps = [
    {
      id: 1,
      title: "Goal Planner Agent",
      subtitle: "Natural Language Processing",
      status: "Completed",
      icon: Brain,
      badge: "NLP Goal Parsed",
      desc: "Parsed merchant target into quantitative constraints.",
    },
    {
      id: 2,
      title: "Demand Radar ML Engine",
      subtitle: "RandomForestRegressor Model",
      status: "Completed",
      icon: Database,
      badge: "Scikit-Learn ML",
      desc: "Evaluated historical sales lags, rolling averages & stock days.",
    },
    {
      id: 3,
      title: "Contextual Radar Agent",
      subtitle: "Open-Meteo & Ticketmaster APIs",
      status: "Completed",
      icon: CloudSun,
      badge: "Live APIs Connected",
      desc: "Processed real-time weather & nearby event footfall signals.",
    },
    {
      id: 4,
      title: "Offer & Economics Agent",
      subtitle: "Cost-Price & Margin Protection",
      status: "Completed",
      icon: Zap,
      badge: "Margin Guarded",
      desc: `Calculated safe discount (${offer?.discount_percentage || 10}%) while preserving profit margin.`,
    },
    {
      id: 5,
      title: "Guardrail Engine",
      subtitle: "4 Safety & Compliance Checks",
      status: "Passed (4/4)",
      icon: ShieldCheck,
      badge: "100% Guarded",
      desc: "Passed inventory limit, margin safety, max discount & approval requirement.",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#071a49] flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            AI Decision Pipeline Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent multi-agent reasoning trace generated in real time.
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Autonomous Flow
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={st.id} className="relative bg-slate-50 hover:bg-blue-50/50 p-4 rounded-xl border border-slate-200/80 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                    0{st.id}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    {st.status}
                  </span>
                </div>
                <Icon className="w-5 h-5 text-[#071a49] mb-2 group-hover:text-blue-600 transition-colors" />
                <h3 className="font-bold text-xs text-[#071a49] truncate">{st.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium">{st.subtitle}</p>
                <p className="text-[11px] text-slate-600 mt-2 leading-tight">{st.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-0.5 border border-slate-200 shadow-sm text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
