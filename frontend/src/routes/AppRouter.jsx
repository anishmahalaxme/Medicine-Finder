import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './AppShell.jsx';
import SearchMedicinePage from '../pages/SearchMedicinePage.jsx';
import NearbyStoresPage from '../pages/NearbyStoresPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="/find" element={<SearchMedicinePage />} />
        <Route path="/find-medicine" element={<SearchMedicinePage />} />
        <Route path="/nearby" element={<NearbyStoresPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

