import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import OrdersPage from './components/orders/OrdersPage.jsx';
import ProductsPage from './components/productsPage/ProductsPage.jsx';
import ProductCardMain from './components/productCardMain/ProductCardMain.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import Layout from './components/layout/Layout';
import { getCart } from './store/cartSlise.js';
import Cart from './components/cart/Cart.jsx';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCart());
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProductsPage />}></Route>
          <Route path="orders" element={<OrdersPage />}></Route>
          <Route path="cart" element={<Cart />}></Route>
          <Route path=":id" element={<ProductCardMain />}></Route>
          <Route path="/not-found" element={<NotFoundPage />}></Route>
        </Route>
      </Routes>
    </div>
  );
}
