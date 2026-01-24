import { createContext, useContext, useState, useEffect } from "react";
import { BaseUrl } from "../../SERVICES/Api";
const BASE_API = BaseUrl;

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to extract orders from user data
  const extractOrdersFromUser = (user, index) => {
    const ordersFromUser = [];
    
    // Check purchaseHistory
    if (user.purchaseHistory && user.purchaseHistory.length > 0) {
      user.purchaseHistory.forEach((purchase, purchaseIndex) => {
        if (purchase && typeof purchase === 'object') {
          ordersFromUser.push({
            id: purchase.id || `order-${user.id || index}-${purchaseIndex}`,
            orderId: purchase.orderId || `ORD-${Date.now()}-${index}-${purchaseIndex}`,
            email: user.email,
            userFullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || `User ${index + 1}`,
            status: purchase.status || "Completed",
            items: purchase.items || purchase.products || [],
            total: parseFloat(purchase.total || purchase.totalAmount || 0),
            subtotal: parseFloat(purchase.subtotal || purchase.total || 0),
            tax: parseFloat(purchase.tax || 0),
            date: purchase.date || purchase.createdAt || new Date().toISOString(),
            paymentMethod: purchase.paymentMethod || "Credit Card",
            shippingAddress: purchase.shippingAddress || user.addresses?.[0] || {},
          });
        }
      });
    }
    
    // Check orders field
    if (user.orders && user.orders.length > 0) {
      user.orders.forEach((order, orderIndex) => {
        if (order && typeof order === 'object') {
          ordersFromUser.push({
            id: order.id || `order-${user.id || index}-${orderIndex}`,
            orderId: order.orderId || `ORD-${Date.now()}-${index}-${orderIndex}`,
            email: user.email,
            userFullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || `User ${index + 1}`,
            status: order.status || "Completed",
            items: order.items || order.products || [],
            total: parseFloat(order.total || order.totalAmount || 0),
            subtotal: parseFloat(order.subtotal || order.total || 0),
            tax: parseFloat(order.tax || 0),
            date: order.date || order.createdAt || new Date().toISOString(),
            paymentMethod: order.paymentMethod || "Credit Card",
            shippingAddress: order.shippingAddress || user.addresses?.[0] || {},
          });
        }
      });
    }
    
    return ordersFromUser;
  };

  // Generate sample orders for demonstration
  const generateSampleOrders = (usersData, productsData) => {
    const sampleOrders = [];
    const statuses = ['Completed', 'Pending', 'Shipped', 'Processing', 'Cancelled'];
    
    if (usersData && usersData.length > 0 && productsData && productsData.length > 0) {
      // Create 5-10 sample orders
      const numOrders = 5 + Math.floor(Math.random() * 6);
      
      for (let i = 0; i < numOrders; i++) {
        const userIndex = i % usersData.length;
        const user = usersData[userIndex];
        const numItems = 1 + Math.floor(Math.random() * 4);
        const items = [];
        let subtotal = 0;
        
        for (let j = 0; j < numItems; j++) {
          const productIndex = Math.floor(Math.random() * Math.min(10, productsData.length));
          const product = productsData[productIndex];
          const quantity = 1 + Math.floor(Math.random() * 3);
          const price = product.price || 9.99 + Math.random() * 90;
          
          items.push({
            id: product.id || `prod-${j}`,
            name: product.name || `Product ${j + 1}`,
            price: price,
            quantity: quantity,
            image: product.image || product.images?.[0]
          });
          
          subtotal += price * quantity;
        }
        
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;
        
        // Random date in last 90 days
        const daysAgo = Math.floor(Math.random() * 90);
        const orderDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        
        sampleOrders.push({
          id: `sample-order-${i + 1}`,
          orderId: `ORD-${1000 + i}`,
          email: user.email || `user${userIndex + 1}@example.com`,
          userFullName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || `User ${userIndex + 1}`,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          items: items,
          total: total,
          subtotal: subtotal,
          tax: tax,
          date: orderDate.toISOString(),
          paymentMethod: ['Credit Card', 'PayPal', 'Stripe', 'Apple Pay'][Math.floor(Math.random() * 4)],
          shippingAddress: user.addresses?.[0] || { 
            street: `${123 + i} Main St`, 
            city: 'Demo City', 
            state: 'CA', 
            zipCode: '90001' 
          }
        });
      }
    }
    
    return sampleOrders;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Loading admin data...");
        
        // Fetch products, users, and categories
        const [productsRes, usersRes, categoriesRes] = await Promise.all([
          fetch(`${BASE_API}/products`),
          fetch(`${BASE_API}/users`),
          fetch(`${BASE_API}/categories`)
        ]);

        if (!productsRes.ok) throw new Error("Failed to fetch products");
        if (!usersRes.ok) throw new Error("Failed to fetch users");

        const productsData = await productsRes.json();
        const usersData = await usersRes.json();
        const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];

        console.log("Loaded users:", usersData);
        console.log("Loaded products:", productsData);
        console.log("Loaded categories:", categoriesData);

        setProducts(productsData || []);
        setUsers(usersData || []);
        setCategories(categoriesData || []);

        // Generate orders from users' data
        const allOrders = [];
        
        if (usersData && Array.isArray(usersData)) {
          usersData.forEach((user, index) => {
            const userOrders = extractOrdersFromUser(user, index);
            allOrders.push(...userOrders);
          });
        }

        // If no orders found, create sample data for demonstration
        if (allOrders.length === 0) {
          console.log("No orders found in user data. Creating sample orders for demonstration.");
          const sampleOrders = generateSampleOrders(usersData, productsData);
          allOrders.push(...sampleOrders);
        }

        console.log("Generated orders:", allOrders);
        setOrders(allOrders);
      } catch (error) {
        console.error("Error loading admin data:", error);
        setError(error.message);
        // Set empty arrays to prevent crashes
        setProducts([]);
        setUsers([]);
        setOrders([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addProduct = async (productData) => {
    try {
      const newProduct = {
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        rating: productData.rating || 4.0,
        inStock: productData.inStock !== undefined ? productData.inStock : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`${BASE_API}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) throw new Error("Failed to add product");

      const savedProduct = await response.json();
      setProducts((prev) => [...prev, savedProduct]);
      return { success: true, product: savedProduct };
    } catch (error) {
      console.error("Error adding product:", error);
      return { success: false, error: error.message };
    }
  };

  const editProduct = async (id, productData) => {
    try {
      const updatedProduct = {
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`${BASE_API}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) throw new Error("Failed to update product");

      const savedProduct = await response.json();
      setProducts((prev) => prev.map((p) => (p.id === id || p._id === id ? savedProduct : p)));
      return { success: true, product: savedProduct };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${BASE_API}/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, error: error.message };
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const response = await fetch(`${BASE_API}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) throw new Error("Failed to add category");

      const savedCategory = await response.json();
      setCategories((prev) => [...prev, savedCategory]);
      return { success: true, category: savedCategory };
    } catch (error) {
      console.error("Error adding category:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`${BASE_API}/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      setCategories((prev) => prev.filter((c) => c.id !== id && c._id !== id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting category:", error);
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const response = await fetch(`${BASE_API}/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to update user");

      const updatedUser = await response.json();
      setUsers((prev) => prev.map((u) => (u.id === id || u._id === id ? updatedUser : u)));

      // Update orders if user info changed
      if (userData.firstName || userData.lastName || userData.email) {
        setOrders((prev) =>
          prev.map((order) =>
            order.email === updatedUser.email
              ? {
                  ...order,
                  email: updatedUser.email,
                  userFullName: `${updatedUser.firstName || updatedUser.name} ${updatedUser.lastName || ""}`.trim(),
                }
              : order
          )
        );
      }

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteUser = async (id) => {
    try {
      const userToDelete = users.find((u) => u.id === id || u._id === id);
      const response = await fetch(`${BASE_API}/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((u) => u.id !== id && u._id !== id));

      if (userToDelete) {
        setOrders((prev) =>
          prev.filter((order) => order.email !== userToDelete.email)
        );
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const orderToUpdate = orders.find((order) => order.id === orderId);
      if (!orderToUpdate) throw new Error("Order not found");
      
      // Update orders state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      return { success: true, order: { ...orderToUpdate, status } };
    } catch (error) {
      console.error("Error updating order status:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      // Remove from state
      setOrders((prev) => prev.filter((order) => order.id !== orderId));

      return { success: true };
    } catch (error) {
      console.error("Error deleting order:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    products,
    users,
    orders,
    categories,
    loading,
    error,
    addProduct,
    editProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    updateUser,
    deleteUser,
    updateOrderStatus,
    deleteOrder,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};