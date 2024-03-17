import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import CSS file

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/generateToken', null, {
        params: {
          username: username,
          password: password
        }
      });
      
      const token = response.data.data;
      console.log('Token:', token); // Check if token is retrieved successfully
      document.cookie = `token=${token}; path=/; secure;`;
      navigate('/admin'); // Redirect to the admin panel
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
          <img src="https://i.ibb.co/PtL1n4K/Whats-App-Image-2024-03-16-at-23-16-39-removebg-preview.png" alt="Logo" />
      </div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
