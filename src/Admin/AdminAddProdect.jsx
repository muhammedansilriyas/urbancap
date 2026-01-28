import { useEffect, useState } from "react";
import { useAdmin } from "./Context/AdminContext";
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Plus, Trash2, X, Image, Edit3, Shield, Package, Palette, Ruler, Tag, Layers } from "lucide-react";

export default function AdminAddProducts({ onClose, editingProduct }) {
  const { addProduct, editProduct } = useAdmin();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    color: "",
    material: "",
    size: "One Size",
    price: "",
    stock: "0",
    inStock: true,
    images: [""],
    description: ""
  });

  const [newImage, setNewImage] = useState("");

  // Categories for caps
  const categories = [
    "Baseball Caps",
    "Snapbacks",
    "Trucker Hats",
    "Beanies",
    "Bucket Hats",
    "Visors",
    "Dad Hats",
    "Sports Caps",
    "Fashion Caps",
    "Limited Edition"
  ];

  // Common cap brands
  const brands = [
    "Nike",
    "Adidas",
    "New Era",
    "Under Armour",
    "Puma",
    "Reebok",
    "The North Face",
    "Carhartt",
    "Vans",
    "Supreme",
    "Custom",
    "Other"
  ];

  // Common colors
  const colors = [
    "Black",
    "White",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Gray",
    "Navy",
    "Brown",
    "Beige",
    "Orange",
    "Purple",
    "Pink",
    "Multicolor",
    "Camouflage"
  ];

  // Common materials
  const materials = [
    "Cotton",
    "Polyester",
    "Wool",
    "Acrylic",
    "Denim",
    "Mesh",
    "Leather",
    "Suede",
    "Canvas",
    "Nylon",
    "Blend"
  ];

  // Common sizes
  const sizes = ["One Size", "S", "M", "L", "XL", "Adjustable"];

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        category: editingProduct.category || editingProduct.genre || "",
        brand: editingProduct.brand || "",
        color: editingProduct.color || "",
        material: editingProduct.material || "",
        size: editingProduct.size || "One Size",
        price: editingProduct.price || "",
        stock: editingProduct.stock || editingProduct.quantity || "0",
        inStock: editingProduct.inStock !== false,
        images: editingProduct.images || [""],
        description: editingProduct.description || ""
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Auto update inStock based on stock quantity
      ...(name === 'stock' && {
        inStock: parseInt(value) > 0
      })
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage("");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      inStock: parseInt(formData.stock) > 0,
      images: formData.images.filter(img => img.trim() !== ""),
      // Include both category and genre for compatibility
      genre: formData.category,
      quantity: parseInt(formData.stock)
    };

    if (editingProduct) {
      await editProduct(editingProduct.id, productData);
    } else {
      await addProduct(productData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center text-white z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-linear-to-br from-gray-900 to-gray-800 p-6 rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-700/50 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Package className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {editingProduct ? "Edit Cap" : "Add New Cap"}
              </h2>
              <p className="text-sm text-gray-400">
                {editingProduct ? "Update cap details" : "Add a new cap to your store"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                Cap Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Classic Baseball Cap"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Tag className="w-4 h-4 text-blue-400" />
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => handleSelectChange('category', e.target.value)}
                className="w-full p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Tag className="w-4 h-4 text-green-400" />
                Brand
              </label>
              <select
                name="brand"
                value={formData.brand}
                onChange={(e) => handleSelectChange('brand', e.target.value)}
                className="w-full p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Palette className="w-4 h-4 text-yellow-400" />
                Color
              </label>
              <select
                name="color"
                value={formData.color}
                onChange={(e) => handleSelectChange('color', e.target.value)}
                className="w-full p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">Select Color</option>
                {colors.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Layers className="w-4 h-4 text-purple-400" />
                Material
              </label>
              <select
                name="material"
                value={formData.material}
                onChange={(e) => handleSelectChange('material', e.target.value)}
                className="w-full p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">Select Material</option>
                {materials.map((material) => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Ruler className="w-4 h-4 text-cyan-400" />
                Size
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={(e) => handleSelectChange('size', e.target.value)}
                className="w-full p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 appearance-none cursor-pointer"
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                placeholder="499"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                required
                min="0"
                step="1"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Package className="w-4 h-4 text-green-400" />
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                placeholder="100"
                value={formData.stock}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200"
                required
                min="0"
                step="1"
              />
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center p-3.5 rounded-xl bg-gray-800/50 border border-gray-700">
            <label className="flex items-center gap-3 w-full cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-all duration-300 ${formData.inStock ? 'bg-green-500' : 'bg-gray-600'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${formData.inStock ? 'left-7' : 'left-1'}`}></div>
                </div>
              </div>
              <span className="text-gray-300 font-medium">In Stock</span>
              {formData.inStock ? (
                <Shield className="w-4 h-4 text-green-400" />
              ) : (
                <Shield className="w-4 h-4 text-gray-400" />
              )}
              <span className="ml-auto text-sm text-gray-400">
                {formData.inStock ? `(${formData.stock} units available)` : "(Out of stock)"}
              </span>
            </label>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Describe the cap features, material quality, style, and specifications..."
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 resize-none"
              required
            />
          </div>

          {/* Images Section */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <Image className="w-4 h-4 text-yellow-400" />
              Cap Images *
            </label>
            
            {/* Existing Images */}
            {formData.images.map((image, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="url"
                  placeholder="https://example.com/cap-image.jpg"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="flex-1 p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 hover:scale-110"
                  title="Remove image"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Focus on this input for editing
                    const input = document.querySelector(`input[value="${image}"]`);
                    input?.focus();
                  }}
                  className="p-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all duration-200 hover:scale-110"
                  title="Edit image URL"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {/* Add New Image */}
            <div className="flex items-center gap-3">
              <input
                type="url"
                placeholder="Add new image URL..."
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="flex-1 p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="p-3 bg-green-600 hover:bg-green-500 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
                title="Add image"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Add</span>
              </button>
            </div>
          </div>

          {/* Image Previews */}
          {formData.images.some(img => img.trim() !== "") && (
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Image className="w-4 h-4 text-yellow-400" />
                Image Previews
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {formData.images.filter(img => img.trim() !== "").map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Cap preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-xl border-2 border-gray-700 group-hover:border-yellow-500 transition-all duration-200"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg transition-all duration-200"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.querySelectorAll('input[type="url"]')[index];
                          input?.focus();
                        }}
                        className="p-1.5 bg-blue-500/80 hover:bg-blue-500 rounded-lg transition-all duration-200"
                        title="Edit image URL"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 font-medium flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 font-medium shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              {editingProduct ? (
                <>
                  <Edit3 className="w-4 h-4" />
                  Update Cap
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Cap
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}