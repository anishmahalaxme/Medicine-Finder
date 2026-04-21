import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './AppShell.jsx';
import SearchMedicinePage from '../pages/SearchMedicinePage.jsx';
import NearbyStoresPage from '../pages/NearbyStoresPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import CategoryBrowserPage from '../pages/CategoryBrowserPage.jsx';
import StoreDetailPage from '../pages/StoreDetailPage.jsx';
import AdminPage from '../pages/AdminPage.jsx';
import ProtectedAdminRoute from './ProtectedAdminRoute.jsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="/find" element={<SearchMedicinePage />} />
        <Route path="/find-medicine" element={<SearchMedicinePage />} />
        <Route path="/categories" element={<CategoryBrowserPage />} />
        <Route path="/nearby" element={<NearbyStoresPage />} />
        <Route path="/stores/:id" element={<StoreDetailPage />} />
        <Route path="/admin" element={<ProtectedAdminRoute><AdminPage /></ProtectedAdminRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

