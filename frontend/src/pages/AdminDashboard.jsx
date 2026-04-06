import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Activity, Users, CheckCircle, Clock, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllTasks = async () => {
            try {
                const response = await api.get('/tasks/all');
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching all tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'ROLE_ADMIN') {
            fetchAllTasks();
        }
    }, [user]);

    const handleDelete = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this system task forever?")) {
            try {
                await api.delete(`/tasks/${taskId}`);
                setTasks(tasks.filter(t => t.id !== taskId));
            } catch (error) {
                console.error("Error deleting task", error);
                alert("Failed to delete task from system.");
            }
        }
    };

    const handleEdit = (taskId) => {
        navigate(`/tasks/edit/${taskId}`);
    };

    if (loading) return <div className="text-center p-8">Loading Admin Dashboard...</div>;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;
    const highPriority = tasks.filter(t => t.priority === 'High').length;

    return (
        <div className="fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-400">Welcome back, {user.name}. Here is the global system overview.</p>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-red-500 bg-opacity-20 text-red-400 text-sm border border-red-500 border-opacity-50 font-bold">
                    Administrator
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-panel p-6 flex items-center gap-4 hover-scale">
                    <div className="p-4 rounded-full bg-blue-500 bg-opacity-20 text-blue-400">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total System Tasks</p>
                        <p className="text-2xl font-bold">{totalTasks}</p>
                    </div>
                </div>

                <div className="glass-panel p-6 flex items-center gap-4 hover-scale">
                    <div className="p-4 rounded-full bg-green-500 bg-opacity-20 text-green-400">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Completed</p>
                        <p className="text-2xl font-bold">{completedTasks}</p>
                    </div>
                </div>

                <div className="glass-panel p-6 flex items-center gap-4 hover-scale">
                    <div className="p-4 rounded-full bg-yellow-500 bg-opacity-20 text-yellow-400">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Pending</p>
                        <p className="text-2xl font-bold">{pendingTasks}</p>
                    </div>
                </div>

                <div className="glass-panel p-6 flex items-center gap-4 hover-scale">
                    <div className="p-4 rounded-full bg-red-500 bg-opacity-20 text-red-400">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">High Priority (Global)</p>
                        <p className="text-2xl font-bold">{highPriority}</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6">
                <h2 className="text-xl font-bold mb-4">Global System Tasks</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white border-opacity-10">
                                <th className="py-3 px-4 font-semibold text-gray-300">Task Title</th>
                                <th className="py-3 px-4 font-semibold text-gray-300">Status</th>
                                <th className="py-3 px-4 font-semibold text-gray-300">Priority</th>
                                <th className="py-3 px-4 font-semibold text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.id} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5 transition-colors">
                                    <td className="py-3 px-4">{task.title}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${task.status === 'Completed' ? 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-50' : 
                                              task.status === 'In Progress' ? 'bg-blue-500 bg-opacity-20 text-blue-400 border border-blue-500 border-opacity-50' : 
                                              'bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500 border-opacity-50'}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${task.priority === 'High' ? 'bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-50' : 
                                              task.priority === 'Medium' ? 'bg-blue-500 bg-opacity-20 text-blue-400 border border-blue-500 border-opacity-50' : 
                                              'bg-gray-500 bg-opacity-20 text-gray-300 border border-gray-500 border-opacity-50'}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(task.id)} className="p-2 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20 rounded transition-colors" title="Edit System Task">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(task.id)} className="p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors" title="Delete System Task">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tasks.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-400">No tasks currently exist in the entire system.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
