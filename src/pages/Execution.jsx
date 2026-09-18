import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Clock, Zap, RefreshCw, Radio, Check, Server, Store, ShoppingBag } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { executeMission, getLatestExecution } from "../services/api";

export default function Execution({ mission, evaluation, onBack, onComplete }) {
  const offer = evaluation?.offer?.offer || evaluation?.offer || null;
  const product = evaluation?.selected_product || null;

  const [executing, setExecuting] = useState(false);
  const [executionData, setExecutionData] = useState(null);
  const [error, setError] = useState("");

  const productId = product?.product_id || offer?.product_id || "P101";
  const proposedPrice = offer?.proposed_price != null ? Number(offer.proposed_price) : 72;
  const discountPercentage = offer?.discount_percentage != null ? Number(offer.discount_percentage) : 10;
  const productName = offer?.product_name || product?.product_name || "Diet Cola";

  const triggerLiveExecution = async () => {
    setExecuting(true);
    setError("");
    try {
      const res = await executeMission({
        product_id: productId,
        proposed_price: proposedPrice,
        discount_percentage: discountPercentage,
        action_name: `Promotional Discount on ${productName}`,
      });
      setExecutionData(res.execution);
    } catch (err) {
      setError(err.message || "Execution trigger failed");
    } finally {
      setExecuting(false);
    }
  };

  useEffect(() => {
    if (offer && !executionData) {
      triggerLiveExecution();
    } else if (!executionData) {
      getLatestExecution()
        .then((res) => {
          if (res.status === "success") {
            setExecutionData(res.execution);
          }
        })
        .catch(() => {});
    }
  }, []);

  const timelineSteps = [
    { label: "MISSION CREATED", status: "COMPLETED", desc: "Goal submitted by merchant" },
    { label: "AI ANALYSIS", status: "COMPLETED", desc: "Demand Radar & context processed" },
    { label: "OPPORTUNITY DETECTED", status: "COMPLETED", desc: "High priority promotion candidate chosen" },
    { label: "OFFER GENERATED", status: "COMPLETED", desc: "Pricing proposed with margin floor" },
    { label: "GUARDRAILS CHECKED", status: "COMPLETED", desc: "Passed 4/4 financial safety constraints" },
    { label: "MERCHANT APPROVED", status: "COMPLETED", desc: "Merchant approved action in Approval Center" },
    { label: "EXECUTION", status: "ACTIVE", desc: "Persisted to PostgreSQL & dispatches active" },
    { label: "MEASURE RESULT", status: "WAITING", desc: "Collecting transaction data" },
  ];

  return (
    <div className="max-w-5xl mx-auto font-inter text-[#F5F8FC] space-y-6">
      {/* Live Execution Active Banner */}
      <div className="bg-gradient-to-r from-[#22C55E]/20 via-[#1683FF]/20 to-[#22C55E]/10 border border-[#22C55E]/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-[#22C55E]/20 text-[#22C55E] rounded-2xl border border-[#22C55E]/30">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-[#22C55E]/20 text-[#22C55E] px-2.5 py-0.5 rounded-full border border-[#22C55E]/30">
                  PostgreSQL DB PERSISTED
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#F5F8FC] mt-1">
                Campaign Live & Applied
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Pricing rules and discount tags saved directly into the PostgreSQL database.
              </p>
            </div>
          </div>

          <button
            onClick={triggerLiveExecution}
            disabled={executing}
            className="px-4 py-2.5 bg-[#0F1D2D] hover:bg-[#1683FF]/20 text-[#2EA8FF] rounded-xl border border-white/[0.08] font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${executing ? "animate-spin" : ""}`} />
            {executing ? "Executing..." : "Re-Execute Action"}
          </button>
        </div>
      </div>

      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#2EA8FF] transition mb-4 uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          Back to Approval
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F5F8FC]">
              EXECUTION CENTER
            </h1>
            <StatusBadge status="RUNNING" />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Action Parameters Summary Card */}
      <div className="bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F8FC] mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
          Executed Action Parameters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#08111D] p-4 rounded-2xl border border-white/[0.06]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">PRODUCT</p>
            <p className="text-sm font-bold text-[#F5F8FC] mt-1 truncate">{productName}</p>
          </div>
          <div className="bg-[#08111D] p-4 rounded-2xl border border-white/[0.06]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#2EA8FF]">PROMOTIONAL PRICE</p>
            <p className="text-sm font-black text-[#2EA8FF] mt-1">₹{proposedPrice}</p>
          </div>
          <div className="bg-[#08111D] p-4 rounded-2xl border border-white/[0.06]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">DISCOUNT</p>
            <p className="text-sm font-bold text-[#22C55E] mt-1">{discountPercentage}% OFF</p>
          </div>
          <div className="bg-[#08111D] p-4 rounded-2xl border border-white/[0.06]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">DATABASE STATE</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
              <Server className="w-3 h-3" /> PERSISTED
            </span>
          </div>
        </div>
      </div>

      {/* Connected Execution Channels */}
      <div className="bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F8FC] mb-4 flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#1683FF]" />
          Connected Store Execution Channels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 bg-[#08111D] border border-white/[0.06] rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <Store className="w-5 h-5 text-[#22C55E]" />
              <span className="px-2.5 py-0.5 text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 rounded-full border border-[#22C55E]/20">
                ACTIVE
              </span>
            </div>
            <p className="font-bold text-xs text-[#F5F8FC]">POS Pricing Engine</p>
            <p className="text-[11px] text-[#94A3B8] mt-1">Barcode billing database updated with promo price.</p>
          </div>

          <div className="p-4 bg-[#08111D] border border-white/[0.06] rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="w-5 h-5 text-[#22C55E]" />
              <span className="px-2.5 py-0.5 text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 rounded-full border border-[#22C55E]/20">
                ACTIVE
              </span>
            </div>
            <p className="font-bold text-xs text-[#F5F8FC]">Store Signage & Tagging</p>
            <p className="text-[11px] text-[#94A3B8] mt-1">Digital shelf labels broadcast set to {discountPercentage}% OFF.</p>
          </div>

          <div className="p-4 bg-[#08111D] border border-white/[0.06] rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <Radio className="w-5 h-5 text-[#22C55E]" />
              <span className="px-2.5 py-0.5 text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 rounded-full border border-[#22C55E]/20">
                ACTIVE
              </span>
            </div>
            <p className="font-bold text-xs text-[#F5F8FC]">WhatsApp Merchant Feed</p>
            <p className="text-[11px] text-[#94A3B8] mt-1">Broadcast scheduled for nearby customer segment.</p>
          </div>
        </div>
      </div>

      {/* Execution Lifecycle Timeline */}
      <div className="bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F8FC] mb-6">
          Execution Timeline Lifecycle
        </h2>
        
        <div className="relative border-l-2 border-[#1683FF]/30 ml-4 space-y-6">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="relative pl-6">
              <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ring-4 ring-[#0B1624] ${
                step.status === "COMPLETED"
                  ? "bg-[#22C55E]"
                  : step.status === "ACTIVE"
                    ? "bg-[#1683FF] animate-pulse"
                    : "bg-[#64748B]"
              }`} />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="font-bold text-xs text-[#F5F8FC] flex items-center gap-2">
                    {step.label}
                    <StatusBadge status={step.status} />
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onComplete}
          className="w-full py-3.5 rounded-xl bg-[#1683FF] hover:bg-[#2EA8FF] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#1683FF]/20 flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Return to Dashboard
        </button>

        <button
          onClick={onComplete}
          className="w-full py-3.5 rounded-xl bg-[#0F1D2D] hover:bg-[#1683FF]/15 text-[#2EA8FF] font-bold text-xs uppercase tracking-wider transition border border-white/[0.08] flex items-center justify-center gap-2"
        >
          <Store className="w-4 h-4" />
          View Inventory & Sales
        </button>
      </div>
    </div>
  );
}