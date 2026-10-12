import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  ShieldAlert, 
  Navigation, 
  Sparkles, 
  Bot, 
  Radio, 
  ArrowRight, 
  MapPin, 
  Cpu, 
  CloudRain, 
  Zap,
  BarChart3,
  Layers
} from 'lucide-react';

export default function LandingPage({ onOpenDashboard, onExplorePredictions }) {
  const featureCards = [
    {
      icon: TrendingUp,
      title: 'AI Traffic Prediction',
      description:
        'Forecast congestion 15, 30, 45, and 60 minutes before gridlock forms using trained machine learning models.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Radio,
      title: 'Real-Time Telemetry',
      description:
        'Continuous simulated sensor streams tracking vehicle speed, volume surges, and corridor capacity.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Sparkles,
      title: 'Explainable AI (XAI)',
      description:
        'Transparent reasoning explaining WHY traffic will build up: volume surges, rain friction, incidents, or concerts.',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      icon: Navigation,
      title: 'Route Risk Analysis',
      description:
        'Compare travel times and risk scores across origin-destination pairs with automatic alternative corridor suggestions.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: ShieldAlert,
      title: 'Smart Proactive Alerts',
      description:
        'Actionable notifications warning city operators and commuters before secondary bottle-necks materialize.',
      color: 'from-amber-500 to-rose-600',
    },
    {
      icon: Bot,
      title: 'Conversational Assistant',
      description:
        'Natural-language chatbot answering queries about rain effects, bottleneck causes, and optimal travel windows.',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-wider text-white">
            TRAFFIC<span className="text-cyan-400">FLOW</span> AI
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDashboard}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Predictive Traffic Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-4">
            TRAFFIC<span className="text-cyan-400">FLOW</span> AI
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-cyan-300 mb-4">
            “Predict Traffic Problems Before They Happen”
          </p>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal mb-8">
            Smarter predictions. Smoother journeys. Greener cities.
            <br className="hidden sm:inline" />
            Forecasting urban congestion 15–60 minutes in advance with transparent explainable AI.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenDashboard}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-2.5"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExplorePredictions}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Explore Predictions</span>
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 p-6 rounded-2xl transition-all hover:translate-y-[-2px] shadow-lg group relative overflow-hidden"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.color} p-0.5 mb-4 shadow-md`}>
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Demonstration Disclaimer Banner */}
        <div className="bg-amber-950/30 border border-amber-800/60 rounded-2xl p-5 max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Important Demonstration Disclaimer</span>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed max-w-2xl mx-auto">
            This application uses simulated traffic, weather, incident, and event data for demonstration purposes in the Hyderabad metropolitan area. Predictions should not be used for real-world emergency or traffic-control decisions.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <p>© 2026 TrafficFlow AI • Predictive Traffic Management System</p>
      </footer>
    </div>
  );
}
