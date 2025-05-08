// src/components/AdminRouteGuard.js
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AdminRouteGuard = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <div>
      <h2>Admin Login</h2>
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AdminRouteGuard;
