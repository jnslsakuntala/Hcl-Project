import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/users/login', { username, password });
            login(response.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-panel auth-card">
                <div className="text-center mb-4">
                    <h2 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>Welcome Back</h2>
                    <p style={{color: 'var(--text-muted)'}}>Sign in to manage your tasks</p>
                </div>
                
                {error && <div className="mb-4" style={{color: 'var(--danger)', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px'}}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            required 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button type="submit" className="btn" style={{width: '100%'}}>
                        <LogIn size={18} /> Sign In
                    </button>
                </form>
                
                <div className="text-center mt-4" style={{fontSize: '0.875rem'}}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
