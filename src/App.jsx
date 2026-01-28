import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './Admin/Context/AdminContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/Home';
import ProductsPage from './components/ProdectPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/Cart';
import SearchPage from './pages/SearchPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth
import Login from './Auth/Login';
import Signup from './Auth/Signup';

// Admin
import AdminAddProducts from './Admin/AdminAddProdect';
import AdminHome from './Admin/AdminHome';
import AdminDashboard from './Admin/Dashboard';
import AdminOrders from './Admin/Orders';
import AdminProducts from './Admin/Prodects';
import AdminUsers from './Admin/Users';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AdminProvider>
            <Router>
              <Routes>
                {/* Admin Routes (without Navbar/Footer) */}
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<AdminHome />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="add-product" element={<AdminAddProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>

                {/* All other routes with Navbar/Footer */}
                <Route path="/*" element={
                  <div className="min-h-screen flex flex-col bg-gray-50">
                    <Navbar />
                    <main className="flex-grow pt-16">
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/product/:productId" element={<ProductDetailsPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        
                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        
                        {/* User Routes */}
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                        
                        {/* 404 Page */}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                } />
              </Routes>
              
              {/* Toast/Notification Container */}
              <div id="toast-container" className="fixed bottom-4 right-4 z-50"></div>
            </Router>
          </AdminProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;