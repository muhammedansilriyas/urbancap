import React, { createContext, useState, useContext, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = useCallback((product) => {
    return new Promise((resolve) => {
      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(
          item => item.id === product.id && 
          item.color === product.color && 
          item.size === product.size
        );

        let updatedCart;
        if (existingItemIndex > -1) {
          updatedCart = [...prevItems];
          updatedCart[existingItemIndex].quantity += product.quantity;
        } else {
          updatedCart = [...prevItems, product];
        }

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        resolve();
        return updatedCart;
      });
    });
  }, []);

  const removeFromCart = useCallback((itemId, color, size) => {
    setCartItems(prevItems => {
      const updatedCart = prevItems.filter(
        item => !(item.id === itemId && item.color === color && item.size === size)
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const updateQuantity = useCallback((itemId, color, size, quantity) => {
    setCartItems(prevItems => {
      const updatedCart = prevItems.map(item => {
        if (item.id === itemId && item.color === color && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cart');
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};