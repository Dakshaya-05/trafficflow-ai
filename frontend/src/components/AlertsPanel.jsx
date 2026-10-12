import React from 'react';
import { Bell, AlertTriangle, AlertCircle, CloudRain, Check, X } from 'lucide-react';

export default function AlertsPanel({ alerts = [], onDismissAlert }) {
  const getSeverityStyle = (severity, type) => {
    switch (severity?.toUpperCase()) {
      case 'SEVERE':
      case 'HIGH':
        return {
          border: 'border-rose-800/80',
          bg: 'bg-rose-950/40',
          badge: 'bg-rose-950 text-rose-300 border-rose-800',
          iconColor: 'text-rose-400',
        };
      case 'MODERATE':
        return {
          border: 'border-amber-800/80',
          bg: 'bg-amber-950/30',
          badge: 'bg-amber-950 text-amber-300 border-amber-800',
          iconColor: 'text-amber-400',
        };
      default:
        return {
          border: 'border-blue-800/80',
          bg: 'bg-blue-950/30',
          badge: 'bg-blue-950 text-blue-300 border-blue-800',
          iconColor: 'text-blue-400',
        };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'WEATHER_WARNING':
        return <CloudRain className="w-5 h-5 text-blue-400 shrink-0" />;
      case 'INCIDENT':
        return <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-950 border border-amber-800 text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white tracking-wide">
              Actionable Alerts
            </h3>
            <p className="text-xs text-slate-400">
              Live AI warnings and proactive mitigation notices
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {alerts.length} Active
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-10 bg-slate-950/50 rounded-xl border border-slate-800/80">
          <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white">All Clear</h4>
          <p className="text-xs text-slate-400 mt-1">No active high-risk traffic alerts at this moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const style = getSeverityStyle(alert.severity, alert.alertType);
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border ${style.border} ${style.bg} transition-all flex items-start justify-between gap-3 relative`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">{getTypeIcon(alert.alertType)}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${style.badge}`}>
                        {alert.alertType ? alert.alertType.replace('_', ' ') : 'ALERT'}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-white">
                        {alert.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {alert.message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onDismissAlert && onDismissAlert(alert.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors shrink-0"
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
