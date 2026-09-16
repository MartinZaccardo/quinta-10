const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function pedido<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (res.status === 401) {
    window.location.href = '/login';
    throw new Error('No autorizado');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message ?? 'Error en la solicitud');
  }

  return res.json();
}

export const swrFetcher = <T>(path: string): Promise<T> => pedido<T>(path);

const api = {
  get:    <T>(path: string)                    => pedido<T>(path),
  post:   <T>(path: string, body?: unknown)    => pedido<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  patch:  <T>(path: string, body?: unknown)    => pedido<T>(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: <T>(path: string)                    => pedido<T>(path, { method: 'DELETE' }),
};

export default api;
