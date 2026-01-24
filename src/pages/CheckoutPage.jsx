import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      toast.error('Please fill all required fields');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      navigate('/cart');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    const orderId = `ORD-${Date.now()}`;

    const order = {
      id: orderId,
      date: new Date().toISOString(),
      items: cartItems,
      total: cartTotal,
      finalTotal: cartTotal,
      customer: formData,
      paymentMethod: formData.paymentMethod,
      status: formData.paymentMethod === 'cod' ? 'confirmed' : 'paid',
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    toast.success(
      formData.paymentMethod === 'cod'
        ? 'Order placed successfully!'
        : 'Payment successful!'
    );

    navigate('/order-confirmation', {
      state: { orderId },
    });

    setTimeout(() => clearCart(), 500);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        {/* USER DETAILS */}
        <input name="firstName" placeholder="First Name" onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" />

        <input name="email" placeholder="Email" onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" />

        <input name="phone" placeholder="Phone" onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" />

        <textarea name="address" placeholder="Address" onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" />

        <input name="city" placeholder="City" onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" />

        <input name="state" placeholder="State" onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" />

        <input name="pincode" placeholder="Pincode" onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" />

        {/* PAYMENT METHODS */}
        <h3 className="text-lg font-semibold mt-4 mb-2">Payment Method</h3>

        <label className="flex items-center mb-2 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={formData.paymentMethod === 'cod'}
            onChange={handleChange}
            className="mr-2"
          />
          💵 Cash on Delivery
        </label>

        <label className="flex items-center mb-2 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="upi"
            checked={formData.paymentMethod === 'upi'}
            onChange={handleChange}
            className="mr-2"
          />
          📱 UPI (Google Pay / PhonePe)
        </label>

        <label className="flex items-center mb-4 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={formData.paymentMethod === 'card'}
            onChange={handleChange}
            className="mr-2"
          />
          💳 Credit / Debit Card
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded font-semibold"
        >
          {loading
            ? 'Processing...'
            : formData.paymentMethod === 'cod'
            ? `Place Order ₹${cartTotal}`
            : `Pay ₹${cartTotal}`}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
