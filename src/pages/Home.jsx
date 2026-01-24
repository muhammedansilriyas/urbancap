import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BaseUrl } from "../SERVICES/Api";
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const BASE_API = BaseUrl;

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_API}/products`);
      const data = await response.json();
      const products = Array.isArray(data) ? data : [];
      
      // Filter featured products (you might want to add an isFeatured property to your products)
      const featured = products.slice(0, 6);
      const arrivals = products
        .filter(p => p.isNew || p.createdAt) // Assuming you have isNew field
        .slice(0, 4);
      const sellers = products
        .sort((a, b) => (b.sold || 0) - (a.sold || 0)) // Assuming you have sold field
        .slice(0, 4);
      
      setFeaturedProducts(featured);
      setNewArrivals(arrivals);
      setBestSellers(sellers);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartProduct = {
      id: product.id,
      name: product.name || 'Unnamed Product',
      price: product.price || 0,
      thumbnail: product.thumbnail || product.images?.[0] || '',
      color: product.colors?.[0] || 'default',
      size: product.sizes?.[0] || 'default',
      quantity: 1,
      stock: product.stock || 0
    };

    addToCart(cartProduct);
    alert(`Added ${product.name || 'Product'} to cart!`);
  };

  const handleWishlistToggle = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      alert(`Removed ${product.name || 'Product'} from wishlist!`);
    } else {
      const wishlistProduct = {
        id: product.id,
        name: product.name || 'Unnamed Product',
        price: product.price || 0,
        thumbnail: product.thumbnail || product.images?.[0] || '',
        rating: product.rating || 0,
        brand: product.brand || ''
      };
      addToWishlist(wishlistProduct);
      alert(`Added ${product.name || 'Product'} to wishlist!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="md:w-2/3">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Elevate Your Style with Premium Headwear
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Discover our collection of handcrafted caps, hats, and beanies. Quality meets style in every stitch.
            </p>
            <Link
              to="/products"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Shop By Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { name: "Baseball Caps", image: "https://www.urbanmonkey.com/cdn/shop/files/earthbound_vintage_brown_baseball_dad_cap_03.jpg?v=1765780831", link: "/products?category=1" },
            { name: "Snapback Caps", image: "https://www.urbanmonkey.com/cdn/shop/files/UM_Caps_0127_f072b596-06a4-4e38-ad26-14931dd1ce24.jpg?v=1767770293", link: "/products?category=2" },
            { name: "Dad Caps", image: "https://www.urbanmonkey.com/cdn/shop/files/Antardrishti_green_eveil_eye_baseball_cap_03.jpg?v=1763976817", link: "/products?category=3" },
            { name: "Beanies", image: "https://www.urbanmonkey.com/cdn/shop/files/urbanmonkey29thnov-9488-337601.jpg?v=1733829723", link: "/products?category=5" },
          ].map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group relative overflow-hidden rounded-xl aspect-square"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      -{product.discount}%
                    </div>
                  )}
                  <button
                    onClick={(e) => handleWishlistToggle(product, e)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    {isInWishlist(product.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm">{product.rating || '0.0'}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description || 'Premium quality headwear'}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-gray-500 line-through ml-2 text-sm">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Summer Collection 2024</h2>
          <p className="text-xl mb-8 opacity-90">
            Stay cool and stylish with our exclusive summer lineup. Limited time offers available!
          </p>
          <Link
            to="/products?category=new"
            className="inline-block bg-white text-orange-500 hover:bg-gray-100 font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      </div>

      {/* New Arrivals & Best Sellers */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* New Arrivals */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">New Arrivals</h2>
              <Link
                to="/products?sort=newest"
                className="text-orange-500 hover:text-orange-600 font-semibold"
              >
                See All
              </Link>
            </div>
            
            <div className="space-y-6">
              {newArrivals.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors"
                >
                  <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-500">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {product.description?.substring(0, 60)}...
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-lg">
                        {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="text-sm bg-gray-100 hover:bg-orange-500 hover:text-white px-3 py-1 rounded transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Best Sellers */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Best Sellers</h2>
              <Link
                to="/products?sort=popular"
                className="text-orange-500 hover:text-orange-600 font-semibold"
              >
                See All
              </Link>
            </div>
            
            <div className="space-y-6">
              {bestSellers.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors"
                >
                  <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-500">
                          {product.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-400 text-sm">★</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {product.rating || '0.0'} ({product.reviewCount || 0} reviews)
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleWishlistToggle(product, e)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        {isInWishlist(product.id) ? '❤️' : '♡'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-lg">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders above ₹1999</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-bold text-lg mb-2">30-Day Returns</h3>
              <p className="text-gray-600">Easy returns within 30 days</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600">Handcrafted with premium materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}