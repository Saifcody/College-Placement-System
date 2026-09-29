import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            const response = await api.post(
                "/auth/login",
                formData
            );

            console.log("LOGIN RESPONSE:", response.data);

            const { token, user } = response.data;

            console.log("LOGIN USER:", user);

            login(user, token);

            if (user.role === "student") {
                navigate("/student-dashboard");
            } else if (user.role === "company") {
                navigate("/company-dashboard");
            } else if (user.role === "admin") {
                navigate("/admin-dashboard");
            }

        } catch (error) {
            console.error("LOGIN ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>Welcome Back</h1>

                <p className="auth-subtitle">
                    Login to College Placement System
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                </form>

                <p className="switch-text">
                    Don't have an account?

                    <span onClick={() => navigate("/register")}>
                        Register
                    </span>
                </p>

            </div>

        </div>
    );
};

export default Login;