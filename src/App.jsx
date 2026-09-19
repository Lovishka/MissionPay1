import React, { useState, useEffect, Component } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateMission from "./pages/CreateMission";
import MissionControl from "./pages/MissionControl";
import Approvals from "./pages/Approvals";
import Execution from "./pages/Execution";
import Onboarding from "./pages/Onboarding";
import { getDataSummary } from "./services/api";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050A12] text-[#F5F8FC] flex flex-col items-center justify-center p-6 text-center font-inter">
          <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] mb-4">
            ⚠️
          </div>
          <h2 className="text-xl font-bold mb-2 text-[#F5F8FC]">Something went wrong</h2>
          <p className="text-xs text-[#94A3B8] max-w-md mb-6">
            {this.state.error?.message || "An unexpected UI error occurred."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-2.5 bg-[#1683FF] hover:bg-[#2EA8FF] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            Refresh MissionPay
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  
  const [needsOnboarding, setNeedsOnboarding] = useState(null);
  const [checkingSetup, setCheckingSetup] = useState(true);

  const [active, setActive] = useState("Dashboard");
  const [mission, setMission] = useState(null);
  const [missionEvaluation, setMissionEvaluation] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setCheckingSetup(false);
      return;
    }
    const checkSetup = async () => {
      setCheckingSetup(true);
      try {
        const completedFlag = localStorage.getItem("onboarding_completed");
        if (completedFlag === "true") {
          setNeedsOnboarding(false);
        } else {
          // New or uncompleted merchant: force needsOnboarding true so they complete all 4 steps
          setNeedsOnboarding(true);
        }
      } catch (err) {
        if (err.message?.includes("Session expired") || err.message?.includes("token") || err.message?.includes("Unauthorized")) {
          handleLogout();
        } else {
          setNeedsOnboarding(true);
        }
      } finally {
        setCheckingSetup(false);
      }
    };
    checkSetup();
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActive("Dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("merchant");
    localStorage.removeItem("onboarding_completed");

    setIsLoggedIn(false);
    setMission(null);
    setActive("Dashboard");
  };

  const handleMissionCreated = (newMission) => {
    setMission(newMission);
    setActive("Mission Control");
  };

  const pageSubtitles = {
    Dashboard: "AI commerce mission intelligence center",
    "Create Mission": "Give MissionPay a business goal to generate strategy",
    "Mission Control": "AI commerce mission workspace",
    Approvals: "Review AI-generated actions before execution",
    Execution: "Real-time execution trace & database persistence",
    Setup: "Merchant data ingestion & ML model setup wizard",
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }
  
  if (checkingSetup) {
    return (
      <div className="min-h-screen bg-[#050A12] text-[#F5F8FC] flex items-center justify-center font-inter">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#1683FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider">Setting up MissionPay Autopilot...</p>
        </div>
      </div>
    );
  }

  if (needsOnboarding) {
    return (
      <Onboarding
        onComplete={() => {
          localStorage.setItem("onboarding_completed", "true");
          setNeedsOnboarding(false);
          setActive("Dashboard");
        }}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050A12] text-[#F5F8FC] font-inter">
      <Sidebar
        active={active}
        setActive={setActive}
        onLogout={handleLogout}
      />

      <main className="min-h-screen lg:ml-64 flex flex-col">
        {/* Top Header Navbar Shell */}
        <Navbar active={active} subtitle={pageSubtitles[active]} />

        {/* Content Body */}
        <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* DASHBOARD */}
          {active === "Dashboard" && (
            <Dashboard
              mission={mission}
              evaluation={missionEvaluation}
              setActive={setActive}
              onMissionCreated={handleMissionCreated}
            />
          )}

          {/* CREATE MISSION */}
          {active === "Create Mission" && (
            <CreateMission
              onMissionCreated={handleMissionCreated}
              setActive={setActive}
            />
          )}

          {/* MISSION CONTROL */}
          {active === "Mission Control" && (
            <MissionControl
              mission={mission}
              onBack={() => setActive("Dashboard")}
              onReviewApproval={() => setActive("Approvals")}
              onEvaluationComplete={setMissionEvaluation}
            />
          )}

          {/* APPROVALS */}
          {active === "Approvals" && (
            <Approvals
              mission={mission}
              evaluation={missionEvaluation}
              setActive={setActive}
            />
          )}

          {/* EXECUTION */}
          {active === "Execution" && (
            <Execution
              mission={mission}
              evaluation={missionEvaluation}
              onBack={() => setActive("Approvals")}
              onComplete={() => setActive("Dashboard")}
            />
          )}
          
          {/* SETUP */}
          {active === "Setup" && (
            <Onboarding onComplete={() => { setNeedsOnboarding(false); setActive("Dashboard"); }} onLogout={handleLogout} />
          )}
        </div>
      </main>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}