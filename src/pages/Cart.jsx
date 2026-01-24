import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
    setLoading(false);
  };

  const updateQuantity = (id, color, size, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) => {
      if (item.id === id && item.color === color && item.size === size) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Dispatch event to update navbar count
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id, color, size) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.id === id && item.color === color && item.size === size)
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Dispatch event to update navbar count
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 1999 ? 0 : 99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success("Cart cleared successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Add some products to get started!
            </p>
            <Link
              to="/products"
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm divide-y">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.color}-${item.size}`}
                    className="p-6"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={item.thumbnail || item.image || 'https://via.placeholder.com/150x150?text=No+Image'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.color && `Color: ${item.color}`}
                              {item.color && item.size && " | "}
                              {item.size && `Size: ${item.size}`}
                            </p>
                            <div className="text-sm text-gray-500 mt-1">
                              Price: {formatPrice(item.price)}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id, item.color, item.size)}
                            className="text-gray-400 hover:text-red-500 text-xl font-bold h-6 w-6 flex items-center justify-center"
                            aria-label="Remove item"
                          >
                            ×
                          </button>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.color, item.size, item.quantity - 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 min-w-10 text-center border-x border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.color, item.size, item.quantity + 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.quantity} × {formatPrice(item.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Link
                  to="/products"
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ← Continue Shopping
                </Link>
                
                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="px-6 py-2 text-red-600 border border-red-300 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Clear Cart
                  </button>
                  
                  <button
                    onClick={() => {
                      // Save cart items to localStorage before checkout
                      localStorage.setItem("checkoutItems", JSON.stringify(cartItems));
                      navigate("/checkout");
                    }}
                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Checkout Now
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">
                      {formatPrice(calculateSubtotal())}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {calculateShipping() === 0
                        ? "FREE"
                        : formatPrice(calculateShipping())}
                    </span>
                  </div>

                  {calculateShipping() > 0 && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      Add {formatPrice(Math.max(0, 1999 - calculateSubtotal()))} more for free shipping!
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      (Including shipping)
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    localStorage.setItem("checkoutItems", JSON.stringify(cartItems));
                    navigate("/checkout");
                  }}
                  className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors mb-4"
                >
                  Proceed to Checkout
                </button>

                <div className="text-center text-sm text-gray-500 mb-6">
                  or{" "}
                  <Link to="/checkout" className="text-orange-500 hover:underline">
                    checkout with multiple payment options
                  </Link>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900">Shopping Benefits</h3>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 mt-0.5">✓</div>
                    <span className="text-sm">
                      Free shipping on orders above ₹1999
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 mt-0.5">✓</div>
                    <span className="text-sm">30-day return policy</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 mt-0.5">✓</div>
                    <span className="text-sm">Secure payment & SSL encryption</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 mt-0.5">✓</div>
                    <span className="text-sm">Customer support 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related Products Suggestion (when cart has items) */}
        {cartItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              You might also like
            </h2>
            <div className="text-center py-8 bg-gray-100 rounded-lg">
              <p className="text-gray-600 mb-4">
                Discover more products that match your style
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Browse All Products →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}