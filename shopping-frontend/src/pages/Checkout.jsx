import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { checkoutOrder } from "../services/orderService";
import { useNavigate, Link } from "react-router-dom";

function Checkout() {
    const { cartItems, totalPrice, clearCart, loading: cartLoading } = useContext(CartContext);
    const { user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [shippingDetails, setShippingDetails] = useState({
        name: user?.username || "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [orderSuccess, setOrderSuccess] = useState(null);

    const handleChange = (e) => {
        setShippingDetails({
            ...shippingDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            navigate("/login?redirect=checkout", {
                state: { from: { pathname: "/checkout" } }
            });
            return;
        }

        if (cartItems.length === 0) {
            setError("Your cart is empty. Please add products before checking out.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await checkoutOrder(shippingDetails);
            clearCart();
            setOrderSuccess(response.data);
        } catch (err) {
            console.error("Checkout failed:", err);
            setError(
                err.response?.data?.message ||
                (typeof err.response?.data === "string" ? err.response.data : "Failed to place order. Please check item stock or try again.")
            );
        } finally {
            setLoading(false);
        }
    };

    if (cartLoading) {
        return (
            <div style={{ maxWidth: "600px", margin: "80px auto", textAlign: "center", padding: "40px" }}>
                <h2>Loading checkout details...</h2>
            </div>
        );
    }

    if (orderSuccess) {
        return (
            <div style={{ maxWidth: "600px", margin: "60px auto", textAlign: "center", padding: "40px", backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: "56px", color: "#16a34a", marginBottom: "12px" }}>✓</div>
                <h1 style={{ fontSize: "28px", color: "#0f172a", marginBottom: "10px" }}>Order Confirmed!</h1>
                <p style={{ color: "#475569", fontSize: "15px", marginBottom: "22px" }}>
                    Thank you! Your order <strong>#{orderSuccess.id}</strong> has been successfully placed.
                </p>
                <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "8px", marginBottom: "25px", textAlign: "left", fontSize: "14px", lineHeight: "1.6" }}>
                    <p><strong>Order Status:</strong> <span style={{ color: "#2563eb", fontWeight: "700" }}>{orderSuccess.status}</span></p>
                    <p><strong>Total Paid:</strong> ₹{Number(orderSuccess.totalAmount).toLocaleString("en-IN")}</p>
                    <p><strong>Shipping To:</strong> {orderSuccess.shippingAddress}</p>
                </div>
                <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                    <Link
                        to="/orders"
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "#2563eb",
                            color: "white",
                            borderRadius: "8px",
                            fontWeight: "600",
                            textDecoration: "none"
                        }}
                    >
                        View Order History
                    </Link>
                    <Link
                        to="/products"
                        style={{
                            padding: "12px 24px",
                            border: "1px solid #cbd5e1",
                            color: "#334155",
                            borderRadius: "8px",
                            fontWeight: "600",
                            textDecoration: "none"
                        }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div style={{ maxWidth: "600px", margin: "60px auto", textAlign: "center", padding: "40px", backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h2>Your cart is empty!</h2>
                <p style={{ color: "#64748b", margin: "10px 0 20px 0" }}>Add items to your cart before proceeding to checkout.</p>
                <Link to="/products" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>
                    &larr; Browse Catalog
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
            <h1 style={{ marginBottom: "30px", fontSize: "30px", color: "#0f172a" }}>Secure Checkout</h1>

            {error && (
                <div style={{ padding: "14px", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "8px", marginBottom: "20px" }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "40px", alignItems: "start" }}>
                {/* Shipping Details Form */}
                <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <h2 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "20px", color: "#0f172a" }}>
                        Step 1: Shipping Address
                    </h2>

                    <form onSubmit={handleSubmit} id="checkout-form">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={shippingDetails.name}
                                    onChange={handleChange}
                                    placeholder="e.g. John Doe"
                                    required
                                    style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={shippingDetails.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit mobile number"
                                    required
                                    style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                                Street Address *
                            </label>
                            <textarea
                                name="address"
                                value={shippingDetails.address}
                                onChange={handleChange}
                                placeholder="Apartment, suite, unit, building, floor, etc."
                                required
                                rows="3"
                                style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", resize: "vertical" }}
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "25px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                                    City *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={shippingDetails.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    required
                                    style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                                    State *
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={shippingDetails.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    required
                                    style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                                    Pincode / ZIP *
                                </label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={shippingDetails.pincode}
                                    onChange={handleChange}
                                    placeholder="Pincode"
                                    required
                                    style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                                />
                            </div>
                        </div>

                        <h2 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "15px", color: "#0f172a", paddingTop: "15px", borderTop: "1px solid #e2e8f0" }}>
                            Step 2: Payment Method
                        </h2>
                        <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "25px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "600", color: "#0f172a" }}>
                                <input type="radio" name="payment" defaultChecked />
                                💳 Cash on Delivery / Pay on Delivery (Instant Order Confirmation)
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "14px",
                                backgroundColor: loading ? "#94a3b8" : "#16a34a",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "17px",
                                fontWeight: "700",
                                cursor: loading ? "not-allowed" : "pointer"
                            }}
                        >
                            {loading ? "Processing Order..." : `Place Order • ₹${totalPrice.toLocaleString("en-IN")}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary Sidebar */}
                <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "15px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#0f172a" }}>
                        Order Summary ({cartItems.length} items)
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", maxHeight: "300px", overflowY: "auto" }}>
                        {cartItems.map((item) => (
                            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                <div>
                                    <div style={{ fontWeight: "600", color: "#0f172a" }}>{item.name}</div>
                                    <div style={{ color: "#64748b", fontSize: "12px" }}>Qty: {item.quantity} × ₹{Number(item.price).toLocaleString("en-IN")}</div>
                                </div>
                                <div style={{ fontWeight: "700", color: "#0f172a" }}>
                                    ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#475569", fontSize: "14px" }}>
                            <span>Subtotal:</span>
                            <span style={{ fontWeight: "600" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#475569", fontSize: "14px" }}>
                            <span>Delivery:</span>
                            <span style={{ color: "#16a34a", fontWeight: "700" }}>FREE</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px dashed #cbd5e1", paddingTop: "12px", fontSize: "18px", fontWeight: "800" }}>
                            <span>Total:</span>
                            <span style={{ color: "#1d4ed8" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
