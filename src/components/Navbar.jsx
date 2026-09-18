import React from "react";
import { Bell, Sparkles, User, ShieldCheck } from "lucide-react";

export default function Navbar({ active, subtitle }) {
  const getMerchant = () => {
    try {
      const data = localStorage.getItem("merchant");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const merchant = getMerchant();
  const businessName = merchant?.business_name || "Merchant";
  const city = merchant?.city || null;

  return (
    <header className="h-16 bg-[#08111D]/80 backdrop-blur-md border-b border-white/[0.08] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-base sm:text-lg font-bold text-[#F5F8FC] uppercase tracking-wider flex items-center gap-2">
          {active}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#94A3B8] hidden sm:block">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Controls: System Status, Notifications, Merchant Identity */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* System Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#1683FF]/10 border border-[#1683FF]/20 rounded-full text-xs font-semibold text-[#2EA8FF]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2EA8FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1683FF]"></span>
          </span>
          <span>AI SYSTEM ONLINE</span>
        </div>

        {/* Notifications Icon */}
        <button className="p-2 text-[#94A3B8] hover:text-[#F5F8FC] bg-[#0B1624] hover:bg-[#0F1D2D] rounded-xl border border-white/[0.08] transition relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1683FF] rounded-full"></span>
        </button>

        {/* Merchant Profile Pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1683FF] to-[#2EA8FF] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-[#1683FF]/20">
            {businessName.substring(0, 2).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-[#F5F8FC] leading-none truncate max-w-[120px]">
              {businessName}
            </p>
            {city && (
              <p className="text-[10px] text-[#94A3B8] mt-0.5">
                {city}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
