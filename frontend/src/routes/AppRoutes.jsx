import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ProductsPage from '../pages/ProductsPage';
import AddProductPage from '../pages/AddProductPage';
import EditProductPage from '../pages/EditProductPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Protected app routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<AddProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/products/:id/edit" element={<EditProductPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
