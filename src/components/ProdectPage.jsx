import { useState, useEffect } from 'react';
import {BaseUrl} from "../SERVICES/Api";
const BASE_API = BaseUrl;


// ✅ correct imports with extension
import cap1 from "../assets/cap1.svg";
import cap2 from "../assets/cap2.svg";
import cap3 from "../assets/cap3.svg";
import cap4 from "../assets/cap4.svg";
import cap5 from "../assets/cap5.svg";
import cap6 from "../assets/cap6.svg";
import cap7 from "../assets/cap7.svg";
import cap8 from "../assets/cap8.svg";
import cap9 from "../assets/cap9.svg";

const capCategories = [
  {
    name: "BASEBALL CAPS",
    icon: cap1,
    id: 1
  },
  {
    name: "SNAPBACK CAPS",
    icon: cap2,
    id: 2
  },
  {
    name: "DAD CAPS",
    icon: cap3,
    id: 3
  },
  {
    name: "BEANIES",
    icon: cap4,
    id: 5
  },
  {
    name: "TRUCKER CAPS",
    icon: cap5,
    id: 4
  },
  {
    name: "FEDORAS",
    icon: cap6,
    id: 99 // Note: Not in your data, keeping for UI consistency
  },
  {
    name: "BUCKET HATS",
    icon: cap7,
    id: 6
  },
  {
    name: "VISORS",
    icon: cap8,
    id: 8
  },
  {
    name: "FASHION CAPS",
    icon: cap9,
    id: 100 // Note: Not in your data, keeping for UI consistency
  },
];

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12); // 12 products per page

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_API}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_API}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const filteredProducts = products.filter(product => {
    // Category filter
    const categoryMatch = selectedCategory === 'all' || 
                         product.categoryId === parseInt(selectedCategory) ||
                         (selectedCategory === '5' && product.category === 'BEANIES');
    
    // Search filter
    const searchMatch = !searchQuery || 
                       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case 'discount':
        return b.discount - a.discount;
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, searchQuery]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addToCart = (product) => {
    alert(`Added ${product.name} to cart!`);
  };

  const addToWishlist = (product) => {
    alert(`Added ${product.name} to wishlist!`);
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show pages around current page
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Exactly like your Navbar */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-center px-10 py-4">
          <input
            type="text"
            placeholder="SEARCH FOR PRODUCTS"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* CAP CATEGORY BAR - Exactly like your Navbar */}
        <div className="flex justify-center items-center gap-10 py-4 border-b border-gray-300">
          {/* All Products Button */}
          <div 
            className={`flex flex-col items-center cursor-pointer group ${
              selectedCategory === 'all' ? 'text-orange-500' : ''
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            <div className="w-8 h-8 mb-1.5 flex items-center justify-center text-lg">🛍️</div>
            <div className={`text-xs tracking-wide group-hover:text-orange-500 transition-colors ${
              selectedCategory === 'all' ? 'text-orange-500 font-semibold' : ''
            }`}>
              ALL
            </div>
          </div>

          {/* Category Buttons */}
          {capCategories.map((cap, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center cursor-pointer group ${
                selectedCategory === cap.id.toString() ? 'text-orange-500' : ''
              }`}
              onClick={() => setSelectedCategory(cap.id.toString())}
            >
              <img
                src={cap.icon}
                alt={cap.name}
                className="w-8 h-8 mb-1.5 group-hover:scale-110 transition-transform"
              />
              <div className={`text-xs tracking-wide group-hover:text-orange-500 transition-colors ${
                selectedCategory === cap.id.toString() ? 'text-orange-500 font-semibold' : ''
              }`}>
                {cap.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Premium Headwear Collection</h1>
            <p className="text-gray-600 mt-1">
              Showing <span className="font-semibold">{indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)}</span> of{" "}
              <span className="font-semibold">{sortedProducts.length}</span> products
              {selectedCategory !== 'all' && ` in ${getCategoryName(parseInt(selectedCategory)) || 'Selected Category'}`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm">Show:</span>
              <select
                value={productsPerPage}
                onChange={(e) => {
                  setProductsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
                <option value="20">20</option>
                <option value="24">24</option>
              </select>
              <span className="text-gray-700 text-sm">per page</span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-gray-700 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {currentProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">😕</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try changing your filters or search term</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  {/* Product Image Container */}
                  <div className="relative overflow-hidden bg-gray-50">
                    <img
                      src={product.thumbnail || product.images[0]}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{product.discount}%
                      </div>
                    )}
                    
                    {/* New Badge */}
                    {product.isNew && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-medium hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.reviewCount})</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>

                    {/* Color Dots */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-gray-500">Colors:</span>
                      <div className="flex gap-1">
                        {product.colors.slice(0, 4).map((color, idx) => (
                          <div
                            key={idx}
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ 
                              backgroundColor: color.toLowerCase().includes('black') ? '#000' :
                                             color.toLowerCase().includes('white') ? '#fff' :
                                             color.toLowerCase().includes('blue') ? '#2563eb' :
                                             color.toLowerCase().includes('red') ? '#dc2626' :
                                             color.toLowerCase().includes('green') ? '#16a34a' :
                                             color.toLowerCase().includes('gray') ? '#6b7280' :
                                             color.toLowerCase().includes('brown') ? '#92400e' :
                                             color.toLowerCase().includes('olive') ? '#3f6212' :
                                             color.toLowerCase().includes('beige') ? '#d6d3d1' :
                                             color.toLowerCase().includes('navy') ? '#1e3a8a' :
                                             color.toLowerCase().includes('mustard') ? '#f59e0b' :
                                             color.toLowerCase().includes('khaki') ? '#a3a3a3' :
                                             color.toLowerCase().includes('camouflage') ? '#4d7c0f' :
                                             '#f3f4f6'
                            }}
                            title={color}
                          />
                        ))}
                        {product.colors.length > 4 && (
                          <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                        )}
                      </div>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => addToWishlist(product)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          ♡
                        </button>
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' :
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 10 ? 'In Stock' :
                           product.stock > 0 ? `Low Stock (${product.stock})` :
                           'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ← Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNumber, index) => (
                      pageNumber === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                          ...
                        </span>
                      ) : (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'bg-orange-500 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Next →
                  </button>
                </div>

                {/* Items per page selector for mobile */}
                <div className="sm:hidden flex items-center gap-2">
                  <span className="text-gray-700 text-sm">Show:</span>
                  <select
                    value={productsPerPage}
                    onChange={(e) => {
                      setProductsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="8">8</option>
                    <option value="12">12</option>
                    <option value="16">16</option>
                    <option value="20">20</option>
                    <option value="24">24</option>
                  </select>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-sm text-gray-600">All our caps are made with premium materials and expert craftsmanship.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Free Shipping</h3>
              <p className="text-sm text-gray-600">Free shipping on orders above ₹1999 across India.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy for all unused products.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}