import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/pages/Home";
import Auth from "../components/pages/Auth";
import Cart from "../components/pages/Cart";
import ProductList from "../components/pages/ProductList";
import ProductDetail from "../components/pages/ProductDetail";
import ProductFilter from "../components/pages/ProductFilter";
import UserProfile from "../components/pages/UserProfile";
import OrderHistory from "../components/pages/OrderHistory";
import Blog from "../components/pages/Blog";
import Condiciones from "../components/pages/Condiciones";
import Nosotros from "../components/pages/Nosotros";
import Navbar from "../components/pages/Navbar";
import Footer from "../components/pages/Footer";
import Header from "../components/pages/Header";

const RouterConfig = () => (
  <Router>
    <Header />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/catalogo" element={<ProductList />} />
      <Route path="/producto/:id" element={<ProductDetail />} />
      <Route path="/filtros" element={<ProductFilter />} />
      <Route path="/perfil" element={<UserProfile />} />
      <Route path="/pedidos" element={<OrderHistory />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/condiciones" element={<Condiciones />} />
      <Route path="/nosotros" element={<Nosotros />} />
    </Routes>
    <Footer />
  </Router>
);

export default RouterConfig;
