import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register offline Service Worker for PWA and offline support
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        console.log('Ruler PWA ServiceWorker ready:', registration.scope);
      })
      .catch((err) => {
        console.warn('Ruler ServiceWorker registration skipped:', err);
      });
  });
}
