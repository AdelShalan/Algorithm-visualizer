const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class APIError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

async function request(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new APIError(res.status, body?.error?.message || res.statusText);
  }
  return res.json();
}

export async function fetchAlgorithms() {
  return request('/api/algorithms');
}

export async function fetchAlgorithm(category, id) {
  return request(`/api/algorithms/${category}/${id}`);
}

export async function fetchDocs() {
  return request('/api/docs');
}

export async function fetchDoc(id) {
  return request(`/api/docs/${id}`);
}
