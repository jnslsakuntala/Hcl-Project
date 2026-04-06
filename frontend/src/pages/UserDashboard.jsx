import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.get(`/tasks/user/${user.id}`);
                setTasks(response.data);
            } catch (err) {
                console.error('Failed to fetch tasks', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTasks();
        }
    }, [user]);

    if (loading) return <div>Loading dashboard...</div>;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2>Dashboard Overview</h2>
                <Link to="/tasks/add" className="btn">
                    + Add New Task
                </Link>
            </div>

            <div className="dashboard-grid">
                <div className="glass-panel stat-card">
                    <div className="stat-icon" style={{background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)'}}>
                        <ListTodo size={24} />
                    </div>
                    <div>
                        <div className="stat-value">{totalTasks}</div>
                        <div className="stat-label">Total Tasks</div>
                    </div>
                </div>
                
                <div className="glass-panel stat-card">
                    <div className="stat-icon" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)'}}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <div className="stat-value">{completedTasks}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                </div>
                
                <div className="glass-panel stat-card">
                    <div className="stat-icon" style={{background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)'}}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <div className="stat-value">{pendingTasks}</div>
                        <div className="stat-label">Pending / In Progress</div>
                    </div>
                </div>

                <div className="glass-panel stat-card">
                    <div className="stat-icon" style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)'}}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <div className="stat-value">{highPriorityTasks}</div>
                        <div className="stat-label">High Priority (Active)</div>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{padding: '1.5rem'}}>
                <h3>Recent Tasks</h3>
                {tasks.slice(0, 5).map(task => (
                    <div key={task.id} className="task-item glass-panel" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                            <div style={{fontWeight: 500}}>{task.title}</div>
                            <div style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>{task.deadline ? `Due: ${new Date(task.deadline).toLocaleDateString()}` : 'No deadline'}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`badge badge-${task.status === 'Completed' ? 'completed' : task.status === 'In Progress' ? 'progress' : 'pending'}`}>
                                {task.status}
                            </span>
                            <span className={`badge badge-${task.priority.toLowerCase()}`}>
                                {task.priority}
                            </span>
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && <p style={{color: 'var(--text-muted)'}}>No tasks yet. Start by creating one!</p>}
            </div>
        </div>
    );
};

export default Dashboard;
