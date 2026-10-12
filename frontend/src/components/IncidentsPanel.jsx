import React, { useState } from 'react';
import { AlertTriangle, Plus, Clock, MapPin, CheckCircle, Flame, Wrench, CloudRain, Shield } from 'lucide-react';
import { api } from '../services/api';

export default function IncidentsPanel({ incidents = [], roads = [], onIncidentReported }) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'ACCIDENT',
    roadId: roads[0]?.id || 1,
    locationName: '',
    latitude: 17.4425,
    longitude: 78.3580,
    description: '',
    severity: 'HIGH',
  });

  const getIncidentIcon = (type) => {
    switch (type) {
      case 'ACCIDENT':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'ROAD_WORK':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'WEATHER':
        return <CloudRain className="w-4 h-4 text-blue-400" />;
      case 'ROAD_CLOSURE':
        return <Shield className="w-4 h-4 text-purple-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.locationName || !formData.description) return;

    setSubmitting(true);
    try {
      const selectedRoad = roads.find((r) => r.id === Number(formData.roadId));
      const payload = {
        type: formData.type,
        roadId: Number(formData.roadId),
        locationName: formData.locationName,
        latitude: selectedRoad ? selectedRoad.centerLat : formData.latitude,
        longitude: selectedRoad ? selectedRoad.centerLng : formData.longitude,
        description: formData.description,
        severity: formData.severity,
        status: 'ACTIVE',
      };

      const created = await api.reportIncident(payload);
      if (onIncidentReported) {
        onIncidentReported(created);
      }
      setShowReportModal(false);
      setFormData({
        type: 'ACCIDENT',
        roadId: roads[0]?.id || 1,
        locationName: '',
        latitude: 17.4425,
        longitude: 78.3580,
        description: '',
        severity: 'HIGH',
      });
    } catch (err) {
      console.error('Failed to report incident:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-950 border border-rose-800 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white tracking-wide">
              Road Incidents
            </h3>
            <p className="text-xs text-slate-400">
              Active roadway obstructions feeding into the prediction engine
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Report Incident</span>
        </button>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700/80 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-slate-800">
                  {getIncidentIcon(incident.type)}
                </span>
                <span className="font-bold text-xs text-white">
                  {incident.locationName}
                </span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                incident.severity === 'SEVERE' || incident.severity === 'HIGH'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800/80'
                  : 'bg-amber-950 text-amber-300 border border-amber-800/80'
              }`}>
                {incident.severity}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-2 leading-relaxed font-normal">
              {incident.description}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{incident.roadName || 'Connecting Artery'}</span>
              </span>
              <span className="text-emerald-400 font-medium">
                Status: {incident.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <h3 className="font-extrabold text-lg text-white mb-1">Report New Incident</h3>
            <p className="text-xs text-slate-400 mb-4">
              Submitted incidents will immediately alter AI risk factors & predictions.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="ACCIDENT">ACCIDENT</option>
                    <option value="ROAD_WORK">ROAD WORK</option>
                    <option value="WEATHER">WEATHER</option>
                    <option value="EVENT">EVENT</option>
                    <option value="ROAD_CLOSURE">ROAD CLOSURE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Severity</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="HIGH">HIGH</option>
                    <option value="SEVERE">SEVERE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Affected Road</label>
                <select
                  value={formData.roadId}
                  onChange={(e) => setFormData({ ...formData, roadId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  {roads.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Specific Location</label>
                <input
                  type="text"
                  placeholder="e.g. Near Cyber Gateway Exit 2"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <textarea
                  placeholder="Detailed description of blockage, casualties, lanes affected..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-xs font-bold text-white transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Register Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
