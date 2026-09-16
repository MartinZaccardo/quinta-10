const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

function obtenerToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function pedido<T>(path: string, init?: RequestInit): Promise<T> {
  const token = obtenerToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/login';
    throw new Error('No autorizado');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message ?? 'Error en la solicitud');
  }

  return res.json();
}

// Fetcher compatible con SWR: recibe la URL como primer argumento
export const swrFetcher = <T>(path: string): Promise<T> => pedido<T>(path);

const api = {
  get:    <T>(path: string)                    => pedido<T>(path),
  post:   <T>(path: string, body?: unknown)    => pedido<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  patch:  <T>(path: string, body?: unknown)    => pedido<T>(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: <T>(path: string)                    => pedido<T>(path, { method: 'DELETE' }),
};

export default api;
