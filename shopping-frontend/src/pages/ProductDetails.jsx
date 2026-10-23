import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { CartContext } from "../context/CartContext";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [added, setAdded] = useState(false);

    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await getProductById(id);
                setProduct(response.data);
            } catch (err) {
                console.error("Product Details API Error:", err);
                setError(
                    err.response
                        ? `Product not found (Status: ${err.response.status}).`
                        : "Cannot connect to the backend server."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
                <h2>Loading product details...</h2>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div style={{ maxWidth: "600px", margin: "60px auto", textAlign: "center", padding: "40px", backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h2 style={{ color: "#dc2626", marginBottom: "15px" }}>{error || "Product not found."}</h2>
                <Link
                    to="/products"
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#2563eb",
                        color: "white",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontWeight: "600",
                        display: "inline-block"
                    }}
                >
                    &larr; Back to Catalog
                </Link>
            </div>
        );
    }

    const isOutOfStock = !product.stockQuantity || product.stockQuantity <= 0;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div style={{ width: "90%", maxWidth: "1050px", margin: "40px auto" }}>
            <Link
                to="/products"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#475569",
                    fontWeight: "600",
                    fontSize: "14px",
                    textDecoration: "none",
                    marginBottom: "20px"
                }}
            >
                &larr; Back to Products
            </Link>

            <div className="product-details">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80";
                    }}
                />

                <div>
                    <h1>{product.name}</h1>

                    <p>{product.description || "High quality product with official manufacturer warranty and fast shipping."}</p>

                    <h2>₹{Number(product.price).toLocaleString("en-IN")}</h2>

                    <p>Category: {product.category || "General"}</p>

                    <p
                        style={
                            isOutOfStock
                                ? { backgroundColor: "#fee2e2", color: "#dc2626", fontWeight: "700" }
                                : { backgroundColor: "#d1fae5", color: "#065f46", fontWeight: "600" }
                        }
                    >
                        {isOutOfStock ? "✕ Currently Out of Stock" : `✓ In Stock (${product.stockQuantity} available)`}
                    </p>

                    {!isOutOfStock && (
                        <div style={{ marginTop: "10px", marginBottom: "15px" }}>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            >
                                −
                            </button>
                            <span>{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                            >
                                +
                            </button>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "10px" }}>
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            style={{
                                backgroundColor: isOutOfStock
                                    ? "#94a3b8"
                                    : added
                                    ? "#16a34a"
                                    : "#2563eb",
                                cursor: isOutOfStock ? "not-allowed" : "pointer",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {isOutOfStock
                                ? "Currently Unavailable"
                                : added
                                ? "✓ Added to Cart!"
                                : "Add to Cart"}
                        </button>

                        <Link
                            to="/cart"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "50px",
                                padding: "0 20px",
                                border: "1.5px solid #2563eb",
                                borderRadius: "9px",
                                color: "#2563eb",
                                fontWeight: "600",
                                fontSize: "15px",
                                textDecoration: "none",
                                whiteSpace: "nowrap",
                                transition: "all 0.2s ease"
                            }}
                        >
                            View Cart 🛒
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
