// Use REACT_APP_API_URL in .env, or default to the current hostname for same-network devices
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE = process.env.REACT_APP_API_URL || `http://${hostname}:5000`;
const TOKEN_KEY = 'travelmate_token';

export function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(r) {
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || r.statusText || 'Request failed');
  return data;
}

function handleNetworkError(err) {
  if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
    return new Error('Cannot reach server. Is the backend running at ' + API_BASE + '?');
  }
  return err;
}

export function apiGet(path) {
  return fetch(`${API_BASE}${path}`, { headers: getAuthHeaders() })
    .then(handleResponse)
    .catch(handleNetworkError);
}

export function apiPost(path, body) {
  return fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  })
    .then(handleResponse)
    .catch(handleNetworkError);
}

export default API_BASE;
