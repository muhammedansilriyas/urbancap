import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { user } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Get order from localStorage or location state
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    if (location.state?.orderId) {
      // Find order by ID from location state
      const foundOrder = storedOrders.find(o => o.id === location.state.orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        // Clear cart if not already cleared
        clearCart();
      } else {
        // Redirect if order not found
        navigate('/orders');
      }
    } else if (storedOrders.length > 0) {
      // Show latest order
      const latestOrder = storedOrders[storedOrders.length - 1];
      setOrder(latestOrder);
      clearCart();
    } else {
      // No orders found, redirect to home
      navigate('/products');
    }
    
    setLoading(false);
  }, [location, navigate, clearCart]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleDownloadInvoice = () => {
    setDownloading(true);
    
    // Simulate download
    setTimeout(() => {
      toast.success('Invoice downloaded successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
      setDownloading(false);
    }, 1500);
  };

  const getOrderStatus = (status) => {
    const statusMap = {
      'confirmed': { text: 'Order Confirmed', color: 'bg-green-100 text-green-800' },
      'pending': { text: 'Payment Pending', color: 'bg-yellow-100 text-yellow-800' },
      'processing': { text: 'Processing', color: 'bg-blue-100 text-blue-800' },
      'shipped': { text: 'Shipped', color: 'bg-purple-100 text-purple-800' },
      'delivered': { text: 'Delivered', color: 'bg-green-100 text-green-800' },
      'cancelled': { text: 'Cancelled', color: 'bg-red-100 text-red-800' }
    };
    
    return statusMap[status] || { text: 'Processing', color: 'bg-blue-100 text-blue-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Order Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getOrderStatus(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for your order. We've sent a confirmation email to <span className="font-semibold">{order.customer.email}</span>
          </p>
        </div>

        {/* Order Status Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="text-xl font-bold text-gray-900">{order.id}</p>
              <p className="text-sm text-gray-600 mt-1">{formatDate(order.date)}</p>
            </div>
            
            <div>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {statusInfo.text}
              </span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 text-center">Confirmed</span>
              </div>
              
              <div className="flex-1 h-1 bg-gray-200"></div>
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  ['processing', 'shipped', 'delivered'].includes(order.status)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 text-center">Processing</span>
              </div>
              
              <div className="flex-1 h-1 bg-gray-200"></div>
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  ['shipped', 'delivered'].includes(order.status)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 text-center">Shipped</span>
              </div>
              
              <div className="flex-1 h-1 bg-gray-200"></div>
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  order.status === 'delivered'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 text-center">Delivered</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-start py-4 border-b last:border-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.color && (
                          <span className="text-sm text-gray-600">Color: {item.color}</span>
                        )}
                        {item.size && (
                          <span className="text-sm text-gray-600">Size: {item.size}</span>
                        )}
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-sm text-gray-600">each {formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Billing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-gray-700">{order.customer.address}</p>
                  <p className="text-gray-700">
                    {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                  </p>
                  <div className="pt-2 mt-2 border-t">
                    <p className="text-gray-700">
                      <span className="font-medium">Phone:</span> {order.customer.phone}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span> {order.customer.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                       order.paymentMethod === 'card' ? 'Credit/Debit Card' :
                       order.paymentMethod === 'upi' ? 'UPI Payment' : order.paymentMethod}
                    </p>
                  </div>
                  
                  {order.paymentMethod === 'cod' && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Please keep exact change ready for delivery
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className="font-medium text-green-600">
                      {order.paymentMethod === 'cod' ? 'Pending' : 'Paid'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(order.total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                  </span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span>{formatPrice(order.finalTotal)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="font-medium text-blue-900">Estimated Delivery</p>
                    <p className="text-sm text-blue-700">
                      {(() => {
                        const deliveryDate = new Date(order.date);
                        deliveryDate.setDate(deliveryDate.getDate() + 5);
                        return deliveryDate.toLocaleDateString('en-IN', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        });
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleDownloadInvoice}
                  disabled={downloading}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {downloading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Download Invoice
                    </>
                  )}
                </button>
                
                <Link
                  to="/orders"
                  className="block w-full py-3 bg-orange-500 text-white text-center rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  View All Orders
                </Link>
                
                <button
                  onClick={() => navigate('/products')}
                  className="w-full py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Need Help */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center text-sm text-gray-700 mt-1">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>support@gamehub.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Order Processing</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Your order will be processed within 24 hours. You'll receive updates via email.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Shipping Update</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Tracking details will be sent to your email once your order is shipped.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Delivery</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Our delivery partner will contact you before delivery. Keep your phone handy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;