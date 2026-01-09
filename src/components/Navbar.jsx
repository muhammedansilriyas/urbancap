import React, { useState, useEffect } from 'react';
import { Link, useLocation,  } from 'react-router-dom';
import { ShoppingBag, User, Heart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const location = useLocation();
  // const navigate = useNavigate();

  useEffect(() => {
    // Update cart count from localStorage
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };

    // Update wishlist count
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    };

    updateCartCount();
    updateWishlistCount();

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('wishlistUpdated', updateWishlistCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
    };
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="shrink-0">
              <Link to="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-black tracking-wide">
                  URBANCAP<span className="text-gray-900">®</span>
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation Center */}
            <div className="hidden lg:flex items-center space-x-10 mx-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative text-sm font-medium tracking-wide transition-colors ${
                    location.pathname === item.path
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-6">
              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center space-x-6">
                <Link
                  to="/account"
                  className="text-gray-600 hover:text-black transition-colors relative group"
                >
                  <User className="w-6 h-6" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Account
                  </span>
                </Link>
                
                <Link
                  to="/wishlist"
                  className="text-gray-600 hover:text-black transition-colors relative group"
                >
                  <div className="relative">
                    <Heart className="w-6 h-6" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Wishlist
                  </span>
                </Link>
                
                <Link
                  to="/cart"
                  className="text-gray-600 hover:text-black transition-colors relative group"
                >
                  <div className="relative">
                    <ShoppingBag className="w-6 h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Cart
                  </span>
                </Link>
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden flex items-center space-x-4">
                <Link to="/wishlist" className="text-gray-600 hover:text-black relative">
                  <Heart className="w-6 h-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                
                <Link to="/cart" className="text-gray-600 hover:text-black relative">
                  <ShoppingBag className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-black p-2"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/30"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 bottom-0 w-80 max-w-full bg-white transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
            <span className="text-lg font-bold text-black">
              Menu
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-600 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-6 overflow-y-auto h-[calc(100%-5rem)]">
            {/* Navigation Links */}
            <div className="space-y-1 mb-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Account Links */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Account
              </h3>
              <div className="space-y-1">
                <Link
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 mr-3" />
                  <span>My Account</span>
                </Link>
                
                <Link
                  to="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-3" />
                    <span>Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                
                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-3" />
                    <span>Shopping Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                      {cartCount} items
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="pt-6 border-t border-gray-200 mt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Contact Info
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>Email: support@urbancap.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;