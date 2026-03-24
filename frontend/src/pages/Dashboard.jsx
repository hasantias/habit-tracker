import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Check, Share2, Trash2, Repeat } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', repeat_interval: 'daily', is_shared: false });
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    
    try {
      await api.post('/tasks/', newTask);
      setNewTask({ title: '', repeat_interval: 'daily', is_shared: false });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogTask = async (id) => {
    try {
      await api.post(`/tasks/${id}/log`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getTaskStyle = (streak) => {
    if (streak >= 21) return { border: '2px solid var(--accent-primary)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' };
    if (streak >= 7) return { border: '2px solid var(--accent-success)', boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)' };
    return {};
  };

  if (loading) return <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>Loading...</div>;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>My Habits</h1>
        <div style={{ color: 'var(--text-muted)' }}>
          Welcome back, <span style={{ color: 'white', fontWeight: 600 }}>{localStorage.getItem('username')}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <div>
          <div className="glass" style={{ padding: '2rem', position: 'sticky', top: '6rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Create New Habit</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Habit Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Drink 3L Water"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Repeat Interval</label>
                <select 
                  className="form-input" 
                  value={newTask.repeat_interval}
                  onChange={e => setNewTask({...newTask, repeat_interval: e.target.value})}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="shared"
                  checked={newTask.is_shared}
                  onChange={e => setNewTask({...newTask, is_shared: e.target.checked})}
                />
                <label htmlFor="shared" style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Share to Community</label>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Plus size={20} /> Add Habit
              </button>
            </form>
          </div>
        </div>

        <div>
          {tasks.length === 0 ? (
            <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>You haven't added any habits yet.</p>
              <p>Create one to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.map(task => (
                <div key={task.id} className="glass animate-fade-in" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s', ...getTaskStyle(task.streak) }}>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {task.title}
                      {task.is_shared && <Share2 size={16} color="var(--accent-secondary)" />}
                    </h4>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Repeat size={14} /> {task.repeat_interval}
                      </span>
                      <span style={{ color: task.streak >= 7 ? 'var(--accent-success)' : (task.streak > 0 ? 'var(--accent-primary)' : 'inherit'), fontWeight: task.streak > 0 ? 600 : 400 }}>
                        🔥 Streak: {task.streak}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleLogTask(task.id)} className="btn" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-success)', padding: '0.5rem 1rem' }}>
                      <Check size={20} /> Log
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', padding: '0.5rem' }}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
