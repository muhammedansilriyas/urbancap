import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

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
import Login from './Auth/Login';

import Signup from './Auth/Signup';
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // You can implement authentication check here
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    window.location.href = '/account';
    return null;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Navbar />
              <main className="grow pt-16">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/product/:productId" element={<ProductDetailsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/account" element={
                    <AccountPage />

                  } />
                  <Route path='/login' element={
                    <Login/>
                  }/>
                  <Route path='/signup' element={
                    <Signup></Signup>
                  }/>
                  <Route path="/wishlist" element={
                    <ProtectedRoute>
                      <WishlistPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/order-confirmation" element={
                    <ProtectedRoute>
                      <OrderConfirmationPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 Page */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              
              {/* Toast/Notification Container */}
              <div id="toast-container" className="fixed bottom-4 right-4 z-50"></div>
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;