import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Cpu, 
  Database, 
  RotateCw, 
  Play, 
  Home, 
  CloudRain, 
  AlertTriangle,
  Radio,
  User,
  LogIn,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export default function Header({ 
  onSimulateTick, 
  onRefresh, 
  onGoHome, 
  isSimulating, 
  weather, 
  activeAlertsCount 
}) {
  const { user, isAuthenticated, isAdmin, openLogin, logout } = useAuth();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onGoHome}
          className="flex items-center gap-3 text-left group hover:opacity-90 transition-opacity"
          title="Return to Landing Page"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white">
                TRAFFIC<span className="text-cyan-400">FLOW</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">
                AI PREDICTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              “Predict Traffic Problems Before They Happen”
            </p>
          </div>
        </button>
      </div>

      {/* Center Live Badges & Weather */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-medium">
        {/* Live Clock */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono text-cyan-300">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{timeStr || '00:00:00'} IST</span>
        </div>

        {/* Live Weather Widget */}
        {weather && (
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-slate-300">
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            <span>Hyderabad: {weather.temperature}°C</span>
            <span className="text-slate-500">|</span>
            <span className="text-blue-300">{weather.condition} ({weather.rainfallMm} mm)</span>
          </div>
        )}

        {/* Engine Status Pills */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Random Forest ML
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950/70 border border-blue-800/60 text-blue-300 text-[11px]">
            <Database className="w-3 h-3 text-blue-400" />
            MySQL 8.0
          </span>
        </div>
      </div>

      {/* Right Controls & User Session */}
      <div className="flex items-center gap-2.5">
        {/* Auth / User Pill */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-white leading-tight">
                {user.fullName || user.username}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                {isAdmin ? (
                  <span className="text-purple-400 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span>Operator</span>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={openLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}

        <button
          onClick={onSimulateTick}
          disabled={isSimulating}
          className="hidden md:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-xl shadow-sm transition-all"
          title="Manually step the traffic flow simulation forward"
        >
          <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Simulate</span>
        </button>

        <button
          onClick={onRefresh}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Refresh Data"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          onClick={onGoHome}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Landing Page"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
