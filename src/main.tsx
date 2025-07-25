import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import Layout from '@/layouts/root-layout';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import LoginPage from './pages/login';
import Dataset from './pages/dataset';
import Feature from './pages/feature';
import User from './pages/user';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dataset" replace />} />
          <Route path="dataset" element={<Dataset />} />
          <Route path="feature" element={<Feature />} />
          <Route path="user" element={<User />} />
        </Route>
        <Route path="/login" element={<LoginPage />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
