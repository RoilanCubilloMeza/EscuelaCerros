import React, { useState } from 'react';
import { useTheme } from '../components/Theme';
const Login = () => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === 'user@example.com' && password === 'password') {
      alert('Login successful!');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className={`container ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
        <h2 className={`m-3 ${darkMode ? 'text-white' : 'text-dark'}`}>Ingreso del Usuario</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Email:</label>
                <input type="email" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} value={email} onChange={handleEmailChange} required />
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input type="password" className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`} value={password} onChange={handlePasswordChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
    </div>
);
};

export default Login;
