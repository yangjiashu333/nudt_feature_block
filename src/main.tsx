import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router';
import './index.css';

import { LoginPage } from '@/pages/login';
import { MainLayout } from '@/layouts/main-layout';
import { AuthGuard } from '@/components/auth-guard';
import { DashboardPage } from '@/pages/dashboard';
import { DataUploadPage } from '@/pages/data/upload';
import { DataPreviewPage } from '@/pages/data/preview';
import { OperatorListPage } from '@/pages/operators/list';
import { OperatorConfigPage } from '@/pages/operators/config';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route
          path='/dashboard'
          element={
            <AuthGuard>
              <MainLayout />
            </AuthGuard>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path='data'>
            <Route index element={<Navigate to='upload' />} />
            <Route path='upload' element={<DataUploadPage />} />
            <Route path='preview' element={<DataPreviewPage />} />
          </Route>
          <Route path='operators'>
            <Route index element={<Navigate to='list' />} />
            <Route path='list' element={<OperatorListPage />} />
            <Route path='config' element={<OperatorConfigPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
