import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');

    if (location.state?.orderId) {
      const found = orders.find(o => o.id === location.state.orderId);
      if (found) {
        setOrder(found);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const cancelOrder = () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = orders.map(o =>
      o.id === order.id ? { ...o, status: 'cancelled' } : o
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrder({ ...order, status: 'cancelled' });
  };

  const deliveryDate = new Date(order?.date);
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  if (!order) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-xl w-full">

        <h1 className="text-3xl font-bold text-green-600 mb-2 text-center">
          Order Confirmed 🎉
        </h1>

        {/* STATUS */}
        <p className="text-center mb-4">
          <span
            className={`px-3 py-1 rounded text-white text-sm ${
              order.status === 'cancelled'
                ? 'bg-red-500'
                : order.status === 'paid'
                ? 'bg-blue-500'
                : 'bg-green-500'
            }`}
          >
            {order.status.toUpperCase()}
          </span>
        </p>

        {/* ORDER INFO */}
        <div className="border-b pb-3 mb-3">
          <p><b>Order ID:</b> {order.id}</p>
          <p><b>Order Date:</b> {new Date(order.date).toDateString()}</p>
          <p><b>Delivery By:</b> {deliveryDate.toDateString()}</p>
          <p>
            <b>Payment:</b>{' '}
            {order.paymentMethod === 'cod' && '💵 Cash on Delivery'}
            {order.paymentMethod === 'upi' && '📱 UPI'}
            {order.paymentMethod === 'card' && '💳 Card'}
          </p>
        </div>

        {/* CUSTOMER */}
        <div className="border-b pb-3 mb-3">
          <h3 className="font-semibold mb-1">Delivery Address</h3>
          <p>{order.customer.firstName}</p>
          <p>{order.customer.address}</p>
          <p>
            {order.customer.city}, {order.customer.state} - {order.customer.pincode}
          </p>
          <p>📞 {order.customer.phone}</p>
        </div>

        {/* ITEMS */}
        <div className="border-b pb-3 mb-3">
          <h3 className="font-semibold mb-2">Items</h3>
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm mb-1">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total</span>
          <span>₹{order.finalTotal}</span>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-2">
          {order.status !== 'cancelled' && (
            <button
              onClick={cancelOrder}
              className="bg-red-500 text-white py-2 rounded"
            >
              Cancel Order
            </button>
          )}

          <button
            onClick={() => navigate('/orders')}
            className="bg-gray-200 py-2 rounded"
          >
            View All Orders
          </button>

          <button
            onClick={() => navigate('/products')}
            className="bg-orange-500 text-white py-2 rounded"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmationPage;
