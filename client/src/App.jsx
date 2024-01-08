import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import { UserProvider } from "./context/UserContext";
import ProductDetail from "./components/ProductDetailContainer";
import MainDashboard from "./components/MainDashboard";
import NavBar from "./components/NavBar";
import Cart from "./components/Cart";
import './assets/App.css'
import { CartProvider } from "./context/CartContext";

function App() {

  return (
    <div className="App">
      <UserProvider>
        <CartProvider>
        <BrowserRouter>
        <NavBar></NavBar>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/products"></Route>
            <Route path="/cart" element={<Cart/>}></Route>
            <Route path="/mainDashboard" element={<MainDashboard />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
          </Routes>
        </BrowserRouter>
        </CartProvider>
      </UserProvider>
    </div>
  );
}

export default App;
