import React, { useState, useEffect } from "react";
import { Sparkles, MapPin, Building2, Calendar, TrendingUp, AlertCircle, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Tag } from "lucide-react";
import { getFestivalOptions, analyzeFestivalDemand, createFestivalMission } from "../services/api";

export default function FestivalDemandRadar({ onCreateMission, setActive }) {
  const [options, setOptions] = useState({
    festivals: ["Diwali", "Chhath Puja", "Holi", "Onam", "Gudi Padwa"],
    locations: ["Delhi", "Mumbai", "Jaipur", "Lucknow", "Indore", "Ahmedabad"],
    merchant_types: ["Grocery Store", "Sweet Shop", "Restaurant", "Fashion Retailer", "Jewellery Store"]
  });

  const [selectedFestival, setSelectedFestival] = useState("Diwali");
  const [selectedLocation, setSelectedLocation] = useState("Delhi");
  const [selectedMerchantType, setSelectedMerchantType] = useState("Grocery Store");

  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [creatingMission, setCreatingMission] = useState(false);

  useEffect(() => {
    getFestivalOptions()
      .then((data) => {
        if (data.festivals?.length) {
          setOptions(data);
          if (data.festivals.includes("Diwali")) setSelectedFestival("Diwali");
          else setSelectedFestival(data.festivals[0]);

          if (data.locations.includes("Delhi")) setSelectedLocation("Delhi");
          else setSelectedLocation(data.locations[0]);

          if (data.merchant_types.includes("Grocery Store")) setSelectedMerchantType("Grocery Store");
          else setSelectedMerchantType(data.merchant_types[0]);
        }
      })
      .catch((err) => console.error("Error loading festival options:", err));
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeFestivalDemand({
        festival_name: selectedFestival,
        location: selectedLocation,
        merchant_type: selectedMerchantType
      });
      setForecast(data);
    } catch (err) {
      setError(err.message || "Failed to analyze festival demand");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMission = async () => {
    if (!forecast) return;
    setCreatingMission(true);
    try {
      const missionData = await createFestivalMission({
        festival_name: forecast.festival_name,
        location: forecast.location,
        merchant_type: forecast.merchant_type,
        expected_demand: forecast.expected_demand,
        peak_period: forecast.peak_period,
        recommended_products: forecast.recommended_products,
        reason: forecast.reason
      });

      if (onCreateMission) {
        onCreateMission(missionData);
      } else if (setActive) {
        setActive("Mission Control");
      }
    } catch (err) {
      setError(err.message || "Failed to create festival mission");
    } finally {
      setCreatingMission(false);
    }
  };

  const getMatchBadgeStyle = (level) => {
    if (level === "Exact City Match") return "bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30";
    if (level === "State/Region Match") return "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30";
    return "bg-[#64748B]/15 text-[#94A3B8] border-white/[0.08]";
  };

  return (
    <div className="bg-[#0B1624] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1683FF] to-[#2EA8FF] flex items-center justify-center shadow-lg shadow-[#1683FF]/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#F5F8FC] uppercase tracking-wider flex items-center gap-2">
              FESTIVAL DEMAND RADAR
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Know what your customers are likely to need before the festival begins.
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto text-[10px] uppercase font-bold tracking-wider px-3 py-1 bg-[#1683FF]/15 text-[#2EA8FF] rounded-full border border-[#1683FF]/20">
          Context & Demand Layer
        </span>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Location Dropdown */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#1683FF]" /> Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full bg-[#08111D] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold text-[#F5F8FC] focus:border-[#1683FF] outline-none transition cursor-pointer"
          >
            {options.locations.map((loc) => (
              <option key={loc} value={loc} className="bg-[#08111D] text-[#F5F8FC]">
                📍 {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Merchant Type Dropdown */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#1683FF]" /> Merchant Type
          </label>
          <select
            value={selectedMerchantType}
            onChange={(e) => setSelectedMerchantType(e.target.value)}
            className="w-full bg-[#08111D] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold text-[#F5F8FC] focus:border-[#1683FF] outline-none transition cursor-pointer"
          >
            {options.merchant_types.map((mtype) => (
              <option key={mtype} value={mtype} className="bg-[#08111D] text-[#F5F8FC]">
                🏪 {mtype}
              </option>
            ))}
          </select>
        </div>

        {/* Upcoming Festival Dropdown */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#1683FF]" /> Upcoming Festival
          </label>
          <select
            value={selectedFestival}
            onChange={(e) => setSelectedFestival(e.target.value)}
            className="w-full bg-[#08111D] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold text-[#F5F8FC] focus:border-[#1683FF] outline-none transition cursor-pointer"
          >
            {options.festivals.map((fest) => (
              <option key={fest} value={fest} className="bg-[#08111D] text-[#F5F8FC]">
                🎉 {fest}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-[#1683FF] to-[#2EA8FF] hover:opacity-90 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-[#1683FF]/25"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Analyze Festival Demand
        </button>
      </div>

      {error && (
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 p-4 rounded-2xl flex items-center gap-3 text-xs text-[#EF4444]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Forecast Output Card */}
      {forecast && (
        <div className="mt-6 bg-[#08111D] border border-[#1683FF]/30 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 bg-[#1683FF]/10 text-[#2EA8FF] text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-xl border-l border-b border-[#1683FF]/20">
            {forecast.data_source_label}
          </div>

          {/* Banner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-black text-[#F5F8FC] uppercase tracking-wide">
                  🎉 {forecast.festival_name}
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getMatchBadgeStyle(forecast.match_level)}`}>
                  {forecast.match_level}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                📍 Location: <strong className="text-[#F5F8FC]">{forecast.location}</strong> &nbsp;|&nbsp; Merchant: <strong className="text-[#F5F8FC]">{forecast.merchant_type}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#0B1624] px-4 py-2 rounded-xl border border-white/[0.08] text-right">
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Expected Demand</span>
                <span className="text-sm font-black text-[#22C55E] flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> {forecast.expected_demand}
                </span>
              </div>

              <div className="bg-[#0B1624] px-4 py-2 rounded-xl border border-white/[0.08] text-right">
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Confidence</span>
                <span className="text-sm font-black text-[#2EA8FF]">{forecast.confidence}</span>
              </div>
            </div>
          </div>

          {/* Peak Period & Behavior Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#0B1624] p-3 rounded-xl border border-white/[0.06]">
              <span className="text-[10px] uppercase font-bold text-[#1683FF] block mb-0.5">🔥 Peak Period Window</span>
              <p className="font-semibold text-[#F5F8FC]">{forecast.peak_period}</p>
            </div>
            <div className="bg-[#0B1624] p-3 rounded-xl border border-white/[0.06]">
              <span className="text-[10px] uppercase font-bold text-[#2EA8FF] block mb-0.5">💳 Customer Payment Behavior</span>
              <p className="font-semibold text-[#F5F8FC]">{forecast.payment_behavior}</p>
            </div>
          </div>

          {/* Recommended Product Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F8FC] mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#1683FF]" />
              RECOMMENDED INVENTORY CATEGORIES
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {forecast.recommended_products.map((item, idx) => (
                <div key={idx} className="bg-[#0B1624] border border-white/[0.08] rounded-2xl p-4 space-y-2 hover:border-[#1683FF]/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#F5F8FC] uppercase tracking-wide flex items-center gap-1.5">
                      🛍 {item.category_name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#1683FF]/15 text-[#2EA8FF] rounded-lg">
                      {item.confidence} Confidence
                    </span>
                  </div>

                  <p className="text-[11px] text-[#94A3B8]">{item.action}</p>

                  {item.matched_economics && item.matched_economics.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/[0.06] space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748B] block">DB Product Economics:</span>
                      {item.matched_economics.map((prod, pIdx) => (
                        <div key={pIdx} className="bg-[#08111D] px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-[#F5F8FC] truncate">{prod.product_id}</span>
                          <span className="text-[#94A3B8]">Price: ₹{prod.selling_price} | Cost: ₹{prod.cost_price}</span>
                          <span className="font-bold text-[#22C55E]">Margin: ₹{prod.margin}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reason Section */}
          <div className="bg-[#0B1624] p-4 rounded-2xl border border-white/[0.06] text-xs">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">WHY THIS RECOMMENDATION?</h4>
            <p className="text-[#F5F8FC] font-medium leading-relaxed">{forecast.reason}</p>
          </div>

          {/* Recommended Action Summary */}
          <div className="bg-[#1683FF]/10 border border-[#1683FF]/20 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2EA8FF] block mb-0.5">RECOMMENDED ACTION</span>
              <p className="text-xs font-semibold text-[#F5F8FC]">{forecast.recommended_action}</p>
            </div>

            <button
              onClick={handleCreateMission}
              disabled={creatingMission}
              className="bg-[#22C55E] hover:bg-emerald-400 text-[#050A12] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 shadow-lg shadow-[#22C55E]/20 disabled:opacity-50"
            >
              {creatingMission ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Create Festival Mission
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
