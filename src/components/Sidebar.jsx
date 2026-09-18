import { useState } from "react";
import {
  LayoutDashboard,
  Target,
  Radio,
  ShieldCheck,
  Zap,
  Menu,
  X,
  LogOut,
  Building2,
  Settings,
  Activity,
  BarChart3,
  CloudSun,
} from "lucide-react";

const navSections = [
  {
    category: "OVERVIEW",
    items: [
      { name: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    category: "MISSIONS",
    items: [
      { name: "Create Mission", icon: Target },
      { name: "Mission Control", icon: Radio },
    ],
  },
  {
    category: "INTELLIGENCE",
    items: [
      { name: "Demand Radar", icon: BarChart3, targetTab: "Dashboard" },
      { name: "Local Radar", icon: CloudSun, targetTab: "Dashboard" },
      { name: "Agent Activity", icon: Activity, targetTab: "Dashboard" },
    ],
  },
  {
    category: "ACTIONS",
    items: [
      { name: "Approvals", icon: ShieldCheck },
      { name: "Execution", icon: Zap },
    ],
  },
  {
    category: "SETUP",
    items: [
      { name: "Setup Data", icon: Settings, targetTab: "Setup" },
    ],
  },
];

export default function Sidebar({ active, setActive, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const merchantData = JSON.parse(localStorage.getItem("merchant") || "{}");
  const businessName = merchantData.business_name;
  const merchantId = merchantData.merchant_id;
  const city = merchantData.city;
  const initial = businessName ? businessName.charAt(0).toUpperCase() : "—";

  const handleNavigation = (item) => {
    setActive(item.targetTab || item.name);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[#08111D] text-[#F5F8FC] flex items-center justify-between px-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1683FF] to-[#2EA8FF] flex items-center justify-center shadow-lg shadow-[#1683FF]/30">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-[#F5F8FC]">
              MISSION<span className="text-[#1683FF]">PAY</span>
            </div>
            <p className="text-[9px] text-[#94A3B8]">Local Commerce Autopilot</p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-[#94A3B8] hover:text-[#F5F8FC] hover:bg-[#0B1624] transition border border-white/[0.08]"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-[#08111D] border-r border-white/[0.08] text-[#F5F8FC] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/[0.08] relative overflow-hidden flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1683FF] to-[#2EA8FF] flex items-center justify-center shadow-lg shadow-[#1683FF]/30 shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-[#F5F8FC]">
              MISSION<span className="text-[#1683FF]">PAY</span>
            </div>
            <p className="text-[10px] text-[#94A3B8]">Local Commerce Autopilot</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.category}>
              <p className="px-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                {section.category}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const target = item.targetTab || item.name;
                  const isActive = active === target;

                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item)}
                      className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 overflow-hidden ${
                        isActive
                          ? "bg-[#1683FF]/15 text-[#F5F8FC] shadow-sm shadow-[#1683FF]/20"
                          : "text-[#94A3B8] hover:bg-[#0B1624] hover:text-[#F5F8FC]"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1683FF] rounded-r-md"></div>
                      )}
                      <Icon
                        size={17}
                        className={`transition-colors ${
                          isActive ? "text-[#2EA8FF]" : "text-[#64748B]"
                        }`}
                      />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Merchant Profile at Bottom */}
        <div className="p-4 border-t border-white/[0.08] bg-[#050A12]/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1624] border border-white/[0.06]">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-tr from-[#1683FF] to-[#2EA8FF] flex items-center justify-center font-bold text-xs text-white shadow-md shadow-[#1683FF]/20">
              {initial !== "—" ? initial : <Building2 size={16} />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-[#F5F8FC]">
                {businessName || "Merchant"}
              </p>
              <p className="text-[10px] text-[#94A3B8] truncate mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                {city || "Merchant Account"}
              </p>
            </div>
          </div>

          {/* Sign Out */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full mt-2.5 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}