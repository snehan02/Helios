// Simple client-side auth helpers for routing and dev mode
export const isAuthenticated = () => (typeof window !== 'undefined') && localStorage.getItem('civic_auth') === 'true';

export const setAuthenticated = (value) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('civic_auth', value ? 'true' : 'false');
};

export const clearAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('civic_auth');
  localStorage.removeItem('civic_token');
};

export const setToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem('civic_token', token);
};

export const getToken = () => (typeof window !== 'undefined') ? localStorage.getItem('civic_token') : null;
