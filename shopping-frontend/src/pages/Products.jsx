import { useEffect, useState, useMemo } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [maxPrice, setMaxPrice] = useState(100000);

    const fetchProductList = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getProducts();
            setProducts(response.data || []);
        } catch (err) {
            console.error("Product API Error:", err);
            setError(
                err.response
                    ? `Backend returned status ${err.response.status}`
                    : "Cannot connect to Spring Boot backend. Please verify server is running on port 8080."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductList();
    }, []);

    // Unique categories from products
    const categories = useMemo(() => {
        const set = new Set(products.map((p) => p.category).filter(Boolean));
        return ["ALL", ...Array.from(set)];
    }, [products]);

    // Dynamic filtering
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                !searchTerm.trim() ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                (product.description &&
                    product.description.toLowerCase().includes(searchTerm.toLowerCase().trim()));

            const matchesCategory =
                selectedCategory === "ALL" ||
                (product.category &&
                    product.category.toLowerCase() === selectedCategory.toLowerCase());

            const matchesPrice = Number(product.price) <= maxPrice;

            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [products, searchTerm, selectedCategory, maxPrice]);

    return (
        <div className="products-container">
            <h1>Product Catalog</h1>

            {/* Search and Filters */}
            <div className="product-filters" style={{ flexWrap: "wrap", alignItems: "center" }}>
                <input
                    type="text"
                    placeholder="🔍 Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ minWidth: "260px" }}
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat === "ALL" ? "All Categories" : cat}
                        </option>
                    ))}
                </select>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                    <label>Max Price: ₹{Number(maxPrice).toLocaleString("en-IN")}</label>
                    <input
                        type="range"
                        min="1000"
                        max="100000"
                        step="1000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        style={{ width: "120px", cursor: "pointer", height: "auto" }}
                    />
                </div>

                <button
                    onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("ALL");
                        setMaxPrice(100000);
                    }}
                    style={{
                        padding: "8px 14px",
                        backgroundColor: "#f3f4f6",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "13px"
                    }}
                >
                    Reset
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <h3>Loading products from backend...</h3>
                </div>
            ) : error ? (
                <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fee2e2", borderRadius: "8px" }}>
                    <p style={{ color: "#b91c1c", fontWeight: "bold" }}>{error}</p>
                    <button
                        onClick={fetchProductList}
                        style={{
                            marginTop: "15px",
                            padding: "8px 18px",
                            backgroundColor: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        Retry Connection
                    </button>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <h3>No products found matching your filter criteria.</h3>
                    <p style={{ color: "#6b7280", marginTop: "10px" }}>Try clearing search or filters.</p>
                </div>
            ) : (
                <div className="product-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Products;
