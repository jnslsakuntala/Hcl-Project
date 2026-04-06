import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, CheckCircle } from 'lucide-react';

const TaskList = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [searchTitle, setSearchTitle] = useState('');

    const fetchTasks = async () => {
        try {
            let url = `/tasks/user/${user.id}?`;
            if (filterStatus) url += `status=${filterStatus}&`;
            if (filterPriority) url += `priority=${filterPriority}&`;
            if (searchTitle) url += `search=${searchTitle}`;
            
            const response = await api.get(url);
            setTasks(response.data);
        } catch (err) {
            console.error('Failed to fetch tasks', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchTasks();
    }, [user, filterStatus, filterPriority, searchTitle]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${id}`);
                setTasks(tasks.filter(t => t.id !== id));
            } catch (err) {
                console.error('Failed to delete task', err);
            }
        }
    };

    const handleMarkComplete = async (task) => {
        try {
            const updatedTask = { ...task, status: 'Completed', userId: user.id };
            await api.put(`/tasks/${task.id}`, updatedTask);
            setTasks(tasks.map(t => (t.id === task.id ? { ...t, status: 'Completed' } : t)));
        } catch (err) {
            console.error('Failed to mark complete', err);
        }
    };

    if (loading) return <div>Loading tasks...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2>My Tasks</h2>
                <Link to="/tasks/add" className="btn">
                    + Add New Task
                </Link>
            </div>

            <div className="glass-panel filter-bar" style={{padding: '1.5rem'}}>
                <div className="input-group" style={{marginBottom: 0}}>
                    <label>Search by Title</label>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                    />
                </div>
                <div className="input-group" style={{marginBottom: 0}}>
                    <label>Filter by Status</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div className="input-group" style={{marginBottom: 0}}>
                    <label>Filter by Priority</label>
                    <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                        <option value="">All</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>

            <div>
                {tasks.map(task => (
                    <div key={task.id} className="task-item glass-panel" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <div className="flex justify-between items-start">
                            <div style={{flex: 1}}>
                                <h3 style={{margin: 0, textDecoration: task.status === 'Completed' ? 'line-through' : 'none'}}>{task.title}</h3>
                                <p style={{color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: '0.5rem'}}>{task.description}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`badge badge-${task.status === 'Completed' ? 'completed' : task.status === 'In Progress' ? 'progress' : 'pending'}`}>
                                        {task.status}
                                    </span>
                                    <span className={`badge badge-${task.priority.toLowerCase()}`}>
                                        {task.priority} Priority
                                    </span>
                                    {task.deadline && (
                                        <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>
                                            Due: {new Date(task.deadline).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                {task.status !== 'Completed' && (
                                    <button 
                                        className="btn btn-secondary" 
                                        title="Mark Complete"
                                        onClick={() => handleMarkComplete(task)}
                                        style={{padding: '0.5rem', color: 'var(--success)'}}
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                )}
                                <Link to={`/tasks/edit/${task.id}`} className="btn btn-secondary" title="Edit" style={{padding: '0.5rem', color: 'var(--primary)'}}>
                                    <Edit2 size={18} />
                                </Link>
                                <button 
                                    className="btn btn-secondary text-danger" 
                                    title="Delete"
                                    onClick={() => handleDelete(task.id)}
                                    style={{padding: '0.5rem', color: 'var(--danger)'}}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="text-center" style={{padding: '3rem', color: 'var(--text-muted)'}}>
                        No tasks found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskList;
