import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TrafficMap from '../components/TrafficMap';
import PredictionPanel from '../components/PredictionPanel';
import AlertsPanel from '../components/AlertsPanel';
import IncidentsPanel from '../components/IncidentsPanel';
import RouteRiskPanel from '../components/RouteRiskPanel';
import AssistantDrawer from '../components/AssistantDrawer';
import LiveTrafficTable from '../components/LiveTrafficTable';
import RoadDetailModal from '../components/RoadDetailModal';
import AnalyticsDashboardView from '../components/AnalyticsDashboardView';
import TrafficPredictForm from '../components/TrafficPredictForm';
import TrafficHistoryView from '../components/TrafficHistoryView';
import AdminDashboardView from '../components/AdminDashboardView';
import { api } from '../services/api';
import { 
  Bot, 
  RefreshCw, 
  AlertTriangle, 
  CloudRain, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Activity 
} from 'lucide-react';

export default function DashboardPage({ initialTab = 'dashboard', onGoHome }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [roads, setRoads] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, []);

  // Background polling every 15 seconds for simulation updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRoadsAndAlerts();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [roadsData, incidentsData, alertsData, weatherData, eventsData] =
        await Promise.allSettled([
          api.getRoads(),
          api.getIncidents(),
          api.getAlerts(),
          api.getWeather(),
          api.getEvents(),
        ]);

      if (roadsData.status === 'fulfilled') setRoads(roadsData.value || []);
      if (incidentsData.status === 'fulfilled') setIncidents(incidentsData.value || []);
      if (alertsData.status === 'fulfilled') setAlerts(alertsData.value || []);
      if (weatherData.status === 'fulfilled') setWeather(weatherData.value || null);
      if (eventsData.status === 'fulfilled') setEvents(eventsData.value || []);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoadsAndAlerts = async () => {
    try {
      const [roadsRes, alertsRes] = await Promise.allSettled([
        api.getRoads(),
        api.getAlerts(),
      ]);
      if (roadsRes.status === 'fulfilled') setRoads(roadsRes.value || []);
      if (alertsRes.status === 'fulfilled') setAlerts(alertsRes.value || []);
    } catch (err) {
      console.warn('Polling error:', err);
    }
  };

  const handleSimulateTick = async () => {
    setIsSimulating(true);
    try {
      await api.triggerSimulationTick();
      await fetchAllData();
      setRefreshCount((prev) => prev + 1);
    } catch (err) {
      console.error('Simulation step error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handlePredictionSaved = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const handleDismissAlert = async (id) => {
    try {
      await api.dismissAlert(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
    }
  };

  const handleIncidentReported = (newIncident) => {
    setIncidents((prev) => [newIncident, ...prev]);
    fetchRoadsAndAlerts();
  };

  const handlePredictionUpdated = (updatedRoad) => {
    setRoads((prev) => prev.map((r) => (r.id === updatedRoad.id ? updatedRoad : r)));
    setSelectedRoad(updatedRoad);
    fetchRoadsAndAlerts();
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Application Header */}
      <Header
        onSimulateTick={handleSimulateTick}
        onRefresh={() => {
          fetchAllData();
          setRefreshCount((prev) => prev + 1);
        }}
        onGoHome={onGoHome}
        isSimulating={isSimulating}
        weather={weather}
        activeAlertsCount={alerts.length}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeAlertsCount={alerts.length}
          activeIncidentsCount={incidents.length}
        />

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          
          {/* TAB 1: ANALYTICS DASHBOARD */}
          {activeTab === 'dashboard' && (
            <AnalyticsDashboardView
              onNavigateToPredict={() => setActiveTab('predict')}
              onNavigateToHistory={() => setActiveTab('history')}
              refreshTrigger={refreshCount}
            />
          )}

          {/* TAB 2: AI TRAFFIC PREDICTOR FORM */}
          {activeTab === 'predict' && (
            <TrafficPredictForm
              onPredictionSaved={handlePredictionSaved}
            />
          )}

          {/* TAB 3: TRAFFIC HISTORY */}
          {activeTab === 'history' && (
            <TrafficHistoryView
              refreshTrigger={refreshCount}
            />
          )}

          {/* TAB 4: CITY MAP & SENSORS */}
          {activeTab === 'roads' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Interactive Urban Traffic Map</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Visual GIS representation of monitored corridors, live accidents, and public events in Hyderabad.
                    </p>
                  </div>
                </div>

                <div className="h-[520px] rounded-xl overflow-hidden border border-slate-800">
                  <TrafficMap
                    roads={roads}
                    incidents={incidents}
                    events={events}
                    onSelectRoad={(road) => setSelectedRoad(road)}
                    selectedRoad={selectedRoad}
                  />
                </div>
              </div>

              <LiveTrafficTable
                roads={roads}
                onSelectRoad={(road) => setSelectedRoad(road)}
              />
            </div>
          )}

          {/* TAB 5: LIVE INCIDENTS */}
          {activeTab === 'incidents' && (
            <IncidentsPanel
              incidents={incidents}
              roads={roads}
              onIncidentReported={handleIncidentReported}
            />
          )}

          {/* TAB 6: ACTION ALERTS */}
          {activeTab === 'alerts' && (
            <AlertsPanel
              alerts={alerts}
              onDismissAlert={handleDismissAlert}
            />
          )}

          {/* TAB 7: ROUTE RISK */}
          {activeTab === 'routerisk' && (
            <RouteRiskPanel />
          )}

          {/* TAB 8: ADMIN MANAGEMENT */}
          {activeTab === 'admin' && (
            <AdminDashboardView
              onNavigateToPredict={() => setActiveTab('predict')}
            />
          )}

          {/* TAB 9: AI ASSISTANT DIRECT VIEW */}
          {activeTab === 'assistant' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Conversational Traffic Assistant</h2>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                TrafficFlow AI features an intelligent natural language copilot that analyzes current congestions, weather, and incidents across corridors.
              </p>
              <button
                onClick={() => setIsAssistantOpen(true)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Launch AI Assistant Drawer
              </button>
            </div>
          )}

        </main>
      </div>

      {/* Floating AI Assistant Chat Button (Always accessible) */}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold p-3.5 rounded-full shadow-2xl shadow-cyan-500/30 hover:scale-110 transition-all flex items-center gap-2 group"
        title="Open TrafficFlow AI Assistant"
      >
        <Bot className="w-5 h-5 text-white animate-bounce" />
        <span className="text-xs pr-1 font-bold">Ask AI Bot</span>
      </button>

      {/* Conversational Assistant Drawer */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Road Deep-Dive Modal (Explainable AI popup) */}
      {selectedRoad && (
        <RoadDetailModal
          road={selectedRoad}
          onClose={() => setSelectedRoad(null)}
          onPredictionUpdated={handlePredictionUpdated}
        />
      )}
    </div>
  );
}
