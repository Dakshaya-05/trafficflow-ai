import React, { useState, useEffect } from 'react';
import { Navigation, Clock, AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { api } from '../services/api';

export default function RouteRiskPanel() {
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [origin, setOrigin] = useState('Gachibowli');
  const [destination, setDestination] = useState('Hitech City');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPopularRoutes();
  }, []);

  const loadPopularRoutes = async () => {
    try {
      const data = await api.getPopularRoutes();
      setPopularRoutes(data);
      if (data && data.length > 0) {
        setSelectedRoute(data[0]);
      }
    } catch (err) {
      console.warn('Could not load popular routes:', err);
    }
  };

  const handleCalculateRoute = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.getRouteRisk(origin, destination);
      setSelectedRoute(res);
    } catch (err) {
      console.error('Route calculation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white tracking-wide">
              Route Risk & Travel Time Forecasting
            </h3>
            <p className="text-xs text-slate-400">
              Proactive congestion avoidance & dynamic alternative route recommendations
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
          Proactive Guidance
        </span>
      </div>

      {/* Origin & Destination Selection & Presets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">Origin Point</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            placeholder="e.g. Gachibowli"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">Destination Point</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            placeholder="e.g. Hitech City"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleCalculateRoute}
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Analyzing Route...' : 'Analyze Route Risk'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Route Pills */}
      <div>
        <span className="text-xs font-bold text-slate-400 block mb-2">Preset Commute Corridors:</span>
        <div className="flex flex-wrap gap-2">
          {popularRoutes.map((r, idx) => (
            <button
              key={idx}
              onClick={() => {
                setOrigin(r.origin);
                setDestination(r.destination);
                setSelectedRoute(r);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedRoute?.origin === r.origin && selectedRoute?.destination === r.destination
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {r.origin} ➔ {r.destination}
            </button>
          ))}
        </div>
      </div>

      {/* Route Analysis Card */}
      {selectedRoute && (
        <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 space-y-5 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white">
                  {selectedRoute.origin} ➔ {selectedRoute.destination}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({selectedRoute.distanceKm} km)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Primary Corridors: {selectedRoute.primaryCorridors?.join(', ')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
                selectedRoute.predictedRiskLevel === 'SEVERE' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                selectedRoute.predictedRiskLevel === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                Predicted Risk: {selectedRoute.predictedRiskLevel}
              </span>
            </div>
          </div>

          {/* Travel Time Comparison: Current vs Predicted */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Current Travel Time</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-cyan-400">
                  {selectedRoute.currentTravelTimeMinutes} min
                </span>
                <span className="text-xs font-semibold text-slate-400">Live Traffic</span>
              </div>
              <span className="text-xs text-slate-400 block mt-1">
                Risk Score: <strong>{selectedRoute.currentRiskScore || 50}%</strong>
              </span>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-rose-900/50">
              <span className="text-xs text-rose-300 block mb-1 font-semibold">Predicted (+30 min) Travel Time</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-400">
                  {selectedRoute.predictedTravelTimeMinutes} min
                </span>
                <span className="text-xs font-bold text-rose-400">
                  +{selectedRoute.predictedTravelTimeMinutes - selectedRoute.currentTravelTimeMinutes}m delay
                </span>
              </div>
              <span className="text-xs text-slate-400 block mt-1">
                Risk Score: <strong>{selectedRoute.predictedRiskScore || 85}%</strong>
              </span>
            </div>
          </div>

          {/* Contributing Risk Factors */}
          <div>
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Active Risk Factors on Primary Route:
            </h5>
            <div className="space-y-1.5">
              {selectedRoute.riskFactors?.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-rose-400">•</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Route Suggestion */}
          {selectedRoute.alternativeRouteName && (
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-800/60 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Recommended Alternative Route</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                {selectedRoute.alternativeRouteName}
              </h4>
              <div className="flex items-center gap-4 text-xs text-slate-300 mb-3">
                <span>Estimated Time: <strong className="text-emerald-300 font-bold">{selectedRoute.alternativeTravelTimeMinutes} min</strong></span>
                <span>•</span>
                <span>Alternative Risk: <strong className="text-emerald-300 font-bold">{selectedRoute.alternativeRiskLevel}</strong></span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed bg-emerald-950/60 p-3 rounded-lg border border-emerald-900/80">
                💡 {selectedRoute.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
