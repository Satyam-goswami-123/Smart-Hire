// Compatibility fallback for stale service worker / cached index.html targeting main.tsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((unregistered) => {
        if (unregistered) {
          console.log('Unregistered stale service worker');
          window.location.reload();
        }
      });
    }
  });
}

if ('caches' in window) {
  caches.keys().then((names) => {
    for (const name of names) {
      caches.delete(name);
    }
  });
}

import './main.jsx';
