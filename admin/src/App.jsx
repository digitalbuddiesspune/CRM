import React, { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      // Verify token is still valid by checking with backend
      const verifyToken = async () => {
        try {
          const apiUrl = VITE_BACKEND_URL || "http://localhost:3001/api/v1";
          const response = await axios.get(`${apiUrl}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.success) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
          } else {
            // Token invalid, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } catch (error) {
          // Token invalid or expired, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } finally {
          setLoading(false);
        }
      };

      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (loginData) => {
    setIsAuthenticated(true);
    setUser(loginData.user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <div className="text-lg font-medium text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard apiUrl={VITE_BACKEND_URL} user={user} onLogout={handleLogout} />
    </div>
  );
}

export default App;
