import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/solid';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

const Wishlist = () => {
  const { 
    wishlistItems: wishlist, 
    removeFromWishlist, 
    clearWishlist, 
    wishlistCount 
  } = useWishlist();
  
  const { addToCart } = useCart();

  // Calculate wishlist total
  const getWishlistTotal = () => {
    return wishlist.reduce((total, game) => total + (game.price || 0), 0);
  };

  // Move item to cart
  const moveToCart = async (game) => {
    try {
      const cartItem = {
        id: game.id,
        name: game.name || 'Unnamed Product',
        price: game.price || 0,
        thumbnail: game.thumbnail || game.image || game.images?.[0] || '',
        color: game.colors?.[0] || 'default',
        size: game.sizes?.[0] || 'default',
        quantity: 1,
        stock: game.stock || 10 // Default to 10 if stock not available
      };
      
      await addToCart(cartItem);
      removeFromWishlist(game.id);
      
      // Show success message
      alert(`${game.name || 'Product'} moved to cart!`);
    } catch (error) {
      console.error('Error moving to cart:', error);
      alert('Failed to move item to cart. Please try again.');
    }
  };

  const renderStars = (rating) => {
    const starRating = rating || 0;
    return Array.from({ length: 5 }, (_, index) => (
      index < Math.floor(starRating) ? (
        <StarIcon key={index} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarOutline key={index} className="h-4 w-4 text-yellow-400" />
      )
    ));
  };

  // Function to check if item is in stock
  const isInStock = (item) => {
    // If stock property exists, use it
    if (item.stock !== undefined) {
      return item.stock > 0;
    }
    // If no stock property, assume it's in stock
    return true;
  };

  if (wishlistCount === 0) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HeartIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">Start adding products you love to your wishlist!</p>
            <Link
              to="/products"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition duration-300"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">
              {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} • Total: ₹{getWishlistTotal().toFixed(2)}
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-300 flex items-center"
          >
            <TrashIcon className="h-5 w-5 mr-2 text-gray-600" />
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {wishlist.map(item => {
            const itemInStock = isInStock(item);
            
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <Link to={`/product/${item.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.thumbnail || item.image || item.images?.[0] || '/placeholder-game.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-game.jpg';
                      }}
                    />
                    {/* Stock Status Badge */}
                    {!itemInStock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-red-600 cursor-pointer">
                      {item.name || 'Unnamed Product'}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-gray-600 mb-2">{item.brand || 'No Brand'}</p>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {item.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {renderStars(item.rating)}
                    </div>
                    <span className="ml-2 text-sm text-gray-700">{item.rating || 0}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-gray-900">₹{item.price || 0}</span>
                    <span className={`text-sm ${itemInStock ? 'text-green-600' : 'text-red-600'}`}>
                      {itemInStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition duration-300 flex items-center justify-center"
                    >
                      <HeartIcon className="h-4 w-4 mr-2 text-red-600" />
                      Remove
                    </button>
                    
                    <button
                      onClick={() => moveToCart(item)}
                      disabled={!itemInStock}
                      className={`flex-1 py-2 rounded-lg transition duration-300 flex items-center justify-center ${
                        itemInStock
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      {itemInStock ? 'Move to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;