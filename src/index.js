// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './index.css'; // Optional: Your custom styles
import App from './App';
import reportWebVitals from './reportWebVitals';
import { register as registerServiceWorker } from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: For performance measuring
reportWebVitals();

// Enable installable PWA behavior in production builds.
registerServiceWorker();
