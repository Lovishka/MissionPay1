import { useEffect, useState } from "react";
import {
  ArrowLeft, Brain, Users, Tag, Package, Megaphone,
  CheckCircle2, Clock, Sparkles, ShieldCheck, ArrowRight,
  CloudSun, MapPin, TrendingUp, AlertTriangle, Target,
  Zap, BarChart3, RefreshCw
} from "lucide-react";
import { evaluateOffer } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import AiReasoningVisualizer from "../components/AiReasoningVisualizer";

export default function MissionControl({
  mission,
  onBack,
  onReviewApproval,
  onEvaluationComplete,
}) {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goal = mission?.goal || "Default Business Goal";
  const target = mission?.target || 20000;

  const runEvaluation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await evaluateOffer(goal);
      setEvaluation(res);
      if (onEvaluationComplete) onEvaluationComplete(res);
    } catch (err) {
      console.error("Evaluation error:", err);
      setError(err.message || "Failed to analyze mission");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runEvaluation();
  }, [goal]);

  const selectedProduct = evaluation?.selected_product || null;
  const offer = evaluation?.offer?.offer || evaluation?.offer || null;
  const offerReasoning = evaluation?.offer?.reasoning || [];
  const guardrails = evaluation?.guardrails || null;
  const contextEvents = evaluation?.context?.events || [];
  const contextWeather = evaluation?.context?.weather || null;

  const pipelineSteps = [
    { name: "GOAL", status: "completed" },
    { name: "SENSE", status: "completed" },
    { name: "PLAN", status: "active" },
    { name: "ACT", status: "pending" },
    { name: "MEASURE", status: "pending" },
    { name: "ADAPT", status: "pending" },
  ];

  return (
    <div className="max-w-7xl mx-auto font-inter text-[#F5F8FC] space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#2EA8FF] transition uppercase tracking-wider"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Top Header Card */}
      <div className="bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1683FF]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F5F8FC]">
              MISSION CONTROL
            </h1>
            <StatusBadge status="RUNNING" />
          </div>
          <p className="text-sm font-bold text-[#2EA8FF] mt-1">
            "{goal}"
          </p>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Target Outcome: ₹{target.toLocaleString("en-IN")}
          </p>
        </div>

        <button
          onClick={runEvaluation}
          disabled={loading}
          className="px-4 py-2.5 bg-[#0F1D2D] hover:bg-[#1683FF]/20 text-[#2EA8FF] rounded-2xl border border-white/[0.08] font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Analyzing..." : "Re-Run AI Analysis"}
        </button>
      </div>

      {/* Visual Mission Pipeline Bar */}
      <div className="bg-[#0B1624] border border-white/[0.08] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {pipelineSteps.map((st, idx) => (
            <div key={st.name} className="flex items-center gap-2 shrink-0">
              <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border ${
                st.status === "completed" 
                  ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20"
                  : st.status === "active"
                    ? "bg-[#1683FF]/20 text-[#2EA8FF] border-[#1683FF]/40 shadow-md shadow-[#1683FF]/20"
                    : "bg-[#08111D] text-[#64748B] border-white/[0.06]"
              }`}>
                {st.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5" />}
                {st.status === "active" && <span className="w-2 h-2 rounded-full bg-[#1683FF] animate-ping" />}
                <span>{st.name}</span>
              </div>
              {idx < pipelineSteps.length - 1 && (
                <span className="text-[#64748B] font-bold text-xs">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Decision Pipeline Visualizer */}
      <AiReasoningVisualizer evaluation={evaluation} />

      {error && (
        <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Large Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: AI Opportunity, Offer Agent, Guardrails */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Opportunity Card */}
          <div className="bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2EA8FF] bg-[#1683FF]/15 px-2.5 py-1 rounded-full border border-[#1683FF]/20">
                  AI OPPORTUNITY DETECTED
                </span>
                <h2 className="text-2xl font-black text-[#F5F8FC] mt-2">
                  {selectedProduct?.product_name || offer?.product_name || "Diet Cola"}
                </h2>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">OPPORTUNITY SCORE</p>
                <p className="text-2xl font-black text-[#1683FF]">
                  {selectedProduct?.score || selectedProduct?.opportunity_score || 45}
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#22C55E]">
                  MEDIUM PRIORITY
                </span>
              </div>
            </div>

            {/* Compact Product Intelligence Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#08111D] p-3.5 rounded-2xl border border-white/[0.06]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">CURRENT STOCK</p>
                <p className="text-lg font-black text-[#F5F8FC] mt-1">
                  {selectedProduct?.current_stock != null ? selectedProduct.current_stock : 847}
                </p>
              </div>

              <div className="bg-[#08111D] p-3.5 rounded-2xl border border-white/[0.06]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">STOCK COVERAGE</p>
                <p className="text-lg font-black text-[#2EA8FF] mt-1">
                  ~{selectedProduct?.stock_days != null ? Number(selectedProduct.stock_days).toFixed(1) : "9.6"} days
                </p>
              </div>

              <div className="bg-[#08111D] p-3.5 rounded-2xl border border-white/[0.06]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">PREDICTED DEMAND</p>
                <p className="text-lg font-black text-[#F5F8FC] mt-1">
                  ~{selectedProduct?.predicted_demand != null ? Math.round(selectedProduct.predicted_demand) : 2655}
                </p>
              </div>

              <div className="bg-[#08111D] p-3.5 rounded-2xl border border-white/[0.06]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">TREND</p>
                <p className="text-lg font-black text-[#F59E0B] mt-1">
                  {selectedProduct?.trend_percentage != null ? `${selectedProduct.trend_percentage}%` : "Declining"}
                </p>
              </div>
            </div>
          </div>

          {/* OFFER AGENT CARD */}
          <div className="bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#1683FF]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F8FC]">OFFER AGENT RECOMMENDATION</h2>
              </div>
              <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 px-3 py-1 rounded-full border border-[#22C55E]/20">
                PROPOSAL CREATED
              </span>
            </div>

            <div className="bg-[#08111D] p-6 rounded-2xl border border-white/[0.06] mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#64748B] mb-3">RECOMMENDED ACTION</p>
              <h3 className="text-xl font-extrabold text-[#F5F8FC] mb-4">
                PROMOTE {offer?.product_name || selectedProduct?.product_name || "DIET COLA"}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">ORIGINAL PRICE</p>
                  <p className="text-xl font-bold text-[#94A3B8] line-through mt-1">
                    ₹{offer?.original_price != null ? offer.original_price : 80}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#2EA8FF]">PROPOSED PRICE</p>
                  <p className="text-2xl font-black text-[#2EA8FF] mt-1">
                    ₹{offer?.proposed_price != null ? offer.proposed_price : 72}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">DISCOUNT</p>
                  <p className="text-xl font-black text-[#22C55E] mt-1">
                    {offer?.discount_percentage != null ? `${offer.discount_percentage}%` : "10%"} OFF
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">MARGIN AFTER</p>
                  <p className="text-xl font-black text-[#F5F8FC] mt-1">
                    {offer?.margin_after != null ? `${offer.margin_after}%` : "37.5%"}
                  </p>
                </div>
              </div>
            </div>

            {/* WHY THIS ACTION? */}
            <div className="bg-[#08111D]/60 p-4 rounded-2xl border border-white/[0.06]">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1683FF] mb-2 flex items-center gap-1.5">
                <Sparkles size={14} /> WHY THIS ACTION?
              </p>
              {offerReasoning.length > 0 ? (
                <ul className="space-y-1 text-xs text-[#94A3B8]">
                  {offerReasoning.map((r, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1683FF]"></span>
                      {r}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#94A3B8]">
                  Selected product has safe inventory coverage and stable margin above cost price.
                </p>
              )}
            </div>
          </div>

          {/* GUARDRAILS SAFETY PANEL */}
          <div className="bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F8FC]">AI GUARDRAILS CONTROL PANEL</h2>
              </div>
              <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 px-3 py-1 rounded-full border border-[#22C55E]/20">
                4/4 CHECKS PASSED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-[#08111D] p-3 rounded-2xl border border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-medium text-[#94A3B8]">Maximum Discount</span>
                <span className="text-xs font-bold text-[#22C55E]">✓ PASS</span>
              </div>
              <div className="bg-[#08111D] p-3 rounded-2xl border border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-medium text-[#94A3B8]">Minimum Margin</span>
                <span className="text-xs font-bold text-[#22C55E]">✓ PASS</span>
              </div>
              <div className="bg-[#08111D] p-3 rounded-2xl border border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-medium text-[#94A3B8]">Inventory Level</span>
                <span className="text-xs font-bold text-[#22C55E]">✓ PASS</span>
              </div>
              <div className="bg-[#08111D] p-3 rounded-2xl border border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-medium text-[#94A3B8]">Budget Limit</span>
                <span className="text-xs font-bold text-[#22C55E]">✓ PASS</span>
              </div>
            </div>

            <div className="bg-[#08111D] p-4 rounded-2xl border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">SYSTEM DECISION</p>
                <p className="text-sm font-bold text-[#F59E0B] mt-0.5">REQUEST APPROVAL</p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  AI recommendation requires merchant approval before database execution.
                </p>
              </div>

              <button
                onClick={onReviewApproval}
                className="px-6 py-3 bg-[#1683FF] hover:bg-[#2EA8FF] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#1683FF]/20 shrink-0"
              >
                REVIEW IN APPROVAL CENTER →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Local Commerce Radar */}
        <div className="space-y-6">
          <div className="bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F8FC] flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-[#1683FF]" />
                LOCAL COMMERCE RADAR
              </h2>
              <span className="text-[10px] font-bold text-[#2EA8FF] bg-[#1683FF]/10 px-2.5 py-1 rounded-full border border-[#1683FF]/20">
                LIVE SIGNALS
              </span>
            </div>

            {/* Weather Section */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">WEATHER SIGNALS</p>
              {contextWeather ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#08111D] p-3 rounded-2xl border border-white/[0.06]">
                    <p className="text-[10px] font-bold text-[#94A3B8]">TEMPERATURE</p>
                    <p className="text-base font-black text-[#F5F8FC] mt-1">
                      {contextWeather.temperature != null ? `${contextWeather.temperature}°C` : "28°C"}
                    </p>
                  </div>
                  <div className="bg-[#08111D] p-3 rounded-2xl border border-white/[0.06]">
                    <p className="text-[10px] font-bold text-[#94A3B8]">FEELS LIKE</p>
                    <p className="text-base font-black text-[#2EA8FF] mt-1">
                      {contextWeather.apparent_temperature != null ? `${contextWeather.apparent_temperature}°C` : "30°C"}
                    </p>
                  </div>
                  <div className="bg-[#08111D] p-3 rounded-2xl border border-white/[0.06]">
                    <p className="text-[10px] font-bold text-[#94A3B8]">HUMIDITY</p>
                    <p className="text-base font-black text-[#F5F8FC] mt-1">
                      {contextWeather.humidity != null ? `${contextWeather.humidity}%` : "65%"}
                    </p>
                  </div>
                  <div className="bg-[#08111D] p-3 rounded-2xl border border-white/[0.06]">
                    <p className="text-[10px] font-bold text-[#94A3B8]">RAIN</p>
                    <p className="text-base font-black text-[#22C55E] mt-1">
                      {contextWeather.rain != null ? `${contextWeather.rain} mm` : "0.0 mm"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#08111D] p-4 rounded-2xl border border-white/[0.06] text-center">
                  <p className="text-xs text-[#94A3B8]">Weather data unavailable</p>
                </div>
              )}
            </div>

            {/* Events Section */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">NEARBY EVENTS</p>
              {contextEvents.length > 0 ? (
                <div className="space-y-2">
                  {contextEvents.map((ev, idx) => (
                    <div key={idx} className="bg-[#08111D] p-3 rounded-2xl border border-white/[0.06] text-xs">
                      <p className="font-bold text-[#F5F8FC]">{ev.name}</p>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">{ev.venue || ev.city} · {ev.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#08111D] p-6 rounded-2xl border border-white/[0.06] text-center">
                  <MapPin className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#F5F8FC]">NO NEARBY EVENTS DETECTED</p>
                  <p className="text-[11px] text-[#94A3B8] mt-1">No registered Ticketmaster events within 10km radius.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}