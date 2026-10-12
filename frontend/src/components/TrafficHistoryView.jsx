import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Calendar, 
  Car, 
  Gauge, 
  CloudRain, 
  Clock, 
  MapPin, 
  Layers, 
  AlertCircle, 
  X,
  CheckCircle2
} from 'lucide-react';

export default function TrafficHistoryView({ refreshTrigger }) {
  const { isAuthenticated, openLogin, isAdmin } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Selected Record modal for detailed view
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [page, pageSize, selectedLevel, refreshTrigger]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTrafficHistory({
        search: searchTerm,
        level: selectedLevel,
        page,
        size: pageSize,
      });

      setRecords(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError('Could not load traffic records history.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchHistory();
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    try {
      await api.deleteTrafficRecord(id);
      setDeleteConfirmId(null);
      setActionSuccess(`Record #${id} successfully deleted.`);
      setTimeout(() => setActionSuccess(null), 4000);
      fetchHistory();
    } catch (err) {
      alert(err.message || 'Failed to delete record');
    }
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case 'LOW TRAFFIC':
        return {
          pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
        };
      case 'MEDIUM TRAFFIC':
        return {
          pill: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-500',
        };
      case 'HIGH TRAFFIC':
      default:
        return {
          pill: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-500',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls & filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Traffic Prediction History</h2>
            <p className="text-xs text-slate-400 mt-1">
              Search, filter, and review historical AI predictions recorded in MySQL ({totalElements} total records).
            </p>
          </div>

          <button
            onClick={fetchHistory}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold rounded-xl text-slate-300 hover:text-white transition-colors self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            Refresh Table
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Location search */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by location (e.g. Cyber Towers, Banjara Hills)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-20 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Category Filter */}
          <div className="md:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setPage(0);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW TRAFFIC">Low Traffic (Green)</option>
              <option value="MEDIUM TRAFFIC">Medium Traffic (Yellow)</option>
              <option value="HIGH TRAFFIC">High Traffic (Red)</option>
            </select>
          </div>

          {/* Rows per page */}
          <div className="md:col-span-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(0);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Success banner */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {actionSuccess}
        </div>
      )}

      {/* Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">ID / Date</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Vehicle Count</th>
                <th className="px-5 py-3.5">Avg Speed</th>
                <th className="px-5 py-3.5">Weather</th>
                <th className="px-5 py-3.5">Time of Day</th>
                <th className="px-5 py-3.5">Road Type</th>
                <th className="px-5 py-3.5">Predicted Level</th>
                <th className="px-5 py-3.5">Risk Score</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-5 py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading records from database...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-5 py-12 text-center text-slate-500">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                    No traffic prediction records match your query.
                  </td>
                </tr>
              ) : (
                records.map((r) => {
                  const badge = getLevelBadge(r.predictedTrafficLevel);
                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3 font-mono text-slate-400">
                        <div className="font-bold text-slate-300">#{r.id}</div>
                        <div className="text-[10px] text-slate-500">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                        </div>
                      </td>

                      <td className="px-5 py-3 font-medium text-white max-w-[160px] truncate">
                        {r.location}
                      </td>

                      <td className="px-5 py-3 font-mono text-slate-300">
                        {r.vehicleCount} v/h
                      </td>

                      <td className="px-5 py-3 font-mono text-slate-300">
                        {r.averageSpeed} km/h
                      </td>

                      <td className="px-5 py-3 text-slate-300">
                        {r.weatherCondition}
                      </td>

                      <td className="px-5 py-3 text-slate-300">
                        {r.timeOfDay}
                      </td>

                      <td className="px-5 py-3 text-slate-300">
                        {r.roadType}
                      </td>

                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.pill}`}>
                          <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                          {r.predictedTrafficLevel}
                        </span>
                      </td>

                      <td className="px-5 py-3 font-mono font-semibold">
                        <span className={
                          r.riskScore >= 70 ? 'text-rose-400' :
                          r.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
                        }>
                          {r.riskScore ? r.riskScore.toFixed(1) : '40.0'}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRecord(r)}
                            title="View AI details & recommendation"
                            className="p-1.5 bg-slate-800 hover:bg-cyan-950 hover:text-cyan-400 text-slate-400 rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => setDeleteConfirmId(r.id)}
                            title="Delete Record"
                            className="p-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-5 py-4 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing Page <span className="font-bold text-white">{page + 1}</span> of{' '}
            <span className="font-bold text-white">{Math.max(1, totalPages)}</span> ({totalElements} total entries)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0 || loading}
              className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg font-mono font-bold text-cyan-400">
              {page + 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1 || loading}
              className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className={`w-3.5 h-3.5 rounded-full ${getLevelBadge(selectedRecord.predictedTrafficLevel).dot}`} />
              <h3 className="font-bold text-white text-lg">{selectedRecord.location}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Class:</span>
                <span className="font-bold text-white">{selectedRecord.predictedTrafficLevel}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Risk Score:</span>
                <span className="font-bold text-cyan-400 font-mono">{selectedRecord.riskScore?.toFixed(1)} / 100</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Speed:</span>
                <span className="font-bold text-white">{selectedRecord.averageSpeed} km/h</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Vehicle Density:</span>
                <span className="font-bold text-white">{selectedRecord.vehicleCount} vehicles/hr</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                AI Advisory Recommendation:
              </span>
              <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {selectedRecord.recommendation || 'Continuous flow supported across corridors.'}
              </p>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-3 border-t border-slate-800">
              <span>Recorded By: {selectedRecord.createdBy || 'System'}</span>
              <span>{new Date(selectedRecord.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center">
            <Trash2 className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h4 className="font-bold text-white text-base">Delete Traffic Record?</h4>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Are you sure you want to delete record #{deleteConfirmId}? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
