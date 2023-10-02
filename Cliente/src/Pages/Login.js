import React, { useState, useEffect } from 'react';
import { useTheme } from '../components/Theme';

const Login = () => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-dark');
      document.body.classList.add('text-white');
    } else {
      document.body.classList.remove('bg-dark');
      document.body.classList.remove('text-white');
      document.body.classList.add('bg-light');
      document.body.classList.add('text-dark');
    }

    return () => {
      document.body.classList.remove('bg-dark', 'text-white', 'bg-light', 'text-dark');
    };
  }, [darkMode]);

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
    <div className="container">
        <h2 className="m-3">Ingreso del Usuario</h2>
        <form className="container" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Email:</label>
                <input type="email" className={`form-control ${darkMode ? 'bg-secondary' : ''}`} value={email} onChange={handleEmailChange} required />
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input type="password" className={`form-control ${darkMode ? 'bg-secondary' : ''}`} value={password} onChange={handlePasswordChange} required />
            </div>
            <div className=''>
            <button type="submit" className="btn btn-primary ml.2 m-3">Login</button>
            <button type="button" className="btn btn-success ml-2">Olvidó contraseña</button>
            </div>
          
        </form>
    </div>
  );
};

export default Login;
