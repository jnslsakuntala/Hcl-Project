import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return <div>Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return (
        <>
            <Navbar />
            <div className="container">
                {children}
            </div>
        </>
    );
};

const ConditionalDashboard = () => {
    const { user } = useContext(AuthContext);
    return user?.role === 'ROLE_ADMIN' ? <AdminDashboard /> : <UserDashboard />;
};

function App() {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <Navigate to="/dashboard" replace />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <ConditionalDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/tasks" 
                    element={
                        <ProtectedRoute>
                            <TaskList />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/tasks/add" 
                    element={
                        <ProtectedRoute>
                            <TaskForm />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/tasks/edit/:id" 
                    element={
                        <ProtectedRoute>
                            <TaskForm />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
