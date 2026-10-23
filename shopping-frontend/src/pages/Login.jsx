import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Check both query param and route state
    const searchParams = new URLSearchParams(location.search);
    const redirectParam = searchParams.get("redirect");
    const targetPath = location.state?.from?.pathname || (redirectParam ? `/${redirectParam}` : "/");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage("");
            setIsError(false);

            const response = await loginUser({ email, password });
            login(response.data.token, response.data.user);

            setMessage("Login successful! Redirecting...");
            setIsError(false);

            setTimeout(() => {
                navigate(targetPath, { replace: true });
            }, 600);
        } catch (error) {
            setIsError(true);
            setMessage(
                error.response?.data?.message ||
                (typeof error.response?.data === "string" ? error.response.data : "Invalid email or password.")
            );
        } finally {
            setLoading(false);
        }
    };

    const fillCredentials = (userEmail, userPassword) => {
        setEmail(userEmail);
        setPassword(userPassword);
    };

    return (
        <div className="login-container" style={{ maxWidth: "440px", margin: "50px auto", padding: "35px", backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <h1 style={{ fontSize: "28px", color: "#0f172a", marginBottom: "8px" }}>Welcome Back</h1>
            <p style={{ color: "#64748b", marginBottom: "25px", fontSize: "14px" }}>
                Login to access your shopping cart, checkout, and past orders.
            </p>

            {/* Quick Demo Credentials */}
            <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px dashed #cbd5e1", marginBottom: "20px", fontSize: "13px" }}>
                <div style={{ fontWeight: "700", marginBottom: "8px", color: "#334155" }}>Quick 1-Click Demo Logins:</div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        type="button"
                        onClick={() => fillCredentials("customer@shopping.com", "customer123")}
                        style={{
                            padding: "6px 12px",
                            backgroundColor: "#e0e7ff",
                            color: "#3730a3",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "700"
                        }}
                    >
                        Customer Login
                    </button>
                    <button
                        type="button"
                        onClick={() => fillCredentials("admin@shopping.com", "admin123")}
                        style={{
                            padding: "6px 12px",
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "700"
                        }}
                    >
                        Admin Login
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px" }}
                    />
                </div>

                <div style={{ marginBottom: "22px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px" }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: loading ? "#94a3b8" : "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "700",
                        cursor: loading ? "not-allowed" : "pointer"
                    }}
                >
                    {loading ? "Authenticating..." : "Sign In"}
                </button>
            </form>

            {message && (
                <div
                    style={{
                        marginTop: "18px",
                        padding: "10px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: isError ? "#fee2e2" : "#d1fae5",
                        color: isError ? "#b91c1c" : "#065f46"
                    }}
                >
                    {message}
                </div>
            )}

            <p style={{ marginTop: "22px", textAlign: "center", fontSize: "14px", color: "#64748b" }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>
                    Create Account
                </Link>
            </p>
        </div>
    );
}

export default Login;
