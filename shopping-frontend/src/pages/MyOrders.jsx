import { useEffect, useState, useContext } from "react";
import { getMyOrders } from "../services/orderService";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        if (!isAuthenticated) {
            setLoading(false);
            setError("AUTH_REQUIRED");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await getMyOrders();
            setOrders(response.data || []);
        } catch (err) {
            console.error("Failed to fetch order history:", err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError("AUTH_REQUIRED");
            } else {
                setError(
                    err.response
                        ? `Server error (${err.response.status}). Check backend logs.`
                        : "Could not connect to Spring Boot server. Please make sure the backend is running."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [isAuthenticated]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "PLACED":
                return { bg: "#dbeafe", text: "#1e40af", label: "Placed" };
            case "SHIPPED":
                return { bg: "#fef3c7", text: "#92400e", label: "Shipped" };
            case "DELIVERED":
                return { bg: "#d1fae5", text: "#065f46", label: "Delivered" };
            default:
                return { bg: "#f1f5f9", text: "#334155", label: status };
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
                <h2>Loading your order history...</h2>
            </div>
        );
    }

    if (error === "AUTH_REQUIRED") {
        return (
            <div style={{ maxWidth: "560px", margin: "60px auto", textAlign: "center", padding: "40px", backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: "52px", marginBottom: "15px" }}>🔒</div>
                <h2 style={{ fontSize: "22px", color: "#0f172a" }}>Sign In to View Orders</h2>
                <p style={{ color: "#64748b", margin: "10px 0 25px 0", fontSize: "14px" }}>
                    Your session has expired or you are not signed in. Please log in to view your order history.
                </p>
                <Link
                    to="/login?redirect=orders"
                    style={{
                        padding: "12px 28px",
                        backgroundColor: "#2563eb",
                        color: "white",
                        borderRadius: "8px",
                        fontWeight: "700",
                        textDecoration: "none",
                        display: "inline-block"
                    }}
                >
                    Sign In Now
                </Link>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: "600px", margin: "60px auto", textAlign: "center", padding: "40px", backgroundColor: "#fee2e2", borderRadius: "8px" }}>
                <p style={{ color: "#b91c1c", fontWeight: "bold" }}>{error}</p>
                <button
                    onClick={fetchOrders}
                    style={{
                        marginTop: "15px",
                        padding: "8px 18px",
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600"
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
            <h1 style={{ marginBottom: "8px", fontSize: "30px", color: "#0f172a" }}>My Orders</h1>
            <p style={{ color: "#64748b", marginBottom: "30px" }}>
                Track your past purchases, view summaries, and check real-time delivery statuses.
            </p>

            {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 20px", backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "52px", marginBottom: "15px" }}>📦</div>
                    <h2 style={{ fontSize: "22px", color: "#0f172a" }}>No orders placed yet</h2>
                    <p style={{ color: "#64748b", margin: "10px 0 25px 0" }}>
                        You haven't placed any orders yet. Discover our latest items today!
                    </p>
                    <Link
                        to="/products"
                        style={{
                            padding: "12px 28px",
                            backgroundColor: "#2563eb",
                            color: "white",
                            borderRadius: "8px",
                            fontWeight: "600",
                            textDecoration: "none",
                            display: "inline-block"
                        }}
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                    {orders.map((order) => {
                        const statusBadge = getStatusStyle(order.status);
                        const formattedDate = order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                              })
                            : "Recently Placed";

                        return (
                            <div
                                key={order.id}
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: "12px",
                                    border: "1px solid #e2e8f0",
                                    overflow: "hidden",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
                                }}
                            >
                                {/* Header */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "16px 22px",
                                        backgroundColor: "#f8fafc",
                                        borderBottom: "1px solid #e2e8f0",
                                        flexWrap: "wrap",
                                        gap: "10px"
                                    }}
                                >
                                    <div>
                                        <span style={{ fontWeight: "800", fontSize: "16px", color: "#0f172a" }}>
                                            Order #{order.id}
                                        </span>
                                        <span style={{ color: "#64748b", fontSize: "13px", marginLeft: "15px" }}>
                                            Placed on {formattedDate}
                                        </span>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                        <span
                                            style={{
                                                backgroundColor: statusBadge.bg,
                                                color: statusBadge.text,
                                                padding: "4px 12px",
                                                borderRadius: "16px",
                                                fontWeight: "700",
                                                fontSize: "12px"
                                            }}
                                        >
                                            {statusBadge.label}
                                        </span>
                                        <span style={{ fontWeight: "800", fontSize: "17px", color: "#1d4ed8" }}>
                                            ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ padding: "22px" }}>
                                    <div style={{ marginBottom: "16px", fontSize: "14px", color: "#475569" }}>
                                        <strong>Shipping Address:</strong> {order.shippingAddress || "Standard Delivery"}
                                    </div>

                                    {/* Items Table */}
                                    <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                                            <thead>
                                                <tr style={{ backgroundColor: "#f8fafc", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                                                    <th style={{ padding: "10px 14px", color: "#475569" }}>Product Item</th>
                                                    <th style={{ padding: "10px 14px", textAlign: "center", color: "#475569" }}>Qty</th>
                                                    <th style={{ padding: "10px 14px", textAlign: "right", color: "#475569" }}>Unit Price</th>
                                                    <th style={{ padding: "10px 14px", textAlign: "right", color: "#475569" }}>Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.orderItems && order.orderItems.length > 0 ? (
                                                    order.orderItems.map((item, idx) => (
                                                        <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                                            <td style={{ padding: "12px 14px", fontWeight: "600", color: "#0f172a" }}>
                                                                {item.product ? item.product.name : "Product"}
                                                            </td>
                                                            <td style={{ padding: "12px 14px", textAlign: "center" }}>
                                                                {item.quantity}
                                                            </td>
                                                            <td style={{ padding: "12px 14px", textAlign: "right" }}>
                                                                ₹{Number(item.unitPrice).toLocaleString("en-IN")}
                                                            </td>
                                                            <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: "700", color: "#0f172a" }}>
                                                                ₹{(Number(item.unitPrice) * item.quantity).toLocaleString("en-IN")}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" style={{ padding: "15px", textAlign: "center", color: "#64748b" }}>
                                                            Order details confirmed.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyOrders;
