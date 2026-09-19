import { useState } from "react";
import { AlertCircle, Loader2, UserPlus, LogIn, Store, ShieldCheck } from "lucide-react";
import { registerUser } from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (mode === "register") {
        if (!businessName.trim()) {
          throw new Error("Business name is required for registration");
        }
        data = await registerUser({
          email,
          password,
          business_name: businessName,
        });
      } else {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || "Login failed");
        }
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem(
        "merchant",
        JSON.stringify({
          merchant_id: data.merchant_id,
          business_name: data.business_name,
          city: data.city || null,
          email: data.email,
        })
      );

      onLogin(data);
    } catch (err) {
      setError(err.message || (mode === "register" ? "Registration failed" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050A12] flex items-center justify-center px-6 relative overflow-hidden font-inter text-[#F5F8FC]">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#1683FF]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#2EA8FF]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#0B1624] backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/[0.08] relative overflow-hidden">
          {/* Subtle card top highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1683FF] to-transparent"></div>

          <div className="mb-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-tr from-[#1683FF] to-[#2EA8FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1683FF]/30">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-black tracking-tight text-[#F5F8FC]">
              MISSION<span className="text-[#1683FF]">PAY</span>
            </h1>
            <p className="text-[#94A3B8] font-medium mt-1 text-xs uppercase tracking-wider">
              Local Commerce Autopilot
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#08111D] rounded-xl mb-6 border border-white/[0.06]">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === "login"
                  ? "bg-[#0F1D2D] text-[#2EA8FF] shadow-sm border border-white/[0.08]"
                  : "text-[#94A3B8] hover:text-[#F5F8FC]"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === "register"
                  ? "bg-[#0F1D2D] text-[#2EA8FF] shadow-sm border border-white/[0.08]"
                  : "text-[#94A3B8] hover:text-[#F5F8FC]"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              CREATE ACCOUNT
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#1683FF]" />
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Sakuja Traders, Apex Retail"
                  required
                  className="w-full px-4 py-3 bg-[#08111D] border border-white/[0.08] rounded-xl outline-none focus:border-[#1683FF] focus:ring-1 focus:ring-[#1683FF] transition-all text-[#F5F8FC] placeholder-[#64748B] text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="merchant@example.com"
                required
                className="w-full px-4 py-3 bg-[#08111D] border border-white/[0.08] rounded-xl outline-none focus:border-[#1683FF] focus:ring-1 focus:ring-[#1683FF] transition-all text-[#F5F8FC] placeholder-[#64748B] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "At least 8 characters" : "Enter password"}
                required
                minLength={mode === "register" ? 8 : 1}
                className="w-full px-4 py-3 bg-[#08111D] border border-white/[0.08] rounded-xl outline-none focus:border-[#1683FF] focus:ring-1 focus:ring-[#1683FF] transition-all text-[#F5F8FC] placeholder-[#64748B] text-sm"
              />
            </div>

            {error && (
              <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-xl p-3.5 text-xs flex items-start gap-2.5 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#1683FF] hover:bg-[#2EA8FF] text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#1683FF]/25 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{mode === "register" ? "Creating Merchant..." : "Authenticating..."}</span>
                </>
              ) : mode === "register" ? (
                "Register Merchant & Start Onboarding"
              ) : (
                "Sign In to Autopilot"
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-[#64748B] text-xs mt-6 font-medium">
          Powered by AI · Secured by PostgreSQL
        </p>
      </div>
    </div>
  );
}