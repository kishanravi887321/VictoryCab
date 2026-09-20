import supabase from './supabase';

async function request(url, opts = {}) {
  const session = (await supabase.auth.getSession()).data.session;
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
  const res = await fetch(url, { ...opts, headers });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`);
  return json;
}

const api = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) }),
  del: (url, body) => request(url, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined }),
};

export default api;
