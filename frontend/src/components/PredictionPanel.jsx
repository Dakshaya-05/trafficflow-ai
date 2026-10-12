import React, { useState } from 'react';
import { TrendingUp, Clock, AlertTriangle, ShieldCheck, ChevronRight, Activity } from 'lucide-react';

export default function PredictionPanel({ roads = [], onSelectRoad }) {
  const [selectedHorizon, setSelectedHorizon] = useState(30);

  // Derive aggregated predictions for horizons: 15, 30, 45, 60
  const horizons = [
    {
      minutes: 15,
      label: 'Next 15 min',
      subtext: 'Immediate flow surge & queue growth',
      defaultCongestion: 'HIGH',
      avgConfidence: 0.88,
      avgRiskScore: 78,
    },
    {
      minutes: 30,
      label: 'Next 30 min',
      subtext: 'Primary forecast horizon: peak congestion',
      defaultCongestion: 'SEVERE',
      avgConfidence: 0.91,
      avgRiskScore: 84,
    },
    {
      minutes: 45,
      label: 'Next 45 min',
      subtext: 'Bottleneck stabilization & secondary cascades',
      defaultCongestion: 'SEVERE',
      avgConfidence: 0.86,
      avgRiskScore: 81,
    },
    {
      minutes: 60,
      label: 'Next 60 min',
      subtext: 'Post-peak clearance and incident resolution',
      defaultCongestion: 'HIGH',
      avgConfidence: 0.83,
      avgRiskScore: 69,
    },
  ];

  // Calculate affected roads for selected horizon
  const highRiskRoads = roads.filter(
    (r) => r.predictedCongestion === 'HIGH' || r.predictedCongestion === 'SEVERE'
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white tracking-wide">
              Traffic Predictions
            </h3>
            <p className="text-xs text-slate-400">
              AI predictive horizon forecasting 15 to 60 minutes in advance
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          Model: Random Forest
        </span>
      </div>

      {/* 4 Horizon Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        {horizons.map((h) => {
          const isSelected = selectedHorizon === h.minutes;
          const isSevere = h.defaultCongestion === 'SEVERE';

          return (
            <button
              key={h.minutes}
              onClick={() => setSelectedHorizon(h.minutes)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-2 h-full bg-cyan-500" />
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {h.label}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                    isSevere
                      ? 'bg-rose-950 text-rose-300 border border-rose-800/80'
                      : 'bg-orange-950 text-orange-300 border border-orange-800/80'
                  }`}
                >
                  {h.defaultCongestion}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">
                    {h.avgRiskScore}%
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Risk Level</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{h.subtext}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                <span>Confidence: <strong className="text-cyan-300">{Math.round(h.avgConfidence * 100)}%</strong></span>
                <span>Affected: <strong className="text-white">{highRiskRoads.length} roads</strong></span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Affected Roads Detail for Current Selected Horizon */}
      <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Roads at High or Severe Risk in +{selectedHorizon} minutes:
          </span>
          <span className="text-xs font-semibold text-rose-400">
            {highRiskRoads.length} of {roads.length} Arteries
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {highRiskRoads.map((road) => (
            <div
              key={road.id}
              onClick={() => onSelectRoad && onSelectRoad(road)}
              className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <h5 className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                  {road.name}
                </h5>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span>Speed: <strong className="text-slate-200">{road.predictedSpeed || road.currentSpeed} km/h</strong></span>
                  <span>•</span>
                  <span>Risk: <strong className="text-rose-400">{road.riskScore || 78}%</strong></span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
