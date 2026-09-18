import React, { useState } from 'react';
import { Upload, MapPin, Brain, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, FileSpreadsheet, Loader2, Sparkles, Building2, Globe } from 'lucide-react';
import { uploadSalesData, uploadProductEconomics, trainDemandModel, updateMerchantLocation } from '../services/api';

export default function Onboarding({ onComplete, onLogout }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [salesFile, setSalesFile] = useState(null);
  const [economicsFile, setEconomicsFile] = useState(null);
  
  const [salesResult, setSalesResult] = useState(null);
  const [economicsResult, setEconomicsResult] = useState(null);
  const [trainResult, setTrainResult] = useState(null);
  
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("merchant");
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };
  
  const [stepCompleted, setStepCompleted] = useState({
    sales: false,
    economics: false,
    location: false,
    training: false,
  });

  const handleSalesUpload = async () => {
    if (!salesFile) return;
    setLoading(true);
    setError(null);
    try {
      const data = await uploadSalesData(salesFile);
      setSalesResult(data);
      setStepCompleted((prev) => ({ ...prev, sales: true }));
      setTimeout(() => setCurrentStep(1), 800);
    } catch (err) {
      setError(err.message || 'Failed to upload sales data');
    } finally {
      setLoading(false);
    }
  };

  const handleEconomicsUpload = async () => {
    if (!economicsFile) return;
    setLoading(true);
    setError(null);
    try {
      const data = await uploadProductEconomics(economicsFile);
      setEconomicsResult(data);
      setStepCompleted((prev) => ({ ...prev, economics: true }));
      setTimeout(() => setCurrentStep(2), 800);
    } catch (err) {
      setError(err.message || 'Failed to upload product economics');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = async () => {
    if (!city || !latitude || !longitude) {
      setError('Please fill out all location fields');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const latNum = parseFloat(latitude);
      const lonNum = parseFloat(longitude);
      if (isNaN(latNum) || isNaN(lonNum)) throw new Error('Latitude and Longitude must be numbers');
      
      const data = await updateMerchantLocation(city, latNum, lonNum);
      
      const merchantData = localStorage.getItem('merchant');
      if (merchantData) {
        try {
          const parsed = JSON.parse(merchantData);
          parsed.city = city;
          localStorage.setItem('merchant', JSON.stringify(parsed));
        } catch (e) {
          console.error(e);
        }
      }
      
      setStepCompleted((prev) => ({ ...prev, location: true }));
      setTimeout(() => setCurrentStep(3), 800);
    } catch (err) {
      setError(err.message || 'Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  const handleTrainModel = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await trainDemandModel();
      setTrainResult(data);
      setStepCompleted((prev) => ({ ...prev, training: true }));
    } catch (err) {
      setError(err.message || 'Failed to train demand model');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Sales Data', completed: stepCompleted.sales },
    { title: 'Product Economics', completed: stepCompleted.economics },
    { title: 'Location', completed: stepCompleted.location },
    { title: 'Train AI', completed: stepCompleted.training },
  ];

  return (
    <div className="min-h-screen bg-[#050A12] text-[#F5F8FC] flex flex-col items-center py-12 px-4 sm:px-6 font-inter">
      {/* Setup Top Header */}
      <div className="w-full max-w-3xl mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1683FF] to-[#2EA8FF] flex items-center justify-center shadow-lg shadow-[#1683FF]/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-[#F5F8FC]">MISSIONPAY SETUP</span>
            <p className="text-[10px] text-[#94A3B8]">Merchant Onboarding Wizard</p>
          </div>
        </div>
        <button
          onClick={handleGoToLogin}
          className="text-xs font-bold px-3 py-1.5 text-[#94A3B8] hover:text-[#EF4444] bg-[#0B1624] border border-white/[0.08] rounded-xl hover:border-[#EF4444]/30 transition"
        >
          ← Back to Login
        </button>
      </div>

      {/* Progress Steps Indicator - Clickable Tabs */}
      <div className="w-full max-w-3xl mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#0F1D2D] rounded-full z-0"></div>
          
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs border transition-all ${
                step.completed 
                  ? 'bg-[#22C55E]/15 border-[#22C55E] text-[#22C55E]'
                  : idx === currentStep 
                    ? 'bg-[#1683FF] border-[#2EA8FF] text-white shadow-lg shadow-[#1683FF]/30 scale-105'
                    : 'bg-[#0B1624] border-white/[0.08] text-[#64748B] group-hover:border-white/[0.2]'
              }`}>
                {step.completed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={`absolute -bottom-6 text-[10px] uppercase font-bold tracking-wider whitespace-nowrap ${
                idx === currentStep ? 'text-[#2EA8FF]' : step.completed ? 'text-[#22C55E]' : 'text-[#64748B]'
              }`}>
                {step.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Wizard Step Box */}
      <div className="w-full max-w-2xl bg-[#0B1624] rounded-3xl shadow-2xl border border-white/[0.08] overflow-hidden">
        <div className="p-8">
          <div className="mb-4 text-xs font-bold text-[#1683FF] uppercase tracking-widest">
            STEP {currentStep + 1} OF 4
          </div>

          {error && (
            <div className="mb-6 bg-[#EF4444]/10 text-[#EF4444] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#EF4444]/20 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold">{error}</p>
              </div>
              <button
                onClick={handleGoToLogin}
                className="px-3.5 py-1.5 bg-[#EF4444] hover:bg-red-600 text-white rounded-xl text-xs font-bold shrink-0 transition uppercase"
              >
                Go to Login Page
              </button>
            </div>
          )}

          {/* Step 0: Sales Data */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#F5F8FC] mb-1">UPLOAD YOUR SALES DATA</h2>
                <p className="text-xs text-[#94A3B8]">Upload your historical sales CSV file to power MissionPay's ML demand engine.</p>
              </div>

              {!stepCompleted.sales ? (
                <>
                  <label className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-white/[0.08] border-dashed rounded-2xl cursor-pointer bg-[#08111D] hover:border-[#1683FF]/40 hover:bg-[#0F1D2D] transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 text-[#64748B] group-hover:text-[#2EA8FF] mb-3 transition-colors" />
                      <p className="mb-1 text-xs text-[#94A3B8]">
                        <span className="font-bold text-[#F5F8FC]">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[10px] text-[#64748B]">CSV file only</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".csv"
                      onChange={(e) => setSalesFile(e.target.files[0])}
                    />
                  </label>

                  {salesFile && (
                    <div className="bg-[#08111D] border border-white/[0.08] p-4 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileSpreadsheet className="w-5 h-5 text-[#1683FF] shrink-0" />
                        <span className="text-xs font-bold text-[#F5F8FC] truncate">{salesFile.name}</span>
                        <span className="text-[10px] text-[#64748B]">{(salesFile.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <button 
                        onClick={handleSalesUpload}
                        disabled={loading}
                        className="bg-[#1683FF] hover:bg-[#2EA8FF] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload File'}
                      </button>
                    </div>
                  )}

                  <div className="bg-[#08111D] p-4 rounded-2xl text-xs text-[#94A3B8] border border-white/[0.06]">
                    <p className="font-bold text-[#F5F8FC] mb-1">Required Columns:</p>
                    <p className="font-mono text-[11px] bg-[#050A12] text-[#2EA8FF] px-2.5 py-1 rounded-xl border border-white/[0.08] mt-2">
                      PRODUCT_ID, MONTH, UNIT_SALES, PRODUCT_NAME, SUPPLY_TIME, QUANTITY_ON_HAND
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 p-6 rounded-2xl text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#22C55E] mx-auto mb-3" />
                  <h3 className="text-lg font-black text-[#22C55E] mb-1">Sales Data Uploaded!</h3>
                  <p className="text-xs text-[#94A3B8]">
                    {salesResult?.rows_processed || 'Multiple'} rows processed, {salesResult?.rows_saved || 'data'} saved in PostgreSQL.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Product Economics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#F5F8FC] mb-1">UPLOAD PRODUCT ECONOMICS</h2>
                <p className="text-xs text-[#94A3B8]">Upload cost price and discount caps for margin-aware AI decisions.</p>
              </div>

              {!stepCompleted.economics ? (
                <>
                  <label className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-white/[0.08] border-dashed rounded-2xl cursor-pointer bg-[#08111D] hover:border-[#1683FF]/40 hover:bg-[#0F1D2D] transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 text-[#64748B] group-hover:text-[#2EA8FF] mb-3 transition-colors" />
                      <p className="mb-1 text-xs text-[#94A3B8]">
                        <span className="font-bold text-[#F5F8FC]">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[10px] text-[#64748B]">CSV file only</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".csv"
                      onChange={(e) => setEconomicsFile(e.target.files[0])}
                    />
                  </label>

                  {economicsFile && (
                    <div className="bg-[#08111D] border border-white/[0.08] p-4 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileSpreadsheet className="w-5 h-5 text-[#1683FF] shrink-0" />
                        <span className="text-xs font-bold text-[#F5F8FC] truncate">{economicsFile.name}</span>
                        <span className="text-[10px] text-[#64748B]">{(economicsFile.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <button 
                        onClick={handleEconomicsUpload}
                        disabled={loading}
                        className="bg-[#1683FF] hover:bg-[#2EA8FF] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload File'}
                      </button>
                    </div>
                  )}

                  <div className="bg-[#08111D] p-4 rounded-2xl text-xs text-[#94A3B8] border border-white/[0.06]">
                    <p className="font-bold text-[#F5F8FC] mb-1">Required Columns:</p>
                    <p className="font-mono text-[11px] bg-[#050A12] text-[#2EA8FF] px-2.5 py-1 rounded-xl border border-white/[0.08] mt-2">
                      PRODUCT_ID, PRODUCT_NAME, SELLING_PRICE, COST_PRICE, MAX_DISCOUNT_PERCENTAGE
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 p-6 rounded-2xl text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#22C55E] mx-auto mb-3" />
                  <h3 className="text-lg font-black text-[#22C55E] mb-1">Economics Saved!</h3>
                  <p className="text-xs text-[#94A3B8]">
                    {economicsResult?.products_updated || 0} products updated with cost price & discount limits.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#F5F8FC] mb-1">SET BUSINESS LOCATION</h2>
                <p className="text-xs text-[#94A3B8]">Connects live Open-Meteo Weather and Ticketmaster Event APIs for local demand radar.</p>
              </div>

              {!stepCompleted.location ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">City</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Delhi"
                        className="w-full pl-10 pr-4 py-3 bg-[#08111D] border border-white/[0.08] rounded-xl text-sm font-medium text-[#F5F8FC] focus:border-[#1683FF] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">Latitude</label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input 
                          type="number"
                          step="any"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                          placeholder="28.6139"
                          className="w-full pl-10 pr-4 py-3 bg-[#08111D] border border-white/[0.08] rounded-xl text-sm font-medium text-[#F5F8FC] focus:border-[#1683FF] outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">Longitude</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input 
                          type="number"
                          step="any"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                          placeholder="77.2090"
                          className="w-full pl-10 pr-4 py-3 bg-[#08111D] border border-white/[0.08] rounded-xl text-sm font-medium text-[#F5F8FC] focus:border-[#1683FF] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleLocationSubmit}
                    disabled={loading}
                    className="w-full bg-[#1683FF] hover:bg-[#2EA8FF] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Location Settings'}
                  </button>
                </div>
              ) : (
                <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 p-6 rounded-2xl text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#22C55E] mx-auto mb-3" />
                  <h3 className="text-lg font-black text-[#22C55E] mb-1">Location Configured!</h3>
                  <p className="text-xs text-[#94A3B8]">
                    Business location set to {city}. Live weather & event radar operational.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Train AI */}
          {currentStep === 3 && (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-2xl font-black text-[#F5F8FC] mb-1">TRAIN DEMAND AI MODEL</h2>
                <p className="text-xs text-[#94A3B8]">Trains a scikit-learn RandomForestRegressor model on your sales data.</p>
              </div>

              {!stepCompleted.training ? (
                <div className="py-6">
                  <button 
                    onClick={handleTrainModel}
                    disabled={loading}
                    className="group inline-flex items-center justify-center bg-[#08111D] hover:bg-[#0F1D2D] border border-white/[0.08] text-white rounded-3xl p-8 transition-all disabled:opacity-50 shadow-xl"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Brain className={`w-14 h-14 text-[#2EA8FF] ${loading ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
                      <span className="text-base font-bold uppercase tracking-wider text-[#F5F8FC]">
                        {loading ? 'Training Scikit-Learn ML Model...' : 'Train RandomForest Model'}
                      </span>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 p-8 rounded-3xl">
                  <Sparkles className="w-12 h-12 text-[#22C55E] mx-auto mb-3" />
                  <h3 className="text-xl font-black text-[#22C55E] mb-1">AI Model Online & Trained!</h3>
                  <p className="text-xs text-[#94A3B8] mb-6">
                    {trainResult?.model ? `Model: ${trainResult.model}` : 'Demand forecasting intelligence operational.'}
                  </p>
                  <button 
                    onClick={onComplete}
                    className="bg-[#22C55E] hover:bg-emerald-400 text-[#050A12] px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all mx-auto shadow-lg shadow-[#22C55E]/20"
                  >
                    Enter Command Center <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-[#08111D] p-4 sm:px-8 border-t border-white/[0.08] flex items-center justify-between">
          <button 
            onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            disabled={currentStep === 0 || loading}
            className="text-[#94A3B8] hover:text-[#F5F8FC] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {currentStep < 3 && (
            <button 
              onClick={() => setCurrentStep((p) => Math.min(3, p + 1))}
              disabled={loading}
              className="bg-[#1683FF] hover:bg-[#2EA8FF] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-30 transition-all shadow-md shadow-[#1683FF]/20"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
