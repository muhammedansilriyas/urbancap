import React, { createContext, useState, useContext, useCallback } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const addToWishlist = useCallback((product) => {
    setWishlistItems(prevItems => {
      const exists = prevItems.some(item => item.id === product.id);
      if (!exists) {
        const updatedWishlist = [...prevItems, product];
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        return updatedWishlist;
      }
      return prevItems;
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems(prevItems => {
      const updatedWishlist = prevItems.filter(item => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    localStorage.removeItem('wishlist');
  }, []);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      wishlistCount: wishlistItems.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
};