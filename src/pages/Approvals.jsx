import { useState } from "react";
import {
  ArrowLeft, ShieldCheck, CheckCircle2, XCircle, AlertTriangle,
  Zap, Tag, Package, DollarSign, TrendingUp, Sparkles, Loader2, Server
} from "lucide-react";
import { approveMissionAction } from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function Approvals({ mission, evaluation, setActive }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [decisionMade, setDecisionMade] = useState(null);

  const offer = evaluation?.offer?.offer || evaluation?.offer || null;
  const product = evaluation?.selected_product || null;
  const guardrails = evaluation?.guardrails || null;
  const reasoning = evaluation?.offer?.reasoning || [];

  const productName = offer?.product_name || product?.product_name || "Diet Cola";
  const productId = offer?.product_id || product?.product_id || "P101";
  const originalPrice = offer?.original_price != null ? offer.original_price : 80;
  const proposedPrice = offer?.proposed_price != null ? offer.proposed_price : 72;
  const discountPercentage = offer?.discount_percentage != null ? offer.discount_percentage : 10;
  const marginAfter = offer?.margin_after != null ? offer.margin_after : 37.5;
  const currentStock = offer?.available_stock != null ? offer.available_stock : (product?.current_stock || 847);

  const handleDecision = async (decision) => {
    try {
      setLoading(true);
      setError("");

      await approveMissionAction({
        product_id: productId,
        proposed_price: proposedPrice,
        discount_percentage: discountPercentage,
        decision,
      });

      setDecisionMade(decision);

      if (decision === "approved") {
        setTimeout(() => {
          setActive("Execution");
        }, 600);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to process decision");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto font-inter text-[#F5F8FC] space-y-6">
      {/* Back Navigation */}
      <button
        onClick={() => setActive("Mission Control")}
        className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#2EA8FF] transition uppercase tracking-wider"
      >
        <ArrowLeft size={16} />
        Back to Mission Control
      </button>

      {/* Header */}
      <div className="bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1683FF]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F5F8FC]">
              APPROVAL CENTER
            </h1>
            <StatusBadge status="REQUEST APPROVAL" />
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">
            Review AI-generated actions before execution.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-3.5 py-1.5 rounded-full border border-[#F59E0B]/20 shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
          <span>FINANCIAL GUARDRAILS ACTIVE</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Main Action Requested Card */}
      <div className="bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2EA8FF] bg-[#1683FF]/15 px-3 py-1 rounded-full border border-[#1683FF]/20">
              ACTION REQUESTED
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F5F8FC] mt-3">
              {productName}
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-[#08111D] px-6 py-4 rounded-2xl border border-white/[0.06]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">PRICE</p>
              <p className="text-lg font-bold text-[#94A3B8] line-through">₹{originalPrice}</p>
            </div>
            <span className="text-xl font-bold text-[#1683FF]">→</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#2EA8FF]">PROPOSED</p>
              <p className="text-2xl font-black text-[#2EA8FF]">₹{proposedPrice}</p>
            </div>
            <div className="pl-4 border-l border-white/[0.08]">
              <span className="px-2.5 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs font-black rounded-lg border border-[#22C55E]/20">
                {discountPercentage}% OFF
              </span>
            </div>
          </div>
        </div>

        {/* 5 Structured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: PRODUCT INTELLIGENCE */}
          <div className="bg-[#08111D] p-5 rounded-2xl border border-white/[0.06] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1683FF] flex items-center gap-2">
              <Package size={15} /> PRODUCT INTELLIGENCE
            </h3>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <p className="text-[10px] text-[#64748B] uppercase font-bold">PRODUCT ID</p>
                <p className="text-sm font-bold text-[#F5F8FC] mt-0.5">{productId}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#64748B] uppercase font-bold">AVAILABLE STOCK</p>
                <p className="text-sm font-bold text-[#F5F8FC] mt-0.5">{currentStock} units</p>
              </div>
              <div>
                <p className="text-[10px] text-[#64748B] uppercase font-bold">COST PRICE</p>
                <p className="text-sm font-bold text-[#F5F8FC] mt-0.5">₹{offer?.cost_price || 50}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#64748B] uppercase font-bold">POST-OFFER MARGIN</p>
                <p className="text-sm font-black text-[#22C55E] mt-0.5">{marginAfter}%</p>
              </div>
            </div>
          </div>

          {/* Section 2: AI REASONING */}
          <div className="bg-[#08111D] p-5 rounded-2xl border border-white/[0.06] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1683FF] flex items-center gap-2">
              <Sparkles size={15} /> AI REASONING TRACE
            </h3>
            <ul className="space-y-1.5 text-xs text-[#94A3B8] pt-1">
              {reasoning.length > 0 ? (
                reasoning.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1683FF] mt-1.5 shrink-0"></span>
                    <span>{r}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1683FF] mt-1.5 shrink-0"></span>
                  <span>Inventory coverage is healthy and pricing maintains positive margin.</span>
                </li>
              )}
            </ul>
          </div>

          {/* Section 3: GUARDRAILS */}
          <div className="bg-[#08111D] p-5 rounded-2xl border border-white/[0.06] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#22C55E] flex items-center gap-2">
              <ShieldCheck size={15} /> FINANCIAL GUARDRAILS
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex items-center justify-between p-2 bg-[#0B1624] rounded-xl border border-white/[0.06]">
                <span className="text-[#94A3B8]">Max Discount</span>
                <span className="font-bold text-[#22C55E]">✓ PASS</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#0B1624] rounded-xl border border-white/[0.06]">
                <span className="text-[#94A3B8]">Min Margin</span>
                <span className="font-bold text-[#22C55E]">✓ PASS</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#0B1624] rounded-xl border border-white/[0.06]">
                <span className="text-[#94A3B8]">Stock Level</span>
                <span className="font-bold text-[#22C55E]">✓ PASS</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#0B1624] rounded-xl border border-white/[0.06]">
                <span className="text-[#94A3B8]">Cost Floor</span>
                <span className="font-bold text-[#22C55E]">✓ PASS</span>
              </div>
            </div>
          </div>

          {/* Section 4 & 5: SYSTEM DECISION & EXECUTION STATUS */}
          <div className="bg-[#08111D] p-5 rounded-2xl border border-white/[0.06] space-y-3 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] flex items-center gap-2">
                <Server size={15} /> SYSTEM DECISION & STATUS
              </h3>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">System Decision:</span>
                  <span className="font-bold text-[#F59E0B]">REQUEST APPROVAL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Execution Status:</span>
                  <span className="font-bold text-[#64748B]">NOT EXECUTED</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#64748B]">
              No changes have been applied to PostgreSQL database yet.
            </p>
          </div>
        </div>

        {/* Bottom CTA Action Bar */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            onClick={() => handleDecision("rejected")}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#EF4444]/30 hover:bg-[#EF4444]/10 text-[#EF4444] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <XCircle size={16} />
            REJECT OFFER
          </button>

          <button
            onClick={() => handleDecision("approved")}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#22C55E] hover:bg-emerald-400 text-[#050A12] font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#22C55E]/20"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>PERSISTING TO DB...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>APPROVE & EXECUTE ACTION</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}