import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, Target, Clock, ArrowUpRight, 
  ShieldCheck, Package, Activity, Cloud, 
  MapPin, CalendarDays, AlertTriangle, 
  Sparkles, BarChart3, Radio, RefreshCw
} from "lucide-react";

import { 
  getDataSummary, getSalesHistory, getAgentActivity, 
  getProducts, getWeather, getEvents, getDemandRadar 
} from "../services/api";

import MetricCard from "../components/MetricCard";
import MissionCard from "../components/MissionCard";
import AgentCard from "../components/AgentCard";
import HackathonDemoBar from "../components/HackathonDemoBar";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard({ mission, evaluation, setActive }) {
  const [dataSummary, setDataSummary] = useState(null);
  const [salesHistory, setSalesHistory] = useState([]);
  const [agentActivities, setAgentActivities] = useState([]);
  const [products, setProducts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [events, setEvents] = useState([]);
  const [demandRadar, setDemandRadar] = useState(null);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [loadingContext, setLoadingContext] = useState(true);

  const [activeScenario, setActiveScenario] = useState(null);

  const fetchDashboardData = () => {
    setLoadingSummary(true);
    setLoadingHistory(true);
    setLoadingAgents(true);
    setLoadingContext(true);

    getDataSummary()
      .then(setDataSummary)
      .catch((err) => console.error("Summary fetch error:", err))
      .finally(() => setLoadingSummary(false));

    getSalesHistory()
      .then((data) => setSalesHistory(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Sales history fetch error:", err))
      .finally(() => setLoadingHistory(false));

    getAgentActivity()
      .then((data) => setAgentActivities(data?.agents || []))
      .catch((err) => console.error("Agent activity fetch error:", err))
      .finally(() => setLoadingAgents(false));

    Promise.allSettled([
      getProducts(),
      getWeather(),
      getEvents(),
      getDemandRadar(),
    ]).then(([prodRes, weatherRes, eventsRes, demandRes]) => {
      if (prodRes.status === "fulfilled" && Array.isArray(prodRes.value)) {
        setProducts(prodRes.value);
      }
      if (weatherRes.status === "fulfilled" && weatherRes.value && weatherRes.value.status !== "unavailable") {
        setWeather(weatherRes.value.weather || weatherRes.value);
      }
      if (eventsRes.status === "fulfilled" && eventsRes.value && eventsRes.value.status !== "unavailable") {
        const evList = eventsRes.value.events || (Array.isArray(eventsRes.value) ? eventsRes.value : []);
        setEvents(evList);
      }
      if (demandRes.status === "fulfilled") {
        setDemandRadar(demandRes.value);
      }
      setLoadingContext(false);
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "—";
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "GOOD MORNING";
    if (hour >= 12 && hour < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  };

  const getMerchantName = () => {
    try {
      const merchant = JSON.parse(localStorage.getItem("merchant"));
      return merchant?.business_name || "SAKUJA TRADERS";
    } catch {
      return "SAKUJA TRADERS";
    }
  };

  const greeting = getGreeting();
  const merchantName = getMerchantName();

  const maxSales = salesHistory.length > 0 
    ? Math.max(...salesHistory.map((s) => s.total_units)) 
    : 100;

  const handleSelectScenario = (scenario) => {
    setActiveScenario(scenario.id);
    setActive("Create Mission");
  };

  return (
    <div className="space-y-8 font-inter text-[#F5F8FC]">
      {/* Hackathon Demo Bar for Judges */}
      <HackathonDemoBar onSelectScenario={handleSelectScenario} activeScenario={activeScenario} />

      {/* Top Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Merchant Greeting & Hero Title */}
        <div className="lg:col-span-1 bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#1683FF]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-[#1683FF]/15 text-[#2EA8FF] rounded-full border border-[#1683FF]/20">
                {greeting}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#F5F8FC] uppercase tracking-tight mt-3">
              {merchantName}
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Autonomous Merchant Intelligence Center
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
              <span>Autonomous Engine Active</span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="p-2 bg-[#0F1D2D] hover:bg-[#1683FF]/20 text-[#2EA8FF] rounded-xl border border-white/[0.08] transition"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Current Mission Hero Card */}
        <div className="lg:col-span-2">
          <MissionCard mission={mission} onViewMission={() => setActive("Mission Control")} />
        </div>
      </div>

      {/* 4 Premium Dark Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Historical Units Sold"
          value={dataSummary?.total_units_sold != null ? dataSummary.total_units_sold.toLocaleString("en-IN") : "—"}
          subtitle={dataSummary?.unique_products ? `${dataSummary.unique_products} product lines` : "No historical sales"}
          icon={TrendingUp}
          loading={loadingSummary}
        />
        <MetricCard
          title="Total Inventory On Hand"
          value={dataSummary?.total_inventory != null ? dataSummary.total_inventory.toLocaleString("en-IN") : "—"}
          subtitle="Real-time stock units"
          icon={Package}
          loading={loadingSummary}
        />
        <MetricCard
          title="Current Mission Target"
          value={mission?.goal ? (mission.target ? `₹${mission.target.toLocaleString("en-IN")}` : "Goal Active") : "No Active Mission"}
          subtitle={mission?.goal ? "Target set by merchant" : "Create a mission to activate"}
          icon={Target}
        />
        <MetricCard
          title="Mission Execution Status"
          value={mission ? "ACTIVE" : "IDLE"}
          subtitle={mission ? "AI optimizing strategy" : "Awaiting merchant mission"}
          icon={Activity}
        />
      </div>

      {/* AI Agent Activity Section */}
      <div className="bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#F5F8FC] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2EA8FF]" />
              AI Agent Activity
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Multi-agent team coordinating local commerce intelligence
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-[#1683FF]/15 text-[#2EA8FF] rounded-full border border-[#1683FF]/20">
            5 Core Agents
          </span>
        </div>

        {loadingAgents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-36 skeleton-dark rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentActivities.map((agent, index) => (
              <AgentCard key={index} agent={agent} />
            ))}
          </div>
        )}
      </div>

      {/* Historical Sales Volume Chart Section */}
      <div className="bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#F5F8FC] uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#1683FF]" />
              Historical Sales Volume
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Monthly unit sales trajectory from PostgreSQL database
            </p>
          </div>
          <span className="text-xs text-[#94A3B8] font-medium bg-[#0F1D2D] px-3 py-1.5 rounded-xl border border-white/[0.08]">
            Monthly Aggregate
          </span>
        </div>

        {loadingHistory ? (
          <div className="h-56 skeleton-dark rounded-2xl"></div>
        ) : salesHistory.length === 0 ? (
          <div className="p-12 text-center bg-[#08111D] rounded-2xl border border-white/[0.06]">
            <BarChart3 className="w-10 h-10 text-[#64748B] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#F5F8FC]">No Historical Sales Data</p>
            <p className="text-xs text-[#94A3B8] mt-1">Upload sales CSV in Setup Data to render trajectory chart.</p>
          </div>
        ) : (
          <div className="bg-[#08111D] p-6 rounded-2xl border border-white/[0.06]">
            <div className="h-56 flex items-end gap-3 sm:gap-6 pt-6 px-2 border-b border-white/[0.08]">
              {salesHistory.map((item, index) => {
                const heightPercent = maxSales > 0 ? (item.total_units / maxSales) * 100 : 0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-[#0F1D2D] text-[#F5F8FC] text-[11px] font-bold py-1 px-2.5 rounded-lg border border-white/[0.1] shadow-xl whitespace-nowrap pointer-events-none z-20">
                      Month {item.month}: {item.total_units.toLocaleString()} units
                    </div>

                    {/* Bar */}
                    <div 
                      className="w-full bg-gradient-to-t from-[#1683FF] to-[#2EA8FF] rounded-t-lg transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-[#1683FF]/20"
                      style={{ height: `${Math.max(8, heightPercent)}%` }}
                    />
                    <span className="text-[10px] font-semibold text-[#94A3B8] group-hover:text-[#F5F8FC] transition-colors truncate">
                      M{item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}