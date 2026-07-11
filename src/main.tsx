import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const STORAGE_KEY = 'mi-recuperacion-lumbar-state-v1';

function applyInitialTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const theme = saved?.preferences?.theme || 'light';
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const dark = theme === 'dark' || (theme === 'system' && prefersDark);
    document.documentElement.classList.toggle('theme-dark', dark);
    document.documentElement.classList.toggle('theme-light', !dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch {
    document.documentElement.classList.add('theme-light');
    document.documentElement.style.colorScheme = 'light';
  }
}

applyInitialTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
} else if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations?.().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  }).catch(() => undefined);
}
