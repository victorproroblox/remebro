import { API_URL } from '../env';
import { getToken, clearAuth } from './auth';

async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearAuth();
    window.location.href = '/logout';
    throw new Error('Unauthorized');
  }
  return res;
}

export const api = {
  get: (p) => apiFetch(p),
  post: (p, body) => apiFetch(p, { method: 'POST', body: JSON.stringify(body) }),
  put: (p, body) => apiFetch(p, { method: 'PUT', body: JSON.stringify(body) }),
  del: (p) => apiFetch(p, { method: 'DELETE' }),
};
