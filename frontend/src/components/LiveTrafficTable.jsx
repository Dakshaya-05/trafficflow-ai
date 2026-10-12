import React, { useState } from 'react';
import { MapPin, Search, ArrowUpDown, ExternalLink, ShieldAlert } from 'lucide-react';

export default function LiveTrafficTable({ roads = [], onSelectRoad }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterZone, setFilterZone] = useState('ALL');

  const zones = ['ALL', ...new Set(roads.map((r) => r.zone))];

  const filteredRoads = roads.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.endLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = filterZone === 'ALL' || r.zone === filterZone;
    return matchesSearch && matchesZone;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Title & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-base text-white tracking-wide">
            Live Traffic Corridors
          </h3>
          <p className="text-xs text-slate-400">
            Real-time speeds, vehicular volumes, and risk projections across Hyderabad
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search roads or zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-48 sm:w-60"
            />
          </div>

          {/* Zone Filter */}
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
          >
            {zones.map((z) => (
              <option key={z} value={z}>
                {z === 'ALL' ? 'All Zones' : z}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Corridor</th>
              <th className="p-3">Zone</th>
              <th className="p-3">Current Flow</th>
              <th className="p-3">Speed</th>
              <th className="p-3">Volume</th>
              <th className="p-3">Predicted (+30m)</th>
              <th className="p-3">Risk</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-200">
            {filteredRoads.map((road) => (
              <tr
                key={road.id}
                className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                onClick={() => onSelectRoad && onSelectRoad(road)}
              >
                <td className="p-3">
                  <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {road.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {road.code} • {road.lengthKm} km
                  </div>
                </td>

                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                    {road.zone}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`font-black uppercase text-[11px] ${
                      road.currentCongestion === 'SEVERE'
                        ? 'text-rose-400'
                        : road.currentCongestion === 'HIGH'
                        ? 'text-orange-400'
                        : road.currentCongestion === 'MODERATE'
                        ? 'text-yellow-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {road.currentCongestion}
                  </span>
                </td>

                <td className="p-3 font-mono font-semibold">
                  {road.currentSpeed} km/h
                </td>

                <td className="p-3 font-mono">
                  {road.currentVolume}{' '}
                  <span className="text-[10px] text-slate-500">veh/h</span>
                </td>

                <td className="p-3">
                  <span
                    className={`font-black uppercase text-[11px] ${
                      road.predictedCongestion === 'SEVERE'
                        ? 'text-rose-400'
                        : road.predictedCongestion === 'HIGH'
                        ? 'text-orange-400'
                        : road.predictedCongestion === 'MODERATE'
                        ? 'text-yellow-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {road.predictedCongestion || 'MODERATE'}
                  </span>
                </td>

                <td className="p-3">
                  <span className="font-bold text-rose-400">
                    {road.riskScore != null ? `${road.riskScore}%` : 'N/A'}
                  </span>
                </td>

                <td className="p-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRoad && onSelectRoad(road);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition-colors"
                    title="Deep AI Inspect"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
