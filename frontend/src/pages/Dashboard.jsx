import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="dashboard">

            <h1>
                Welcome, {user?.name} 👋
            </h1>

            <h2>
                College Placement System
            </h2>

            <p>
                You are successfully logged in.
            </p>

            <p>
                Role: <strong>{user?.role}</strong>
            </p>
<button onClick={() => navigate("/profile")}>
  My Profile
</button>
            <button onClick={logout}>
                Logout
            </button>

        </div>
    );
};

export default Dashboard;