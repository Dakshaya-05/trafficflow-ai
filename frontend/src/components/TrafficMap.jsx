import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  AlertTriangle, 
  Clock, 
  Gauge, 
  Users, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';

// Color map according to requirements:
// GREEN = Low, YELLOW = Moderate, ORANGE = High, RED = Severe
const CONGESTION_COLORS = {
  LOW: '#22c55e',       // Green
  MODERATE: '#eab308',  // Yellow
  HIGH: '#f97316',      // Orange
  SEVERE: '#ef4444',    // Red
};

// Fix Leaflet's default marker icons in Vite/bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom incident icons using HTML divIcon
const createIncidentIcon = (type, severity) => {
  const bg = severity === 'SEVERE' || severity === 'HIGH' ? '#ef4444' : '#f59e0b';
  return L.divIcon({
    className: 'custom-incident-icon',
    html: `
      <div style="
        background-color: ${bg};
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: 2px solid white;
        box-shadow: 0 0 10px ${bg};
        font-weight: bold;
        font-size: 12px;
      ">
        ⚠️
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

const createEventIcon = () => {
  return L.divIcon({
    className: 'custom-event-icon',
    html: `
      <div style="
        background-color: #8b5cf6;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: 2px solid white;
        box-shadow: 0 0 10px #8b5cf6;
        font-size: 13px;
      ">
        🎪
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

export default function TrafficMap({ 
  roads = [], 
  incidents = [], 
  events = [], 
  onSelectRoad, 
  selectedRoad 
}) {
  const [viewMode, setViewMode] = useState('predicted'); // 'current' or 'predicted'
  const [forecastHorizon, setForecastHorizon] = useState(30); // 15, 30, 45, 60

  // Hyderabad center coords
  const mapCenter = [17.4350, 78.3900];

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
      {/* Map Control Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/80 shadow-lg">
        {/* Toggle Mode */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setViewMode('current')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'current'
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Current
          </button>
          <button
            onClick={() => setViewMode('predicted')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'predicted'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Forecast</span>
          </button>
        </div>

        {/* Forecast Horizon Pills (when in predicted mode) */}
        {viewMode === 'predicted' && (
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 mr-1.5">Horizon:</span>
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setForecastHorizon(mins)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  forecastHorizon === mins
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                +{mins}m
              </button>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="text-slate-300">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-300">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">Severe</span>
          </div>
        </div>
      </div>

      {/* React Leaflet Map */}
      <div className="w-full h-full flex-1">
        <MapContainer
          center={mapCenter}
          zoom={12}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', minHeight: '520px' }}
        >
          {/* High-contrast dark theme tiles from CartoDB */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Road Polylines */}
          {roads.map((road) => {
            let polyCoords = [];
            try {
              polyCoords = JSON.parse(road.coordinates);
            } catch (e) {
              polyCoords = [[road.centerLat, road.centerLng]];
            }

            const congestion = viewMode === 'predicted' 
              ? (road.predictedCongestion || road.currentCongestion || 'MODERATE')
              : (road.currentCongestion || 'MODERATE');

            const strokeColor = CONGESTION_COLORS[congestion.toUpperCase()] || '#eab308';
            const isSelected = selectedRoad && selectedRoad.id === road.id;

            return (
              <Polyline
                key={`road-${road.id}`}
                positions={polyCoords}
                pathOptions={{
                  color: strokeColor,
                  weight: isSelected ? 9 : 6,
                  opacity: isSelected ? 1.0 : 0.85,
                  dashArray: viewMode === 'predicted' ? (congestion === 'SEVERE' ? '8, 6' : null) : null,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
                eventHandlers={{
                  click: () => onSelectRoad && onSelectRoad(road),
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[240px] text-slate-100">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
                      <h4 className="font-bold text-sm text-cyan-300">{road.name}</h4>
                      <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                        {road.code}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="bg-slate-800/80 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Current Congestion</span>
                        <span className={`font-bold ${
                          road.currentCongestion === 'SEVERE' ? 'text-rose-400' :
                          road.currentCongestion === 'HIGH' ? 'text-orange-400' :
                          road.currentCongestion === 'MODERATE' ? 'text-yellow-400' : 'text-emerald-400'
                        }`}>
                          {road.currentCongestion}
                        </span>
                      </div>

                      <div className="bg-slate-800/80 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Predicted (+30m)</span>
                        <span className={`font-bold ${
                          road.predictedCongestion === 'SEVERE' ? 'text-rose-400' :
                          road.predictedCongestion === 'HIGH' ? 'text-orange-400' :
                          road.predictedCongestion === 'MODERATE' ? 'text-yellow-400' : 'text-emerald-400'
                        }`}>
                          {road.predictedCongestion}
                        </span>
                      </div>

                      <div className="bg-slate-800/80 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Risk Score</span>
                        <span className="font-bold text-white">
                          {road.riskScore != null ? `${road.riskScore}%` : 'N/A'}
                        </span>
                      </div>

                      <div className="bg-slate-800/80 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Avg Speed</span>
                        <span className="font-bold text-white">{road.currentSpeed} km/h</span>
                      </div>
                    </div>

                    {road.factors && road.factors.length > 0 && (
                      <div className="mb-3">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Key Drivers
                        </span>
                        <ul className="text-[11px] space-y-1 text-slate-300">
                          {road.factors.slice(0, 3).map((f, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-cyan-400">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={() => onSelectRoad && onSelectRoad(road)}
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>View Deep Explainable AI</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Popup>
              </Polyline>
            );
          })}

          {/* Incident Markers */}
          {incidents.map((incident) => (
            <Marker
              key={`incident-${incident.id}`}
              position={[incident.latitude, incident.longitude]}
              icon={createIncidentIcon(incident.type, incident.severity)}
            >
              <Popup>
                <div className="p-1 min-w-[220px] text-slate-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                      {incident.type}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{incident.locationName}</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">{incident.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700/80 pt-1.5">
                    <span>Severity: <strong className="text-white">{incident.severity}</strong></span>
                    <span>Status: <strong className="text-emerald-400">{incident.status}</strong></span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Public Event Markers */}
          {events.map((event) => (
            <Marker
              key={`event-${event.id}`}
              position={[event.latitude, event.longitude]}
              icon={createEventIcon()}
            >
              <Popup>
                <div className="p-1 min-w-[220px] text-slate-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      PUBLIC EVENT
                    </span>
                    <span className="text-xs font-bold text-purple-300">{event.name}</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-1">Venue: {event.venue}</p>
                  <p className="text-xs text-purple-200 mb-1 font-semibold">
                    Expected Attendance: {event.expectedAttendance.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Affected Corridors: {event.affectedRoads}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
