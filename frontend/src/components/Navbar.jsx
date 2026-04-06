import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ListTodo } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-panel navbar">
            <div className="flex items-center gap-4">
                <div style={{fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)'}}>
                    SmartTask
                </div>
                <Link to="/dashboard" className="btn btn-secondary" style={{border: 'none', padding: '0.5rem 1rem'}}>
                    <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/tasks" className="btn btn-secondary" style={{border: 'none', padding: '0.5rem 1rem'}}>
                    <ListTodo size={18} /> Tasks
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <span>Welcome, <strong>{user?.name || user?.username}</strong>!</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
