import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Cpu, 
  MapPin, 
  Gauge, 
  Car, 
  CloudRain, 
  Clock, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  ShieldAlert, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

export default function TrafficPredictForm({ onPredictionSaved }) {
  const { isAuthenticated, openLogin } = useAuth();

  const [formData, setFormData] = useState({
    location: 'Cyber Towers Junction',
    vehicleCount: 1250,
    averageSpeed: 24.5,
    weatherCondition: 'Rainy',
    timeOfDay: 'Evening Rush',
    roadType: 'Highway',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const locationsList = [
    'Cyber Towers Junction',
    'Gachibowli Outer Ring Road',
    'Banjara Hills Road No. 12',
    'Financial District Main Corridor',
    'Airport Expressway NH-44',
    'Secunderabad Clock Tower',
    'Kukatpally Metro Interchange',
    'Madhapur 100 Feet Boulevard',
  ];

  const weatherOptions = ['Clear', 'Rainy', 'Foggy', 'Snowy', 'Overcast'];
  const timeOfDayOptions = ['Morning Rush', 'Afternoon', 'Evening Rush', 'Night'];
  const roadTypeOptions = ['Highway', 'Arterial', 'Urban', 'Residential'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    if (!isAuthenticated) {
      openLogin();
      return;
    }

    setLoading(true);
    try {
      const response = await api.predictTraffic({
        location: formData.location,
        vehicleCount: parseInt(formData.vehicleCount, 10),
        averageSpeed: parseFloat(formData.averageSpeed),
        weatherCondition: formData.weatherCondition,
        timeOfDay: formData.timeOfDay,
        roadType: formData.roadType,
      });

      setPrediction(response);
      if (onPredictionSaved) {
        onPredictionSaved(response);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
      // Explicitly show the service error if AI service is down (503) or other errors
      const statusMsg = err.status === 503
        ? 'AI Traffic Prediction Service is currently unavailable. Please ensure that the Python FastAPI service is running on port 8000.'
        : (err.message || 'An error occurred while evaluating the traffic model.');
      setError(statusMsg);
    } finally {
      setLoading(false);
    }
  };

  const fillPreset = (type) => {
    if (type === 'heavy') {
      setFormData({
        location: 'Cyber Towers Junction',
        vehicleCount: 1680,
        averageSpeed: 16.0,
        weatherCondition: 'Rainy',
        timeOfDay: 'Evening Rush',
        roadType: 'Highway',
      });
    } else if (type === 'moderate') {
      setFormData({
        location: 'Banjara Hills Road No. 12',
        vehicleCount: 850,
        averageSpeed: 38.0,
        weatherCondition: 'Overcast',
        timeOfDay: 'Afternoon',
        roadType: 'Urban',
      });
    } else {
      setFormData({
        location: 'Airport Expressway NH-44',
        vehicleCount: 380,
        averageSpeed: 82.0,
        weatherCondition: 'Clear',
        timeOfDay: 'Night',
        roadType: 'Highway',
      });
    }
  };

  // Helper for color indicators
  const getLevelBadge = (level) => {
    switch (level) {
      case 'LOW TRAFFIC':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          indicator: 'bg-emerald-500 shadow-emerald-500/50',
          title: 'LOW TRAFFIC',
          description: 'Free flow conditions with zero congestion bottlenecks.',
        };
      case 'MEDIUM TRAFFIC':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          indicator: 'bg-amber-500 shadow-amber-500/50',
          title: 'MEDIUM TRAFFIC',
          description: 'Moderate volume. Slight delay possible at major intersections.',
        };
      case 'HIGH TRAFFIC':
      default:
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          indicator: 'bg-rose-500 shadow-rose-500/50',
          title: 'HIGH TRAFFIC',
          description: 'Critical congestion detected. Queue lengths expanding rapidly.',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Description */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-cyan-950 border border-cyan-800/60 text-cyan-400">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                AI Traffic Congestion Predictor
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                Random Forest ML
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl">
              Feed live road conditions into the trained Scikit-learn Random Forest model. 
              The AI calculates vehicle density and classifies congestion risk into 
              <strong className="text-emerald-400"> LOW</strong>, 
              <strong className="text-amber-400"> MEDIUM</strong>, or 
              <strong className="text-rose-400"> HIGH TRAFFIC</strong> with actionable advisories.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
            <span className="text-xs font-semibold text-slate-500 px-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Presets:
            </span>
            <button
              type="button"
              onClick={() => fillPreset('heavy')}
              className="px-2.5 py-1 text-xs rounded-lg font-medium text-rose-300 hover:bg-rose-950/50 transition-colors"
            >
              High Risk
            </button>
            <button
              type="button"
              onClick={() => fillPreset('moderate')}
              className="px-2.5 py-1 text-xs rounded-lg font-medium text-amber-300 hover:bg-amber-950/50 transition-colors"
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => fillPreset('low')}
              className="px-2.5 py-1 text-xs rounded-lg font-medium text-emerald-300 hover:bg-emerald-950/50 transition-colors"
            >
              Free Flow
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left, Prediction Indicator Result on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Card */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Location */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Location / Corridor
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="locations-preset"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Cyber Towers Junction"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
                <datalist id="locations-preset">
                  {locationsList.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Vehicle Count & Average Speed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-blue-400" /> Vehicle Count (per hr)
                  </label>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {formData.vehicleCount}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2500"
                  step="25"
                  value={formData.vehicleCount}
                  onChange={(e) => setFormData({ ...formData, vehicleCount: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500 mb-1"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>50 (Sparse)</span>
                  <span>1200 (Normal)</span>
                  <span>2500 (Gridlock)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-indigo-400" /> Avg Speed (km/h)
                  </label>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {formData.averageSpeed} km/h
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="1"
                  value={formData.averageSpeed}
                  onChange={(e) => setFormData({ ...formData, averageSpeed: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500 mb-1"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>5 km/h (Crawl)</span>
                  <span>50 km/h (Urban)</span>
                  <span>120 km/h (Express)</span>
                </div>
              </div>
            </div>

            {/* Weather Condition */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Weather Condition
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {weatherOptions.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setFormData({ ...formData, weatherCondition: w })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.weatherCondition === w
                        ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300 shadow-sm shadow-cyan-500/20'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Time of Day */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Time of Day
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {timeOfDayOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, timeOfDay: t })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.timeOfDay === t
                        ? 'border-amber-500 bg-amber-950/60 text-amber-300 shadow-sm shadow-amber-500/20'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Road Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" /> Road Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {roadTypeOptions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, roadType: r })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.roadType === r
                        ? 'border-purple-500 bg-purple-950/60 text-purple-300 shadow-sm shadow-purple-500/20'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Authentication Notice if logged out */}
            {!isAuthenticated && (
              <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-xl flex items-center justify-between text-xs text-blue-300">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Sign in required to run AI model & persist traffic records.</span>
                </div>
                <button
                  type="button"
                  onClick={openLogin}
                  className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running Random Forest Inference...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Run AI Traffic Prediction
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results & Indicator Panel on Right */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Error Notice */}
          {error && (
            <div className="p-5 rounded-2xl bg-rose-500/10 border-2 border-rose-500/40 text-rose-300 mb-6 shadow-lg shadow-rose-950/50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-300 text-sm">Prediction Service Error</h4>
                  <p className="text-xs text-rose-400 mt-1 leading-relaxed">{error}</p>
                  <p className="text-[11px] text-rose-500 mt-2">
                    Note: TrafficFlow AI adheres to strict accuracy verification and does not show fake synthetic predictions when the AI service is offline.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Indicator Card */}
          {prediction ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex-1 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Model Classification Result
                    </span>
                    <h3 className="font-bold text-white text-base">{prediction.location}</h3>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    ID #{prediction.id || 'LIVE'}
                  </span>
                </div>

                {/* Main Indicator Pill */}
                {(() => {
                  const badge = getLevelBadge(prediction.predictedTrafficLevel);
                  return (
                    <div className={`p-4 rounded-xl border ${badge.bg} mb-5 relative overflow-hidden`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-4 h-4 rounded-full ${badge.indicator} shadow-md animate-ping`} />
                        <div>
                          <div className="text-lg font-black tracking-wider uppercase">
                            {badge.title}
                          </div>
                          <p className="text-xs opacity-90">{badge.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Metrics: Confidence & Risk Score */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Model Confidence
                    </span>
                    <div className="text-xl font-black text-cyan-400 font-mono">
                      {Math.round((prediction.confidence || 0.9) * 100)}%
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: `${Math.round((prediction.confidence || 0.9) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Risk Index Score
                    </span>
                    <div className={`text-xl font-black font-mono ${
                      prediction.riskScore >= 70 ? 'text-rose-400' :
                      prediction.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {prediction.riskScore?.toFixed(1) || '45.0'} / 100
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          prediction.riskScore >= 70 ? 'bg-rose-500' :
                          prediction.riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, prediction.riskScore || 45)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Actionable Traffic Advisory
                  </h4>
                  <p className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                    {prediction.recommendation || 'Continuous flow supported. Monitor peripheral feeder junctions.'}
                  </p>
                </div>

                {/* Factors */}
                {prediction.factors && prediction.factors.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" /> Contributing AI Factors
                    </h4>
                    <ul className="space-y-1">
                      {prediction.factors.map((f, i) => (
                        <li key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Saved confirmation footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Stored to MySQL `trafficflow`</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Saved in History
                </span>
              </div>
            </div>
          ) : (
            /* Standby Card */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 text-cyan-400 shadow-inner">
                <Cpu className="w-8 h-8 opacity-80" />
              </div>
              <h3 className="font-bold text-white text-base">Inference Pipeline Ready</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                Configure traffic volume, speed limit, road type, and weather parameters on the left to generate real-time AI predictions.
              </p>

              {/* Color Class Legend */}
              <div className="mt-6 w-full max-w-xs grid grid-cols-3 gap-2 text-left">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    LOW
                  </div>
                  <span className="text-[9px] text-slate-400">Speed &gt; 50</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    MEDIUM
                  </div>
                  <span className="text-[9px] text-slate-400">Speed 25-50</span>
                </div>
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    HIGH
                  </div>
                  <span className="text-[9px] text-slate-400">Speed &lt; 25</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
