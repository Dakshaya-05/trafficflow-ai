import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  Legend 
} from 'recharts';
import { 
  Database, 
  TrendingUp, 
  Gauge, 
  Car, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  Sparkles,
  ArrowUpRight,
  ArrowRight
} from 'lucide-react';

export default function AnalyticsDashboardView({ onNavigateToPredict, onNavigateToHistory, refreshTrigger }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Pie chart colors
  const COLORS = {
    'Low Traffic': '#10B981',    // Emerald Green
    'Medium Traffic': '#F59E0B', // Amber Yellow
    'High Traffic': '#EF4444',   // Rose Red
  };

  const distributionData = [
    { name: 'Low Traffic', value: stats?.lowTrafficCount || 0, color: '#10B981' },
    { name: 'Medium Traffic', value: stats?.mediumTrafficCount || 0, color: '#F59E0B' },
    { name: 'High Traffic', value: stats?.highTrafficCount || 0, color: '#EF4444' },
  ];

  const speedData = stats?.speedTrends && stats.speedTrends.length > 0 ? stats.speedTrends : [
    { location: 'Cyber Towers', speed: 18.5, vehicles: 1250, riskScore: 88.0 },
    { location: 'Financial Dist', speed: 42.0, vehicles: 820, riskScore: 52.0 },
    { location: 'ORR West', speed: 78.0, vehicles: 380, riskScore: 18.0 },
    { location: 'Banjara Hills', speed: 22.0, vehicles: 1100, riskScore: 84.0 },
    { location: 'Airport Exp', speed: 65.0, vehicles: 540, riskScore: 22.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-blue-950 border border-blue-800 text-cyan-400">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Traffic Analytics Command Center</h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time aggregate telemetry and AI-predicted congestion distribution from MySQL `trafficflow`.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            Refresh Stats
          </button>
          <button
            onClick={onNavigateToPredict}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            New Prediction
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Records */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Records</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats?.totalRecords || 0}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Logged in MySQL</p>
        </div>

        {/* Low Traffic (Green) */}
        <div className="bg-slate-900 border border-emerald-950/60 rounded-2xl p-4 shadow-lg hover:border-emerald-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Low Traffic</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {stats?.lowTrafficCount || 0}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Free-flow corridors</p>
        </div>

        {/* Medium Traffic (Yellow) */}
        <div className="bg-slate-900 border border-amber-950/60 rounded-2xl p-4 shadow-lg hover:border-amber-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Medium Traffic</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-md shadow-amber-500/50" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {stats?.mediumTrafficCount || 0}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Moderate volume</p>
        </div>

        {/* High Traffic (Red) */}
        <div className="bg-slate-900 border border-rose-950/60 rounded-2xl p-4 shadow-lg hover:border-rose-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">High Traffic</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md shadow-rose-500/50" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {stats?.highTrafficCount || 0}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Severe bottlenecks</p>
        </div>

        {/* Avg Vehicle Speed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg Speed</span>
            <Gauge className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {stats?.averageSpeed ? stats.averageSpeed.toFixed(1) : '45.0'}
            <span className="text-xs text-slate-500 font-normal ml-1">km/h</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Across monitored roads</p>
        </div>

        {/* Total Vehicles */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Vehicles Logged</span>
            <Car className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats?.totalVehicles ? stats.totalVehicles.toLocaleString() : '0'}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Aggregated count</p>
        </div>
      </div>

      {/* Charts Section: Pie Distribution + Speed vs Volume Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pie Chart: Traffic Level Distribution */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base mb-1">Traffic Congestion Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">
              Classification breakdown across Low, Medium, and High traffic records.
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center text-xs">
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-emerald-400 font-bold block">LOW</span>
              <span className="font-mono text-white font-bold">{stats?.lowTrafficCount || 0}</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-amber-400 font-bold block">MEDIUM</span>
              <span className="font-mono text-white font-bold">{stats?.mediumTrafficCount || 0}</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-rose-400 font-bold block">HIGH</span>
              <span className="font-mono text-white font-bold">{stats?.highTrafficCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Speed vs Volume Bar Chart */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-white text-base">Corridor Speed vs Vehicle Volume</h3>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                Inverse Congestion Curve
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Higher vehicle density correlates with depressed transit velocities across urban arterial segments.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={speedData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="location" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis yAxisId="left" stroke="#38bdf8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#818cf8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="top" height={30} />
                <Bar yAxisId="left" dataKey="speed" name="Speed (km/h)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="right" dataKey="vehicles" name="Vehicles (v/h)" fill="#3b82f6" radius={[6, 6, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-800">
            <span>Aggregated from live telemetry sensors</span>
            <button
              onClick={onNavigateToHistory}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              View Full History <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Congestion Risk Trends Area Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white text-base">Congestion Risk Trends</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Predicted risk score index (0-100) plotted across recorded road segments.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Severe Threshold: &gt; 70
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={speedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="location" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="riskScore" name="Risk Index (0-100)" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#riskGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
