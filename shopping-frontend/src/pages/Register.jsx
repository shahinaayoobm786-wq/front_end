import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setIsError(true);
            setMessage("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setIsError(false);

            const res = await registerUser({
                username: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (res.data && res.data.token) {
                login(res.data.token, res.data.user);
            }

            setMessage("Registration successful! Redirecting to products...");
            setIsError(false);

            setTimeout(() => {
                navigate("/products");
            }, 800);
        } catch (error) {
            setIsError(true);
            setMessage(
                error.response?.data?.message ||
                (typeof error.response?.data === "string" ? error.response.data : "Registration failed! Email or username might already exist.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container" style={{ maxWidth: "440px", margin: "50px auto", padding: "35px", backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <h1 style={{ fontSize: "28px", color: "#111827", marginBottom: "8px" }}>Create Customer Account</h1>
            <p style={{ color: "#6b7280", marginBottom: "25px", fontSize: "14px" }}>
                Join us to browse our full catalog and start shopping today.
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                    />
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>
                        Email Address *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                    />
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>
                        Password *
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 6 characters"
                        required
                        style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                    />
                </div>

                <div style={{ marginBottom: "22px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>
                        Confirm Password *
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        required
                        style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: loading ? "#9ca3af" : "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer"
                    }}
                >
                    {loading ? "Creating Account..." : "Create Account"}
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

            <p style={{ marginTop: "22px", textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#2563eb", fontWeight: "600" }}>
                    Sign In
                </Link>
            </p>
        </div>
    );
}

export default Register;
