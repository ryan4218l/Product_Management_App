import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
// import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import "./App.css";
import { AppProvider } from "./contexts/AppContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="App">
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    {/*  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />*/}
                    <Route path="/admin" element={<AdminDashboard />} />
                    {/* <Route path="/admin/products" element={<AdminProducts />} /> */}
                  </Routes>
                </main>
                <Toaster position="top-right" />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
