import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const TaskForm = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [task, setTask] = useState({
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        deadline: ''
    });
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            const fetchTask = async () => {
                try {
                    const response = await api.get(`/tasks/${id}`);
                    const fetchedTask = response.data;
                    // Format datetime to local mapping for datetime-local input
                    let formattedDeadline = '';
                    if (fetchedTask.deadline) {
                        formattedDeadline = new Date(fetchedTask.deadline).toISOString().slice(0, 16);
                    }
                    setTask({
                        ...fetchedTask,
                        deadline: formattedDeadline
                    });
                } catch (err) {
                    setError('Failed to fetch task details.');
                } finally {
                    setLoading(false);
                }
            };
            fetchTask();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const payload = {
                ...task,
                userId: user.id,
                deadline: task.deadline ? task.deadline : null
            };

            if (isEditMode) {
                await api.put(`/tasks/${id}`, payload);
            } else {
                await api.post('/tasks', payload);
            }
            navigate('/tasks');
        } catch (err) {
            setError(err.response?.data || 'Failed to save task.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
            <div className="flex justify-between items-center mb-4">
                <h2>{isEditMode ? 'Edit Task' : 'Add New Task'}</h2>
                <Link to="/tasks" className="btn btn-secondary">Cancel</Link>
            </div>

            <div className="glass-panel" style={{padding: '2rem'}}>
                {error && <div className="mb-4" style={{color: 'var(--danger)'}}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Task Title *</label>
                        <input 
                            name="title"
                            type="text" 
                            required 
                            value={task.title}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Description</label>
                        <textarea 
                            name="description"
                            rows="4"
                            value={task.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                        <div className="input-group">
                            <label>Status</label>
                            <select name="status" value={task.status} onChange={handleChange}>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Priority</label>
                            <select name="priority" value={task.priority} onChange={handleChange}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Deadline (Optional)</label>
                        <input 
                            name="deadline"
                            type="datetime-local" 
                            value={task.deadline || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mt-4 flex gap-4">
                        <button type="submit" className="btn">
                            {isEditMode ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
