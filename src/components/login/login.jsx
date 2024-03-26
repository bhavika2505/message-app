import React, { useState } from 'react';
import './login.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/users/login', {
        email,
        password,
      });

      // Store the token in local storage
      localStorage.setItem('token', response.data.token);

      // Navigate to another route upon successful login
      // Replace '/dashboard' with the path you want to redirect to after login
      navigate('/dashboard');
    } catch (error) {
      // Handle login failure
      console.error(error.response ? error.response.data : error.message);
      // Optionally, inform the user of login failure
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login Form</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" // Changed to 'text' to allow email or phone
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email or Phone" 
            required 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
          />
          <div className="footer">
            <button type="submit">LOGIN</button>
            <p>New user? <span onClick={() => navigate('/register')} className="link">Login here</span></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;