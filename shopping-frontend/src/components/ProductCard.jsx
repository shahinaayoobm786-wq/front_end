import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    const [added, setAdded] = useState(false);
    const isOutOfStock = !product.stockQuantity || product.stockQuantity <= 0;

    const handleAdd = () => {
        addToCart(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div
            className="product-card"
            style={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
        >
            {/* Image Container with Fixed Aspect Ratio */}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "220px",
                    backgroundColor: "#f1f5f9",
                    overflow: "hidden"
                }}
            >
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.3s ease"
                    }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80";
                    }}
                />
                <span
                    style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        backgroundColor: "rgba(15, 23, 42, 0.85)",
                        backdropFilter: "blur(4px)",
                        color: "#f8fafc",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "4px 9px",
                        borderRadius: "20px",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase"
                    }}
                >
                    {product.category || "General"}
                </span>
            </div>

            {/* Product Details Section */}
            <div
                style={{
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1
                }}
            >
                <h3
                    style={{
                        fontSize: "17px",
                        fontWeight: "700",
                        color: "#0f172a",
                        lineHeight: "1.35",
                        height: "46px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        marginBottom: "6px"
                    }}
                    title={product.name}
                >
                    {product.name}
                </h3>

                <p
                    style={{
                        fontSize: "13px",
                        color: "#64748b",
                        lineHeight: "1.45",
                        height: "38px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        marginBottom: "14px"
                    }}
                    title={product.description}
                >
                    {product.description || "No description provided."}
                </p>

                {/* Price and Stock row */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "auto",
                        paddingTop: "10px",
                        borderTop: "1px solid #f1f5f9",
                        marginBottom: "14px"
                    }}
                >
                    <div style={{ fontSize: "20px", fontWeight: "800", color: "#1d4ed8" }}>
                        ₹{Number(product.price).toLocaleString("en-IN")}
                    </div>

                    <div>
                        {isOutOfStock ? (
                            <span
                                style={{
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    color: "#dc2626",
                                    backgroundColor: "#fee2e2",
                                    padding: "3px 8px",
                                    borderRadius: "12px"
                                }}
                            >
                                Out of Stock
                            </span>
                        ) : (
                            <span
                                style={{
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#059669",
                                    backgroundColor: "#d1fae5",
                                    padding: "3px 8px",
                                    borderRadius: "12px"
                                }}
                            >
                                In Stock: {product.stockQuantity}
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons pinned to bottom */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <Link
                        to={`/products/${product.id}`}
                        style={{
                            textAlign: "center",
                            padding: "9px 0",
                            border: "1.5px solid #2563eb",
                            borderRadius: "7px",
                            color: "#2563eb",
                            fontWeight: "600",
                            fontSize: "13px",
                            textDecoration: "none",
                            transition: "background-color 0.2s"
                        }}
                    >
                        Details
                    </Link>

                    <button
                        onClick={handleAdd}
                        disabled={isOutOfStock}
                        style={{
                            padding: "9px 0",
                            backgroundColor: isOutOfStock
                                ? "#94a3b8"
                                : added
                                ? "#16a34a"
                                : "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "7px",
                            fontWeight: "600",
                            fontSize: "13px",
                            cursor: isOutOfStock ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease"
                        }}
                    >
                        {isOutOfStock
                            ? "Unavailable"
                            : added
                            ? "✓ Added"
                            : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
