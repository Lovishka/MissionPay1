import React from "react";

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass = "bg-[#1683FF]/15 text-[#2EA8FF]",
  loading = false,
  trend,
}) {
  return (
    <div className="bg-[#0B1624] hover:bg-[#0F1D2D] border border-white/[0.08] rounded-2xl p-5 shadow-lg transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#1683FF]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#1683FF]/10 transition-colors"></div>

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">{title}</p>
          
          {loading ? (
            <div className="h-8 w-28 skeleton-dark rounded-xl mt-3"></div>
          ) : (
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F8FC] tracking-tight mt-2">{value}</h3>
          )}

          {subtitle && (
            <p className="text-xs text-[#64748B] mt-2 font-medium flex items-center gap-1">
              {subtitle}
            </p>
          )}

          {trend && (
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#22C55E]">
              ↑ {trend}
            </span>
          )}
        </div>

        {Icon && (
          <div className="w-11 h-11 rounded-2xl bg-[#0F1D2D] border border-white/[0.08] text-[#2EA8FF] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#1683FF]/30 transition-all shadow-inner">
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}