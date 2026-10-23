import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";
import { getAllOrders, updateOrderStatus } from "../services/orderService";

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("products"); // 'products' | 'orders'

    // Products state
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productForm, setProductForm] = useState({
        name: "",
        category: "Mobile",
        price: "",
        stockQuantity: "",
        imageUrl: "",
        description: ""
    });
    const [editingProductId, setEditingProductId] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);

    // Orders state
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Common feedback message
    const [alertMsg, setAlertMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const showNotification = (msg, isError = false) => {
        if (isError) {
            setErrorMsg(msg);
            setTimeout(() => setErrorMsg(""), 4000);
        } else {
            setAlertMsg(msg);
            setTimeout(() => setAlertMsg(""), 4000);
        }
    };

    // Load products
    const loadProducts = async () => {
        try {
            setLoadingProducts(true);
            const res = await getProducts();
            setProducts(res.data || []);
        } catch (err) {
            console.error("Failed to load products for admin:", err);
            showNotification("Failed to fetch products from backend.", true);
        } finally {
            setLoadingProducts(false);
        }
    };

    // Load all orders
    const loadOrders = async () => {
        try {
            setLoadingOrders(true);
            const res = await getAllOrders();
            setOrders(res.data || []);
        } catch (err) {
            console.error("Failed to load all orders for admin:", err);
            showNotification("Failed to fetch customer orders.", true);
        } finally {
            setLoadingOrders(false);
        }
    };

    useEffect(() => {
        if (activeTab === "products") {
            loadProducts();
        } else {
            loadOrders();
        }
    }, [activeTab]);

    // Handle form input
    const handleFormChange = (e) => {
        setProductForm({
            ...productForm,
            [e.target.name]: e.target.value
        });
    };

    // Open Modal for Add
    const handleOpenAddModal = () => {
        setEditingProductId(null);
        setProductForm({
            name: "",
            category: "Mobile",
            price: "",
            stockQuantity: "10",
            imageUrl: "",
            description: ""
        });
        setShowProductModal(true);
    };

    // Open Modal for Edit
    const handleOpenEditModal = (p) => {
        setEditingProductId(p.id);
        setProductForm({
            name: p.name,
            category: p.category || "General",
            price: p.price,
            stockQuantity: p.stockQuantity,
            imageUrl: p.imageUrl || "",
            description: p.description || ""
        });
        setShowProductModal(true);
    };

    // Save product (Add or Update)
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...productForm,
                price: Number(productForm.price),
                stockQuantity: Number(productForm.stockQuantity)
            };

            if (editingProductId) {
                await updateProduct(editingProductId, payload);
                showNotification("Product updated successfully!");
            } else {
                await createProduct(payload);
                showNotification("Product added successfully!");
            }

            setShowProductModal(false);
            loadProducts();
        } catch (err) {
            console.error("Failed to save product:", err);
            showNotification(err.response?.data?.message || "Failed to save product.", true);
        }
    };

    // Delete product
    const handleDeleteProduct = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            await deleteProduct(id);
            showNotification(`Product "${name}" deleted.`);
            loadProducts();
        } catch (err) {
            console.error("Failed to delete product:", err);
            showNotification("Failed to delete product.", true);
        }
    };

    // Update order status
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            showNotification(`Order #${orderId} status changed to ${newStatus}.`);
            loadOrders();
        } catch (err) {
            console.error("Failed to update order status:", err);
            showNotification("Failed to update order status.", true);
        }
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "30px auto", padding: "0 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", color: "#111827" }}>Admin Management Dashboard</h1>
                    <p style={{ color: "#6b7280" }}>Manage store inventory, adjust pricing and stock, and view customer orders.</p>
                </div>

                {activeTab === "products" && (
                    <button
                        onClick={handleOpenAddModal}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        + Add New Product
                    </button>
                )}
            </div>

            {/* Notification messages */}
            {alertMsg && (
                <div style={{ padding: "12px", backgroundColor: "#d1fae5", color: "#065f46", borderRadius: "6px", marginBottom: "20px" }}>
                    ✓ {alertMsg}
                </div>
            )}
            {errorMsg && (
                <div style={{ padding: "12px", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "6px", marginBottom: "20px" }}>
                    ✕ {errorMsg}
                </div>
            )}

            {/* Navigation Tabs */}
            <div style={{ display: "flex", gap: "10px", borderBottom: "2px solid #e5e7eb", marginBottom: "25px" }}>
                <button
                    onClick={() => setActiveTab("products")}
                    style={{
                        padding: "10px 24px",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "products" ? "3px solid #2563eb" : "none",
                        fontWeight: "600",
                        color: activeTab === "products" ? "#2563eb" : "#4b5563",
                        cursor: "pointer",
                        fontSize: "15px"
                    }}
                >
                    📦 Product Inventory ({products.length})
                </button>
                <button
                    onClick={() => setActiveTab("orders")}
                    style={{
                        padding: "10px 24px",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "orders" ? "3px solid #2563eb" : "none",
                        fontWeight: "600",
                        color: activeTab === "orders" ? "#2563eb" : "#4b5563",
                        cursor: "pointer",
                        fontSize: "15px"
                    }}
                >
                    📑 All Customer Orders ({orders.length})
                </button>
            </div>

            {/* TAB 1: Products Management */}
            {activeTab === "products" && (
                <div style={{ backgroundColor: "white", borderRadius: "10px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
                    {loadingProducts ? (
                        <div style={{ padding: "50px", textAlign: "center" }}>Loading products...</div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f9fafb", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                                    <th style={{ padding: "12px 16px" }}>Product</th>
                                    <th style={{ padding: "12px 16px" }}>Category</th>
                                    <th style={{ padding: "12px 16px" }}>Price</th>
                                    <th style={{ padding: "12px 16px" }}>Stock Available</th>
                                    <th style={{ padding: "12px 16px", textAlign: "center" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                        <td style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                                            <img
                                                src={p.imageUrl}
                                                alt={p.name}
                                                style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "6px" }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80";
                                                }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: "600", color: "#111827" }}>{p.name}</div>
                                                <div style={{ fontSize: "12px", color: "#6b7280" }}>ID: #{p.id}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "12px 16px" }}>
                                            <span style={{ backgroundColor: "#e5e7eb", padding: "3px 8px", borderRadius: "4px", fontSize: "12px" }}>
                                                {p.category || "General"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "12px 16px", fontWeight: "600" }}>
                                            ₹{Number(p.price).toLocaleString("en-IN")}
                                        </td>
                                        <td style={{ padding: "12px 16px" }}>
                                            {p.stockQuantity <= 0 ? (
                                                <span style={{ color: "#ef4444", fontWeight: "bold" }}>Out of Stock (0)</span>
                                            ) : p.stockQuantity < 5 ? (
                                                <span style={{ color: "#f59e0b", fontWeight: "600" }}>Low Stock ({p.stockQuantity})</span>
                                            ) : (
                                                <span style={{ color: "#10b981", fontWeight: "600" }}>{p.stockQuantity} units</span>
                                            )}
                                        </td>
                                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                            <button
                                                onClick={() => handleOpenEditModal(p)}
                                                style={{
                                                    marginRight: "8px",
                                                    padding: "5px 12px",
                                                    backgroundColor: "#3b82f6",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                                style={{
                                                    padding: "5px 12px",
                                                    backgroundColor: "#ef4444",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* TAB 2: All Customer Orders */}
            {activeTab === "orders" && (
                <div style={{ backgroundColor: "white", borderRadius: "10px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
                    {loadingOrders ? (
                        <div style={{ padding: "50px", textAlign: "center" }}>Loading customer orders...</div>
                    ) : orders.length === 0 ? (
                        <div style={{ padding: "60px", textAlign: "center", color: "#6b7280" }}>No customer orders placed yet.</div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f9fafb", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                                    <th style={{ padding: "12px 16px" }}>Order ID</th>
                                    <th style={{ padding: "12px 16px" }}>Customer</th>
                                    <th style={{ padding: "12px 16px" }}>Total Amount</th>
                                    <th style={{ padding: "12px 16px" }}>Address</th>
                                    <th style={{ padding: "12px 16px" }}>Items</th>
                                    <th style={{ padding: "12px 16px" }}>Current Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                        <td style={{ padding: "12px 16px", fontWeight: "700" }}>#{o.id}</td>
                                        <td style={{ padding: "12px 16px" }}>
                                            <div style={{ fontWeight: "600" }}>{o.user?.username || "Customer"}</div>
                                            <div style={{ fontSize: "12px", color: "#6b7280" }}>{o.user?.email}</div>
                                        </td>
                                        <td style={{ padding: "12px 16px", fontWeight: "700", color: "#1d4ed8" }}>
                                            ₹{Number(o.totalAmount).toLocaleString("en-IN")}
                                        </td>
                                        <td style={{ padding: "12px 16px", maxWidth: "200px", fontSize: "13px" }}>
                                            {o.shippingAddress}
                                        </td>
                                        <td style={{ padding: "12px 16px", fontSize: "13px" }}>
                                            {o.orderItems?.map((item, idx) => (
                                                <div key={idx}>
                                                    {item.quantity}x {item.product?.name || "Item"}
                                                </div>
                                            ))}
                                        </td>
                                        <td style={{ padding: "12px 16px" }}>
                                            <select
                                                value={o.status}
                                                onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                                style={{
                                                    padding: "6px 10px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #d1d5db",
                                                    fontWeight: "600",
                                                    backgroundColor:
                                                        o.status === "DELIVERED"
                                                            ? "#d1fae5"
                                                            : o.status === "SHIPPED"
                                                            ? "#fef3c7"
                                                            : "#dbeafe",
                                                    color:
                                                        o.status === "DELIVERED"
                                                            ? "#065f46"
                                                            : o.status === "SHIPPED"
                                                            ? "#92400e"
                                                            : "#1e40af"
                                                }}
                                            >
                                                <option value="PLACED">PLACED</option>
                                                <option value="SHIPPED">SHIPPED</option>
                                                <option value="DELIVERED">DELIVERED</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Modal for Add / Edit Product */}
            {showProductModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "30px",
                            borderRadius: "12px",
                            maxWidth: "500px",
                            width: "90%",
                            maxHeight: "90vh",
                            overflowY: "auto"
                        }}
                    >
                        <h2 style={{ marginBottom: "20px" }}>
                            {editingProductId ? "Edit Product Details" : "Add New Product"}
                        </h2>

                        <form onSubmit={handleSaveProduct}>
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={productForm.name}
                                    onChange={handleFormChange}
                                    required
                                    style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={productForm.category}
                                        onChange={handleFormChange}
                                        style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                                    >
                                        <option value="Mobile">Mobile</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={productForm.price}
                                        onChange={handleFormChange}
                                        required
                                        style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={productForm.stockQuantity}
                                    onChange={handleFormChange}
                                    required
                                    min="0"
                                    style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                                />
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={productForm.imageUrl}
                                    onChange={handleFormChange}
                                    placeholder="https://images.unsplash.com/..."
                                    style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                                />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={productForm.description}
                                    onChange={handleFormChange}
                                    rows="3"
                                    style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px", resize: "vertical" }}
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => setShowProductModal(false)}
                                    style={{
                                        padding: "8px 16px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        background: "white",
                                        cursor: "pointer"
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: "8px 20px",
                                        backgroundColor: "#2563eb",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        fontWeight: "600",
                                        cursor: "pointer"
                                    }}
                                >
                                    {editingProductId ? "Save Changes" : "Create Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
