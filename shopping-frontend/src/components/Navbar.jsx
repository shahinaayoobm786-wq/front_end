import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const { cartCount, clearCart } = useContext(CartContext);
    const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        clearCart();
        navigate("/login");
    };

    return (
        <nav>
            <h2>
                <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                    Shopping Corner 🛍️
                </Link>
            </h2>

            <div>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/cart">Cart ({cartCount})</Link>

                {isAuthenticated ? (
                    <>
                        <Link to="/orders">My Orders</Link>
                        {isAdmin && (
                            <Link
                                to="/admin"
                                style={{
                                    backgroundColor: "#ef4444",
                                    color: "white",
                                    padding: "4px 10px",
                                    borderRadius: "4px",
                                    fontWeight: "600"
                                }}
                            >
                                Admin Panel
                            </Link>
                        )}
                        <span style={{ color: "#9ca3af", fontSize: "13px" }}>
                            👤 {user?.username || user?.email}
                            {isAdmin && " (Admin)"}
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: "none",
                                border: "1px solid #4b5563",
                                color: "#f3f4f6",
                                padding: "6px 12px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "13px"
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
