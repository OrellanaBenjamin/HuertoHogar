import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/pages/Navbar";
import Cart from "./components/pages/Cart";
import Home from "./components/pages/Home";
import ProductFilter from "./components/pages/ProductFilter";
import Auth from "./components/pages/Auth";
import OrderHistory from "./components/pages/OrderHistory";
import OrderConfirmation from "./components/pages/OrderConfirmation";
import Condiciones from "./components/pages/Condiciones";
import UserProfile from "./components/pages/UserProfile";
import Blog from "./components/pages/Blog";
import Nosotros from "./components/pages/Nosotros";
import Footer from "./components/pages/Footer";
import AdminOrders from "./components/pages/AdminOrders";
import { collection, addDoc, db, auth } from "./config/firebase";
import ProductDetail from "./components/pages/ProductDetail";
import { useParams } from "react-router-dom";
import CheckoutPayment from "./components/pages/CheckoutPayment";
import { getDoc, doc } from "firebase/firestore";
import AdminCatalog from "./components/pages/AdminCatalog";
import AdminReviews from "./components/pages/AdminReviews";
import AdminReports from "./components/pages/AdminReports";



function ProductDetailWrapper({ productos, addToCart }) {
  const { id } = useParams();
  const producto = productos.find(p => p.id === id);
  return <ProductDetail producto={producto} addToCart={addToCart} />;
}

const productosIniciales = [
  { id: "FR001", name: "Manzanas Fuji", category: "Frutas Frescas", precio: 1200, stock: 150, image: "/img/manzana.jpg", desc: "Manzanas crujientes y dulces, perfectas para snack." },
  { id: "FR002", name: "Naranjas Valencia", category: "Frutas Frescas", precio: 1000, stock: 200, image: "/img/naranjas.jpg", desc: "Naranjas jugosas para jugo y postres." },
  { id: "FR003", name: "Plátanos Cavendish", category: "Frutas Frescas", precio: 800, stock: 250, image: "/img/platano.jpg", desc: "Plátanos maduros y listos para comer." },
  { id: "VR001", name: "Zanahorias Orgánicas", category: "Verduras Orgánicas", precio: 900, stock: 100, image: "/img/zanahoria.jpg", desc: "Zanahorias llenas de vitamina A y fibra." },
  { id: "VR002", name: "Espinacas Frescas", category: "Verduras Orgánicas", precio: 700, stock: 80, image: "/img/espinaca.jpg", desc: "Hojas de espinaca frescas para cocinar." },
  { id: "VR003", name: "Pimientos Tricolores", category: "Verduras Orgánicas", precio: 1500, stock: 120, image: "/img/pimientos.jpg", desc: "Pimientos coloridos para ensaladas y wok." },
  { id: "PO001", name: "Miel Orgánica", category: "Productos Orgánicos", precio: 5000, stock: 50, image: "/img/miel.jpg", desc: "Miel pura de productores locales." },
  { id: "VR008", name: "Lechuga Hidropónica", category: "Verduras Orgánicas", precio: 650, stock: 80, origen: "Región Metropolitana", desc: "Lechuga fresca, cultivada con técnicas hidropónicas y libre de pesticidas. Perfecta para ensaladas.", image: "/img/lechuga.jpg" },
  { id: "PO002", name: "Tierra Orgánica Universal", category: "Productos Orgánicos", precio: 3400, stock: 60, origen: "Productores del Sur", desc: "Saco de tierra mejorada, ideal para huertos y macetas. Libre de químicos agresivos.", image: "/img/tierra.jpg" },
  { id: "PO003", name: "Tierra de Hoja Premium", category: "Productos Orgánicos", precio: 3900, stock: 55, origen: "Región del Biobío", desc: "Tierra de Hoja de alta calidad, especial para cultivos exigentes y maceteros.", image: "/img/tierrahoja.jpg" }
];

function App() {
  const [user, setUser] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [productos] = useState(productosIniciales);

  useEffect(() => {
  const listener = onAuthStateChanged(auth, async (authUser) => {
    if (authUser) {
      const userDoc = await getDoc(doc(db, "usuarios", authUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      setUser({ ...authUser, ...userData }); 
    } else {
      setUser(null);
    }
  });
  return () => listener();
}, []);

  const stockActual = productos.reduce((acc, prod) => {
    const carritoItem = carrito.find(item => item.id === prod.id);
    acc[prod.id] = prod.stock - (carritoItem ? carritoItem.qty : 0);
    return acc;
  }, {});

  const handleAddToCart = (id, qty) => {
    setCarrito(prev => {
      const found = prev.find(item => item.id === id);
      if (found) {
        const prodStock = stockActual[id] || 0;
        if (found.qty + qty <= prodStock) {
          return prev.map(item =>
            item.id === id ? { ...item, qty: item.qty + qty } : item
          );
        } else {
          alert("No hay suficiente stock disponible.");
          return prev;
        }
      }
      if (qty <= stockActual[id]) {
        return [...prev, { id, qty }];
      } else {
        alert("No hay suficiente stock disponible.");
        return prev;
      }
    });
  };

  const handleRemove = id => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const handleChangeQty = (id, qty) => {
    setCarrito(prev =>
      prev.map(item => {
        const prodStock = stockActual[id] + item.qty;
        if (qty <= prodStock && qty > 0) {
          return item.id === id ? { ...item, qty: qty } : item;
        }
        return item;
      })
    );
  };

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route
          path="/catalogo"
          element={
            <ProductFilter
              productos={productos}
              addToCart={handleAddToCart}
            />
          }
        />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/producto/:id"
          element={<ProductDetailWrapper productos={productos} addToCart={handleAddToCart} />}
        />

        <Route
          path="/cart"
          element={
            <Cart
              carrito={carrito}
              productos={productos}
              onRemove={handleRemove}
              onChangeQty={handleChangeQty}
              user={user}
            />
          }
        />

        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/historial" element={<OrderHistory productos={productos} />} />
        <Route path="/confirmacion/:orderId" element={<OrderConfirmation productos={productos} />} />
        <Route path="/pago/:orderId" element={<CheckoutPayment />} />
        <Route path="/admin/orders" element={<AdminOrders productos={productos} />} />
        <Route path="/admin/catalog" element={<AdminCatalog productos={productos} />} />
        <Route path="/admin/reviews" element={<AdminReviews productos={productos} />} />
        <Route path="/admin/reports" element={<AdminReports productos={productos} />} />
        <Route path="/condiciones" element={<Condiciones />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/nosotros" element={<Nosotros />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
