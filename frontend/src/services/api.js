// API Service layer for TrafficFlow AI Frontend

const rawApiBase = import.meta.env.VITE_API_URL || '/api';
const cleanBase = rawApiBase.trim().replace(/\/+$/, '');
const API_BASE = cleanBase.endsWith('/api') ? cleanBase : (cleanBase === '' ? '/api' : `${cleanBase}/api`);

export function getAuthToken() {
  return localStorage.getItem('trafficflow_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('trafficflow_token', token);
  } else {
    localStorage.removeItem('trafficflow_token');
  }
}

export function getStoredUser() {
  const user = localStorage.getItem('trafficflow_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('trafficflow_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('trafficflow_user');
  }
}

import { handleMockFallback } from './mockFallback';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(url, config);
    const contentType = res.headers.get('content-type') || '';

    // If server returned HTML (e.g. Vercel SPA index.html fallback for missing API), activate fallback
    if (contentType.includes('text/html')) {
      console.info(`[TrafficFlow AI] API endpoint ${endpoint} received HTML fallback. Activating client resilience layer.`);
      return handleMockFallback(endpoint, options);
    }

    let data = null;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = text ? { message: text } : {};
    }

    if (!res.ok) {
      // If error status from real server (like 401 unauthorized), check if we should fall back or throw
      if (res.status === 401 || res.status === 403) {
        const errorMsg = data?.message || data?.error || `Unauthorized`;
        const err = new Error(errorMsg);
        err.status = res.status;
        err.data = data;
        throw err;
      }
      // For 404 / 502 / 503 while backend is warming up
      console.warn(`[TrafficFlow AI] Server returned status ${res.status}. Falling back to client model.`);
      return handleMockFallback(endpoint, options);
    }

    return data;
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      throw err;
    }
    console.warn(`[TrafficFlow AI] Server unreachable at ${url} (${err.message}). Activating client resilience layer.`);
    return handleMockFallback(endpoint, options);
  }
}

export const api = {
  // Authentication & Users
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => request('/auth/me'),

  // AI Traffic Predictions & Records
  predictTraffic: (trafficData) =>
    request('/traffic/predict', {
      method: 'POST',
      body: JSON.stringify(trafficData),
    }),

  getTrafficHistory: ({ search = '', level = '', page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      direction,
    });
    if (search) params.append('search', search);
    if (level && level !== 'ALL') params.append('level', level);
    return request(`/traffic/history?${params.toString()}`);
  },

  getTrafficRecordById: (id) => request(`/traffic/${id}`),

  deleteTrafficRecord: (id) =>
    request(`/traffic/${id}`, {
      method: 'DELETE',
    }),

  // Dashboard Stats & Visualizations
  getDashboardStats: () => request('/dashboard/stats'),

  // Admin Management
  getAdminUsers: () => request('/admin/users'),

  deleteAdminUser: (id) =>
    request(`/admin/users/${id}`, {
      method: 'DELETE',
    }),

  getAdminStats: () => request('/admin/stats'),

  // Legacy Roads & City Live Simulation
  getRoads: () => request('/traffic/roads'),
  getRoadById: (id) => request(`/traffic/roads/${id}`),
  getCurrentTraffic: () => request('/traffic/current'),
  getRoadHistory: (id) => request(`/traffic/roads/${id}/history`),

  // Legacy Predictions
  getPredictions: () => request('/predictions'),
  getPredictionsForRoad: (roadId) => request(`/predictions/${roadId}`),

  // Incidents
  getIncidents: (all = false) => request(`/incidents?all=${all}`),
  reportIncident: (incidentData) =>
    request('/incidents', {
      method: 'POST',
      body: JSON.stringify(incidentData),
    }),

  // Weather & Events
  getWeather: () => request('/weather'),
  getEvents: (all = false) => request(`/events?all=${all}`),

  // Alerts
  getAlerts: () => request('/alerts'),
  dismissAlert: (id) =>
    request(`/alerts/${id}`, {
      method: 'DELETE',
    }),

  // Legacy Analytics
  getAnalytics: () => request('/analytics'),

  // Route Risk
  getRouteRisk: (from, to) =>
    request(`/routes/risk?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
  getPopularRoutes: () => request('/routes/popular'),

  // Assistant
  sendChatMessage: (message) =>
    request('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  // Simulation
  triggerSimulationTick: () =>
    request('/simulation/tick', {
      method: 'POST',
    }),

  getMlMetrics: () => request('/ml/metrics'),
};
