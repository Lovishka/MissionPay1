import { useState } from "react";
import { Target, ArrowRight, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import { createMission } from "../services/api";

export default function CreateMission({ onMissionCreated, setActive }) {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateMission = async () => {
    if (!goal.trim()) {
      setError("Please enter a business goal.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await createMission(goal);
      onMissionCreated(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create mission.");
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    "Achieve ₹20,000 in sales today",
    "Clear slow-moving inventory items",
    "Boost weekend sales by 15% with special promotion",
    "Clear monsoon stock with targeted discount"
  ];

  return (
    <div className="max-w-4xl mx-auto py-4 font-inter text-[#F5F8FC]">
      {/* Back Button */}
      <button
        onClick={() => setActive("Dashboard")}
        className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#2EA8FF] mb-6 transition uppercase tracking-wider"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div className="bg-[#0B1624] border border-white/[0.08] shadow-2xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1683FF]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#1683FF]/15 text-[#2EA8FF] border border-[#1683FF]/20 flex items-center justify-center shrink-0 shadow-lg shadow-[#1683FF]/20">
            <Target size={26} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F5F8FC] uppercase tracking-tight">
              WHAT DO YOU WANT TO ACHIEVE?
            </h1>
            <p className="text-xs text-[#94A3B8] font-medium mt-1">
              Give MissionPay a business goal. AI will determine the next actions.
            </p>
          </div>
        </div>

        <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3">
          Enter Your Business Target
        </label>

        <div className="relative">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Example: Mujhe aaj ₹20,000 ki sales karni hain."
            rows={5}
            className="w-full bg-[#08111D] border border-white/[0.08] rounded-2xl p-5 pb-9 text-base sm:text-lg font-medium outline-none focus:border-[#1683FF] focus:ring-1 focus:ring-[#1683FF] transition-all resize-none text-[#F5F8FC] placeholder-[#64748B] shadow-inner"
          />
          <div className="absolute bottom-4 right-5 text-xs text-[#64748B] font-semibold">
            {goal.length} characters
          </div>
        </div>
        
        {/* Preset Chips */}
        <div className="mt-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-2.5">
            Quick Presets — Click to Fill
          </p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setGoal(preset)}
                className="text-xs px-3.5 py-2 bg-[#0F1D2D] hover:bg-[#1683FF]/20 text-[#2EA8FF] font-semibold rounded-xl border border-white/[0.08] hover:border-[#1683FF]/40 transition"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#94A3B8] mt-6 flex items-center gap-2 font-medium">
          <Sparkles className="text-[#2EA8FF] shrink-0" size={16} />
          MissionPay will analyze your business context and coordinate multi-agent AI to achieve this goal.
        </p>

        {error && (
          <div className="mt-6 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="text-[#EF4444] shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-[#EF4444] font-semibold">{error}</p>
          </div>
        )}

        <button
          onClick={handleCreateMission}
          disabled={loading}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-[#1683FF] hover:bg-[#2EA8FF] disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#1683FF]/25"
        >
          {loading ? (
            <>
              <Sparkles size={18} className="animate-spin" />
              <span>AI Agent Team is Analyzing Your Goal...</span>
            </>
          ) : (
            <>
              <span>CREATE MISSION</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}