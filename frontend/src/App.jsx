import StudentProfile from "./pages/StudentProfile";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";

import {
    AuthProvider,
    useAuth
} from "./context/AuthContext";


const ProtectedRoute = ({ children }) => {

    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};


const StudentRoute = ({ children }) => {

    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== "student") {
        return <Navigate to="/login" />;
    }

    return children;
};


function App() {

    return (

        <AuthProvider>

            <BrowserRouter>

                <Routes>
                    <Route
  path="/jobs/:id"
  element={
    <ProtectedRoute>
      <JobDetails />
    </ProtectedRoute>
  }
/>
                    {/* Home */}
                    <Route
                        path="/"
                        element={
                            <Navigate to="/login" />
                        }
                    />


                    {/* Authentication */}
                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />
                    <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <StudentProfile />
    </ProtectedRoute>
  }
/>
            <Route
  path="/jobs"
  element={
    <ProtectedRoute>
      <Jobs />
    </ProtectedRoute>
  }
/>


                    {/* Student Dashboard */}
                    <Route
                        path="/student-dashboard"
                        element={
                            <StudentRoute>
                                <StudentDashboard />
                            </StudentRoute>
                        }
                    />


                    {/* Temporary routes */}
                    <Route
                        path="/company-dashboard"
                        element={
                            <ProtectedRoute>
                                <div>
                                    Company Dashboard Coming Soon
                                </div>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/admin-dashboard"
                        element={
                            <ProtectedRoute>
                                <div>
                                    Admin Dashboard Coming Soon
                                </div>
                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </BrowserRouter>

        </AuthProvider>

    );
}

export default App;