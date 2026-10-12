import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CloudRain, 
  Gauge, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  Cell 
} from 'recharts';

export default function AnalyticsPanel({ analyticsData, weather }) {
  if (!analyticsData) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        Loading analytics engine telemetry...
      </div>
    );
  }

  const {
    volumeTrends = [],
    currentVsPredicted = [],
    congestionDistribution = [],
    weatherImpact,
    accuracyMetrics,
  } = analyticsData;

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl text-xs">
          <p className="font-bold text-white mb-1.5">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="font-medium">
              {entry.name}: <strong className="text-white">{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Demonstration Metrics Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Model Evaluation & Accuracy Metrics
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80 uppercase tracking-wider">
                  DEMONSTRATION METRICS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Random Forest Classifier (120 Trees) trained on simulated urban telemetry
              </p>
            </div>
          </div>
        </div>

        {/* 4 Core Accuracy Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-4">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Prediction Accuracy
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-cyan-400">
                {accuracyMetrics?.accuracy || 87.4}%
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Validated</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Precision
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-indigo-400">
                {accuracyMetrics?.precision || 85.2}%
              </span>
              <span className="text-[10px] text-slate-400">Weighted</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Recall
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-purple-400">
                {accuracyMetrics?.recall || 83.8}%
              </span>
              <span className="text-[10px] text-slate-400">Weighted</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              F1-Score
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400">
                {accuracyMetrics?.f1Score || 84.5}%
              </span>
              <span className="text-[10px] text-slate-400">Harmonic Mean</span>
            </div>
          </div>
        </div>

        {/* Feature Importance Attribution Bar */}
        {accuracyMetrics?.featureWeights && (
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Top Model Feature Importances (Gini Impurity)
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(accuracyMetrics.featureWeights).map(([key, val]) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-300 font-medium truncate">{key}</span>
                    <span className="text-cyan-400 font-bold font-mono">
                      {Math.round(val * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                      style={{ width: `${val * 100 * 2.8}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Traffic Volume Over Time (Actual vs Predicted) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-extrabold text-sm text-white">
                Traffic Volume Over Time
              </h4>
              <p className="text-xs text-slate-400">
                Historical flow trajectory & future forecast surge (veh/hr)
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
              Corridor Average
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="predColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="actualVolume"
                  name="Current Flow"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#actualColor)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="predictedVolume"
                  name="Predicted Volume"
                  stroke="#f43f5e"
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#predColor)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Current Speed vs Predicted Speed Comparison */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-extrabold text-sm text-white">
                Current Speed vs Predicted Speed
              </h4>
              <p className="text-xs text-slate-400">
                Speed compression caused by downstream congestion (km/h)
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-rose-300">
              Major Corridors
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentVsPredicted.slice(0, 5)}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="roadName"
                  stroke="#64748b"
                  tick={{ fontSize: 9 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="currentSpeed" name="Current Speed (km/h)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predictedSpeed" name="Predicted Speed (km/h)" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weather Impact & Congestion Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather Impact Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-xl bg-blue-950 border border-blue-800 text-blue-400">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Weather Impact Matrix</h4>
                <p className="text-xs text-slate-400">Rainfall telemetry effect on corridor velocities</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5">Average Speed Drop</span>
                <span className="text-xl font-black text-rose-400">
                  -{weatherImpact?.speedReductionPercent || 21.4}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Due to wet pavement</span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5">Precipitation Rate</span>
                <span className="text-xl font-black text-blue-400">
                  {weatherImpact?.rainfallMm || 14.2} mm/h
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Status: {weatherImpact?.roadSurfaceStatus || 'WET'}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            🌧️ Continuous rainfall across the Hyderabad IT Corridor has decreased road friction coefficients by 28%, causing vehicular headways to widen and average intersection clearance speeds to drop by 4.8 km/h.
          </p>
        </div>

        {/* Congestion Level Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-xl bg-purple-950 border border-purple-800 text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Congestion Distribution</h4>
              <p className="text-xs text-slate-400">Active arterial roads classified by predicted risk</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {congestionDistribution.map((item) => (
              <div key={item.level} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">{item.level}</span>
                  <span className="font-bold text-white font-mono">{item.count} Corridors</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: item.color,
                      width: `${(item.count / 12) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
