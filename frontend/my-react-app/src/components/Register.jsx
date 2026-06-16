import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaAccessibleIcon } from "react-icons/fa";
import { toast } from 'react-toastify';
function Register() {
    const navigate=useNavigate();
    const [username, setusername] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [accountType, setAccountType] = useState('');
    const [disabilityTypes, setDisabilityTypes] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    const handleDisabilityChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setDisabilityTypes([...disabilityTypes, value]);
        } else {
            setDisabilityTypes(disabilityTypes.filter((item) => item !== value));
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/register`,
            {
                username,
                email,
                password,
                accountType,
                disabilityTypes
            }
        );

        toast.info(response.data.message);
        console.log(response.data);
        if(response.data.message== 'User registered successfully')
        {
            navigate('/auth/login');
        }

    } catch (error) {
        console.error(error);

        toast.info(
            "Registration failed"
        );
    }
};

    return (
        <div className="register-wrapper">
            {/* Left Decorative Banner Panel */}
         <div className="banner-side">
    <div className="banner-content">

        <div className="accessibility-icon">
            <FaAccessibleIcon />
        </div>

        <h2>
            Join <br />
            AccessAbility
        </h2>

        <p>
            Empowering inclusive digital experiences.
            Create an account to customize, share,
            and explore accessibility-focused
            environments designed for everyone.
        </p>

    </div>
</div>

            {/* Right Interactive Form Area */}
            <div className="form-side">
                <div className="register-card">
                    <h1>Create Account</h1>
                    <p className="register-subtitle">Please fill in your details to configure your profile.</p>

                    <form onSubmit={handleSubmit}>
                        
                        <div className="form-group">
                            <label>
                                <h3>Full Name *</h3>
                                <input
                                    type="text"
                                    className="text-input"
                                    placeholder="Enter your name"
                                    value={username}
                                    onChange={(e) => setusername(e.target.value)}
                                    required
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label>
                                <h3>Email Address *</h3>
                                <input
                                    type="email"
                                    className="text-input"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setemail(e.target.value)}
                                    required
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label>
                                <h3>Password *</h3> 
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="text-input"
                                    placeholder="Create password"
                                    value={password}
                                    onChange={(e) => setpassword(e.target.value)}
                                    required
                                />
                            </label>
                        </div>

                        <label className="checkbox-option">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            Show Password
                        </label>

                        <h3 className="section-title">Account Type</h3>
                        
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="accountType"
                                value="Individual"
                                checked={accountType === "Individual"}
                                onChange={(e) => setAccountType(e.target.value)}
                            />
                            Individual
                        </label>

                        <label className="radio-option">
                            <input
                                type="radio"
                                name="accountType"
                                value="Organization"
                                checked={accountType === "Organization"}
                                onChange={(e) => setAccountType(e.target.value)}
                            />
                            Organization
                        </label>

                        <h3 className="section-title">Disability Type</h3>

                        <div className="disability-grid">
                            <label className="checkbox-option"><input type="checkbox" value="Mobility" onChange={handleDisabilityChange} /> Mobility</label>
                            <label className="checkbox-option"><input type="checkbox" value="Visual" onChange={handleDisabilityChange} /> Visual</label>
                            <label className="checkbox-option"><input type="checkbox" value="Hearing" onChange={handleDisabilityChange} /> Hearing</label>
                            <label className="checkbox-option"><input type="checkbox" value="Cognitive" onChange={handleDisabilityChange} /> Cognitive</label>
                            <label className="checkbox-option"><input type="checkbox" value="Chronic Illness" onChange={handleDisabilityChange} /> Chronic Illness</label>
                            <label className="checkbox-option"><input type="checkbox" value="Mental Health" onChange={handleDisabilityChange} /> Mental Health</label>
                            <label className="checkbox-option"><input type="checkbox" value="Speech" onChange={handleDisabilityChange} /> Speech</label>
                            <label className="checkbox-option"><input type="checkbox" value="Prefer Not to Say" onChange={handleDisabilityChange} /> Prefer Not to Say</label>
                        </div>

                        <button type="submit" className="submit-btn" onClick={handleSubmit}>
                            Create Account
                        </button>
                        
                        <p className="signin-footer">
                            Already have an account? 
                            <button type="button" className="inline-link-btn" onClick={(e)=>{navigate('/auth/login')}}>Sign in</button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;