import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  Trash2, 
  Database, 
  AlertTriangle, 
  RefreshCw, 
  UserCheck, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function AdminDashboardView({ onNavigateToPredict }) {
  const { isAuthenticated, isAdmin, user, openLogin } = useAuth();

  const [usersList, setUsersList] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchAdminData();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [users, stats] = await Promise.all([
        api.getAdminUsers(),
        api.getAdminStats(),
      ]);
      setUsersList(users);
      setAdminStats(stats);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError(err.message || 'Unable to load administrator data. Admin privileges required.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.deleteAdminUser(id);
      setDeleteConfirmId(null);
      setActionMessage(`User account #${id} has been removed.`);
      setTimeout(() => setActionMessage(null), 4000);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Could not delete user.');
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Administrator Access Required</h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          The administration portal is restricted to accounts with the <strong className="text-purple-400">ROLE_ADMIN</strong> role. 
          Please sign in with the system administrator account.
        </p>

        <button
          onClick={openLogin}
          className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-2"
        >
          <ShieldAlert className="w-4 h-4" />
          Sign In as Administrator
        </button>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-left">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Default Admin Credentials:
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-400">
            Username: <span className="text-white">admin</span> | Password: <span className="text-white">admin123</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-purple-950 border border-purple-800 text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">System Administration Console</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              ROLE_ADMIN
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Manage authorized users, inspect database storage health, and govern traffic records.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
          Refresh Directory
        </button>
      </div>

      {/* Success Notification */}
      {actionMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {actionMessage}
        </div>
      )}

      {/* Admin KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Registered Users</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {adminStats?.totalUsers || usersList.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Platform user accounts in MySQL</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Total Traffic Records</span>
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400 font-mono">
            {adminStats?.totalRecords || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Persisted prediction records</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Severe Congestion Cases</span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400 font-mono">
            {adminStats?.highTrafficIncidents || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Flagged HIGH TRAFFIC instances</p>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h3 className="font-bold text-white text-base">User Directory & Roles</h3>
            <p className="text-xs text-slate-400">
              Accounts with authenticated credentials stored in the `users` database table.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {usersList.length} Accounts Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">User ID</th>
                <th className="px-6 py-3.5">Username</th>
                <th className="px-6 py-3.5">Full Name</th>
                <th className="px-6 py-3.5">Email Address</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Registration Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading user directory...
                  </td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                usersList.map((u) => {
                  const isRootAdmin = u.username.toLowerCase() === 'admin';
                  const isSelf = user?.username?.toLowerCase() === u.username.toLowerCase();

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-slate-400">
                        #{u.id}
                      </td>
                      <td className="px-6 py-3.5 font-bold text-white flex items-center gap-2">
                        {u.username}
                        {isSelf && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                            You
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-slate-300">
                        {u.fullName || '—'}
                      </td>
                      <td className="px-6 py-3.5 text-slate-400 font-mono">
                        {u.email}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          u.role === 'ROLE_ADMIN'
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                        }`}>
                          <ShieldCheck className="w-3 h-3" />
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Initial Setup'}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {isRootAdmin ? (
                          <span className="text-[11px] text-slate-600 font-mono italic">
                            Protected Root
                          </span>
                        ) : isSelf ? (
                          <span className="text-[11px] text-slate-600 font-mono italic">
                            Active Session
                          </span>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(u.id)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded-lg transition-colors"
                            title="Remove User Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete User Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center">
            <Trash2 className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h4 className="font-bold text-white text-base">Delete User Account?</h4>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Are you sure you want to delete user account #{deleteConfirmId}? This user will no longer be able to log in.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
