import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './ui/App.jsx';
import { GeoProvider } from './state/geo.jsx';
import { AuthProvider } from './state/auth.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <GeoProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GeoProvider>
    </AuthProvider>
  </React.StrictMode>
);

