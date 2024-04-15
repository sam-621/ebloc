import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AdminLayout } from '@/components/layout';

import { CreateProductPage, ProductDetailsPage, ProductsPage } from './ui/inventory';
import { LoginPage } from './ui/login';
import { OrderDetailsPage, OrderPages } from './ui/orders/pages';
import { AuthWrapper } from './auth-wrapper';

export const AppRouter = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AuthWrapper />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AdminLayout />}>
            <Route path="/inventory" element={<ProductsPage />} />
            <Route path="/inventory/new" element={<CreateProductPage />} />
            <Route path="/inventory/:slug" element={<ProductDetailsPage />} />
            <Route path="/orders" element={<OrderPages />} />
            <Route path="/orders/:slug" element={<OrderDetailsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
