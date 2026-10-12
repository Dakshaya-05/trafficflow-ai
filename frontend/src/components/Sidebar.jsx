import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  MapPin, 
  TrendingUp, 
  AlertCircle, 
  Bell, 
  BarChart3, 
  Navigation, 
  Bot,
  ShieldCheck,
  History,
  Cpu,
  ChevronRight,
  Database
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, activeAlertsCount, activeIncidentsCount }) {
  const { isAuthenticated, isAdmin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'predict', label: 'AI Predictor', icon: Cpu, badge: 'AI', badgeColor: 'bg-cyan-600' },
    { id: 'history', label: 'Traffic History', icon: History, badge: null },
    { id: 'roads', label: 'City Map & Sensors', icon: MapPin, badge: null },
    { id: 'incidents', label: 'Live Incidents', icon: AlertCircle, badge: activeIncidentsCount > 0 ? activeIncidentsCount : null, badgeColor: 'bg-rose-500' },
    { id: 'alerts', label: 'Action Alerts', icon: Bell, badge: activeAlertsCount > 0 ? activeAlertsCount : null, badgeColor: 'bg-amber-500' },
    { id: 'routerisk', label: 'Route Risk', icon: Navigation, badge: null },
    { id: 'admin', label: 'Admin Management', icon: ShieldCheck, badge: 'Admin', badgeColor: 'bg-purple-600' },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'Chat', badgeColor: 'bg-blue-600' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
      <div>
        <div className="px-3 pb-3 mb-3 border-b border-slate-800 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Navigation Console
          </p>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60">
            v2.0
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white ${
                      item.badgeColor || 'bg-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-2">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 font-semibold mb-1">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Database Backend</span>
          </div>
          <p className="text-[10px] text-slate-500">
            MySQL 8.0 <span className="text-emerald-400 font-medium">● Connected</span>
          </p>
        </div>

        <div className="text-center text-[10px] text-slate-600">
          TrafficFlow AI &bull; Spring Boot + Python
        </div>
      </div>
    </aside>
  );
}
