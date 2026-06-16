import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function AdminRegister() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/admin-register`,
                { username, email, password, secretKey }
            );
            toast.success(response.data.message);
            navigate("/auth/login");
        } catch (error) {
            toast.error(error.response?.data?.error || "Admin registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-wrapper">
            {/* Left Banner */}
            <div className="banner-side">
                <div className="banner-content">
                    <div className="accessibility-icon" style={{ fontSize: "120px" }}>
                        🛡️
                    </div>
                    <h2>
                        Admin <br /> Portal
                    </h2>
                    <p>
                        Create an administrator account to manage
                        jobs, applications, and accessibility services
                        on the AccessAbility platform.
                    </p>

                    {/* Security notice */}
                    <div
                        style={{
                            marginTop: "28px",
                            background: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.25)",
                            borderRadius: "14px",
                            padding: "18px 22px",
                            textAlign: "left",
                        }}
                    >
                        <p style={{ fontWeight: "700", fontSize: "0.95rem", marginBottom: "6px" }}>
                            🔐 Restricted Access
                        </p>
                        <p style={{ fontSize: "0.85rem", opacity: 0.85, lineHeight: 1.6 }}>
                            A secret key is required to register as an admin.
                            Contact your system administrator if you don't have one.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Form */}
            <div className="form-side">
                <div className="register-card">
                    <h1>Admin Register</h1>
                    <p className="register-subtitle">
                        Fill in the details below to create your admin account.
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Username */}
                        <div className="form-group">
                            <label>
                                <h3>Full Name *</h3>
                                <input
                                    id="admin-username"
                                    type="text"
                                    className="text-input"
                                    placeholder="Enter admin name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </label>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label>
                                <h3>Email Address *</h3>
                                <input
                                    id="admin-email"
                                    type="email"
                                    className="text-input"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label>
                                <h3>Password *</h3>
                                <input
                                    id="admin-password"
                                    type={showPassword ? "text" : "password"}
                                    className="text-input"
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </label>
                        </div>

                        <label className="checkbox-option" style={{ marginBottom: "20px" }}>
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            Show Password
                        </label>

                        {/* Secret Key */}
                        <div className="form-group">
                            <label>
                                <h3>🔑 Admin Secret Key *</h3>
                                <input
                                    id="admin-secret-key"
                                    type="password"
                                    className="text-input"
                                    placeholder="Enter the admin secret key"
                                    value={secretKey}
                                    onChange={(e) => setSecretKey(e.target.value)}
                                    required
                                    style={{
                                        borderLeft: "4px solid #fcd34d",
                                        borderRadius: "0 12px 12px 0",
                                    }}
                                />
                            </label>
                        </div>

                        <button
                            id="admin-register-btn"
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                            style={{ background: loading ? "rgba(255,255,255,0.6)" : "white" }}
                        >
                            {loading ? "Creating Admin Account…" : "Create Admin Account"}
                        </button>

                        <p className="signin-footer">
                            Already have an account?{" "}
                            <button
                                type="button"
                                className="inline-link-btn"
                                onClick={() => navigate("/auth/login")}
                            >
                                Sign in
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminRegister;
