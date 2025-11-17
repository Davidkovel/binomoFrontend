export const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchJSON(url, options = {}) {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || data.message || 'Network error');
  }

  return data;
}
