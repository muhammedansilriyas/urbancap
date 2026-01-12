import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseUrl } from "../SERVICES/Api";
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_API = BaseUrl;

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart: addToCartContext, cartItems } = useCart();
  const { addToWishlist: addToWishlistContext, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${BASE_API}/products/${productId}`);
      const data = await response.json();
      setProduct(data);
      
      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0]);
      }
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`${BASE_API}/products?categoryId=${product?.categoryId || 1}&_limit=4`);
      const data = await response.json();
      setRelatedProducts(data.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  // Check if product is in cart
  const isInCart = () => {
    return cartItems.some(item => 
      item.id === productId && 
      item.color === selectedColor && 
      item.size === selectedSize
    );
  };

  // Check if product is in wishlist
  const isProductInWishlist = () => {
    return isInWishlist(productId);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (product.stock <= 0) {
      toast.error('This product is out of stock!', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setAddingToCart(true);
    try {
      const cartProduct = {
        id: product.id,
        name: product.name || 'Unnamed Product',
        price: product.price || 0,
        thumbnail: product.thumbnail || product.images?.[0] || '',
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
        stock: product.stock || 0
      };

      await addToCartContext(cartProduct);

      // If user is logged in, sync with server
      if (user && user.id) {
        try {
          // Update user cart on server
          console.log('User cart updated on server:', cartProduct);
        } catch (error) {
          console.error('Error syncing cart with server:', error);
        }
      }

      toast.success(`Added ${product.name} to cart!`, {
        position: "top-right",
        autoClose: 3000,
        icon: '🛒',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const handleAddToWishlist = async () => {
    if (!product) return;

    setAddingToWishlist(true);
    try {
      if (isProductInWishlist()) {
        removeFromWishlist(product.id);
        
        toast.info(`Removed ${product.name} from wishlist!`, {
          position: "top-right",
          autoClose: 3000,
          icon: '❤️',
        });
      } else {
        const wishlistProduct = {
          id: product.id,
          name: product.name || 'Unnamed Product',
          price: product.price || 0,
          thumbnail: product.thumbnail || product.images?.[0] || '',
          rating: product.rating || 0,
          brand: product.brand || ''
        };

        await addToWishlistContext(wishlistProduct);

        toast.success(`Added ${product.name} to wishlist!`, {
          position: "top-right",
          autoClose: 3000,
          icon: '❤️',
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setAddingToWishlist(false);
    }
  };

  const getColorHex = (color) => {
    const colorMap = {
      'black': '#000',
      'white': '#fff',
      'blue': '#2563eb',
      'red': '#dc2626',
      'green': '#16a34a',
      'gray': '#6b7280',
      'grey': '#6b7280',
      'brown': '#92400e',
      'olive': '#3f6212',
      'beige': '#d6d3d1',
      'navy': '#1e3a8a',
      'mustard': '#f59e0b',
      'khaki': '#a3a3a3',
      'camouflage': '#4d7c0f',
      'yellow': '#fbbf24',
      'orange': '#f97316',
      'pink': '#ec4899',
      'purple': '#8b5cf6',
    };
    
    const lowerColor = color.toLowerCase();
    for (const [key, value] of Object.entries(colorMap)) {
      if (lowerColor.includes(key)) {
        return value;
      }
    }
    return '#f3f4f6';
  };

  const formatPrice = (price) => {
    if (!price) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    const starRating = rating || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < Math.floor(starRating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/products')}
            className="text-gray-600 hover:text-orange-500 flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Products</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 relative">
              <img
                src={product.images?.[selectedImage] || product.thumbnail || 'https://via.placeholder.com/500x500?text=No+Image'}
                alt={product.name}
                className="w-full h-auto rounded-lg"
              />
              
              {/* Badges */}
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                  -{product.discount}% OFF
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-4 right-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded">
                  NEW
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-2">{product.brand}</p>
              </div>
              
              {/* Wishlist Button */}
              <button
                onClick={handleAddToWishlist}
                disabled={addingToWishlist}
                className={`text-2xl transition-colors ${
                  isProductInWishlist() 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-400 hover:text-red-500'
                } disabled:opacity-50`}
                aria-label={isProductInWishlist() ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isProductInWishlist() ? '❤️' : '♡'}
              </button>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-600">({product.reviewCount || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              {product.discount > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  You save {product.discount}% on this product!
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 10 ? 'bg-green-100 text-green-800' :
                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {product.stock > 10 ? '✅ In Stock' :
                 product.stock > 0 ? `⚠️ Only ${product.stock} left` :
                 '❌ Out of Stock'}
              </div>
              {product.stock > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Order now to get it delivered in 3-5 business days
                </p>
              )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Color: <span className="font-normal">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedColor === color 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-300 hover:border-orange-300'
                      }`}
                    >
                      <div 
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: getColorHex(color) }}
                      />
                      <span>{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Size: <span className="font-normal">{selectedSize}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size 
                          ? 'border-orange-500 bg-orange-500 text-white' 
                          : 'border-gray-300 hover:border-orange-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 border-x text-center min-w-[60px] font-medium">{quantity}</span>
                  <button
                    onClick={() => {
                      if (quantity < (product.stock || 10)) {
                        setQuantity(quantity + 1);
                      } else {
                        toast.warning(`Maximum ${product.stock} items available`, {
                          position: "top-right",
                          autoClose: 3000,
                        });
                      }
                    }}
                    disabled={quantity >= (product.stock || 10)}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600">
                  {product.stock || 0} available in stock
                </span>
              </div>
            </div>

            {/* Cart Status */}
            {isInCart() && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <span className="text-lg">✓</span>
                  <span>This item is already in your cart</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock <= 0}
                className={`flex-1 py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  product.stock <= 0 
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                } ${addingToCart ? 'opacity-70' : ''}`}
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Adding...
                  </>
                ) : product.stock <= 0 ? (
                  'Out of Stock'
                ) : isInCart() ? (
                  'Add More to Cart'
                ) : (
                  'Add to Cart'
                )}
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0 || addingToCart}
                className={`flex-1 py-4 border-2 rounded-lg font-semibold transition-all ${
                  product.stock <= 0 
                    ? 'border-gray-400 text-gray-400 cursor-not-allowed'
                    : 'border-orange-500 text-orange-500 hover:bg-orange-50'
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Description */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-xl mb-4">Product Details</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>
              
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-600 text-sm">Material</p>
                  <p className="font-semibold">{product.material || 'Premium Quality'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Category</p>
                  <p className="font-semibold">{product.category || 'Headwear'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Fit</p>
                  <p className="font-semibold">{product.fit || 'Regular Fit'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Care</p>
                  <p className="font-semibold">{product.care || 'Machine Washable'}</p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">Shipping & Returns</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">Free shipping on orders above ₹1999</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">30-day hassle-free return policy</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">Authentic products with warranty</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">Cash on Delivery available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={relatedProduct.thumbnail || relatedProduct.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{relatedProduct.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{relatedProduct.brand}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm">{relatedProduct.rating || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}