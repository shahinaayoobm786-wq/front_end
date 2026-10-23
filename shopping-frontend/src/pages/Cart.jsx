import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
    const {
        cartItems,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalPrice,
        cartCount
    } = useContext(CartContext);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate("/login?redirect=checkout", {
                state: { from: { pathname: "/checkout" } }
            });
        } else {
            navigate("/checkout");
        }
    };

    return (
        <div className="cart-container" style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
            <h1 style={{ marginBottom: "25px", fontSize: "30px", color: "#0f172a" }}>
                Shopping Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
            </h1>

            {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "70px 20px", backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "52px", marginBottom: "12px" }}>🛒</div>
                    <h2 style={{ fontSize: "22px", color: "#0f172a" }}>Your cart is currently empty</h2>
                    <p style={{ color: "#64748b", margin: "10px 0 25px 0" }}>
                        Explore our products and find great items to add to your cart.
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
                        Browse Catalog
                    </Link>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px", alignItems: "start" }}>
                    {/* Cart Items List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: "700", color: "#475569", fontSize: "14px" }}>ITEMS IN YOUR CART</span>
                            <button
                                onClick={clearCart}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#ef4444",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    fontWeight: "600"
                                }}
                            >
                                Clear All
                            </button>
                        </div>

                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    display: "flex",
                                    gap: "18px",
                                    padding: "16px",
                                    backgroundColor: "white",
                                    borderRadius: "10px",
                                    border: "1px solid #e2e8f0",
                                    alignItems: "center"
                                }}
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    style={{
                                        width: "85px",
                                        height: "85px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        backgroundColor: "#f1f5f9"
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80";
                                    }}
                                />

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                                        {item.name}
                                    </h3>
                                    <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                                        {item.category || "General"}
                                    </span>
                                    <div style={{ marginTop: "8px", fontWeight: "700", color: "#1d4ed8" }}>
                                        ₹{Number(item.price).toLocaleString("en-IN")}
                                    </div>
                                </div>

                                {/* Quantity Controls */}
                                <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "6px" }}>
                                    <button
                                        onClick={() => decreaseQuantity(item.id)}
                                        style={{ padding: "6px 12px", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#334155" }}
                                    >
                                        −
                                    </button>
                                    <span style={{ padding: "6px 10px", fontWeight: "700", minWidth: "20px", textAlign: "center" }}>
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => increaseQuantity(item.id)}
                                        style={{ padding: "6px 12px", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#334155" }}
                                    >
                                        +
                                    </button>
                                </div>

                                <div style={{ minWidth: "110px", textAlign: "right" }}>
                                    <div style={{ fontWeight: "800", fontSize: "17px", color: "#0f172a" }}>
                                        ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#ef4444",
                                            cursor: "pointer",
                                            fontSize: "12px",
                                            marginTop: "6px",
                                            fontWeight: "600"
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Card */}
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "24px",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
                        }}
                    >
                        <h2 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "18px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", color: "#0f172a" }}>
                            Order Summary
                        </h2>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#475569", fontSize: "14px" }}>
                            <span>Total Items:</span>
                            <span style={{ fontWeight: "600" }}>{cartCount}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#475569", fontSize: "14px" }}>
                            <span>Subtotal:</span>
                            <span style={{ fontWeight: "600" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px", color: "#475569", fontSize: "14px" }}>
                            <span>Standard Delivery:</span>
                            <span style={{ color: "#16a34a", fontWeight: "700" }}>FREE</span>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "22px",
                                paddingTop: "14px",
                                borderTop: "2px dashed #cbd5e1",
                                fontSize: "18px",
                                fontWeight: "800",
                                color: "#0f172a"
                            }}
                        >
                            <span>Grand Total:</span>
                            <span style={{ color: "#1d4ed8" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
                        </div>

                        <button
                            id="checkout-btn"
                            onClick={handleCheckout}
                            style={{
                                width: "100%",
                                padding: "14px",
                                backgroundColor: "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "16px",
                                fontWeight: "700",
                                cursor: "pointer",
                                transition: "background-color 0.2s",
                                display: "block",
                                textAlign: "center"
                            }}
                        >
                            Proceed to Checkout &rarr;
                        </button>

                        <div style={{ textAlign: "center", marginTop: "14px" }}>
                            <Link to="/products" style={{ color: "#64748b", fontSize: "13px", textDecoration: "none" }}>
                                or Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
