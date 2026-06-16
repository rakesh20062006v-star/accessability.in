import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { toast } from 'react-toastify';
function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                {
                    username,
                    password,
                }
            );
            if(response.data.role==='admin'){
                
                localStorage.setItem(
                 "user",
                 JSON.stringify({
                  username: username,
                   role: response.data.role
                   })
                   );

                toast.info('admin logined');
                navigate('/admin-dashboard');
            }

            if (response.data.message === "Login successful") {
                  localStorage.setItem(
                    "user",
                         JSON.stringify({
                      username: username,
                      role: response.data.role
                         })
                 );
                
                
                toast.info(response.data.message)
                 navigate('/dashboard');
            }
        } catch (error) {
            toast.info("Invalid username or password");
            console.error(error);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-banner">
                <div className="banner-content">
                    <div className="accessibility-icon">♿</div>

                    <h1>Welcome Back</h1>

                    <p>
                        Sign in to access personalized accessibility
                        services and continue your journey with
                        AccessAbility.
                    </p>
                </div>
            </div>

            <div className="login-form-side">
                <div className="login-card">
                    <h2 className="login-title">Login</h2>

                    <p className="login-subtitle">
                        Enter your credentials to continue
                    </p>

                    <form >
                        <input
                            className="login-input"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            required
                        />

                        <input
                            className="login-input"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                        <label className="show-password">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() =>
                                    setShowPassword(!showPassword)
                                }
                            />
                            Show Password
                        </label>
                        <button className="forgot-btn" onClick={()=> navigate("/auth/fpass")}>
                            Forgot Password?
                        </button>
                        <button
                            type="submit"
                            className="login-btn"
                            onClick={handleSubmit}
                        >
                            Login
                        </button>
                    </form>

                    <p className="register-text">
                        Don't have an account?
                        <span
                            className="register-link"
                            onClick={() =>
                                navigate("/auth/register")
                            }
                        >
                            Register
                        </span>
                    </p>
                    <p className="register-text" style={{ marginTop: '10px', fontSize: '13px' }}>
                        Are you an admin?
                        <span
                            className="register-link"
                            style={{ color: '#fbbf24' }}
                            onClick={() => navigate("/auth/admin-register")}
                        >
                            Register as Admin
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;