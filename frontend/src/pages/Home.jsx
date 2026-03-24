import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, Users } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [sharedTasks, setSharedTasks] = useState([]);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await api.get('/connect/feed');
        if (res.data.length > 0) {
          setSharedTasks(res.data);
        } else {
          setSharedTasks([
            { id: 1, title: 'Drink 3L Water', owner: 'Alex', streak: 12, reactions: [{emoji: '🔥'}, {emoji: '💧'}] },
            { id: 2, title: 'Read 20 pages', owner: 'Sam', streak: 5, reactions: [{emoji: '📚'}, {emoji: '⭐'}] },
            { id: 3, title: 'Morning Run 5km', owner: 'Jordan', streak: 21, reactions: [{emoji: '🏃'}, {emoji: '🏆'}] }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch shared tasks", err);
      }
    };
    fetchShared();
  }, []);
  const repeatCount = sharedTasks.length > 0 ? Math.max(1, Math.ceil(15 / sharedTasks.length)) : 0;
  const loopTasks = sharedTasks.length > 0 ? Array(repeatCount).fill(sharedTasks).flat() : [];

  return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div className="animate-fade-in" style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          Build Better Habits Together
        </h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 2rem auto', fontStyle: 'italic' }}>
          "Motivation is what gets you started. Habit is what keeps you going."
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>Get Started Free</Link>
          <Link to="/login" className="btn btn-outline" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>Login</Link>
        </div>
      </div>

      <div className="glass animate-fade-in" style={{ padding: '3rem', marginTop: '4rem', animationDelay: '0.2s', textAlign: 'left' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>See What The Community Is Doing</h2>
        
        <div className="marquee-container no-scrollbar" style={{ paddingBottom: '1rem' }}>
          <div className="marquee-content" style={{ animationDuration: `${Math.max(loopTasks.length * 1.5, 20)}s` }}>
            {loopTasks.map((task, index) => (
              <div key={`s1-${task.id}-${index}`} className="glass" style={{ minWidth: '300px', padding: '1.5rem', flexShrink: 0, background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{task.title}</h3>
                  <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-primary)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    🔥 {task.streak || 0} Days
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Shared by @{task.owner}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {task.reactions.map((r, i) => (
                    <span key={`r1-${i}`} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '1.2rem' }}>
                      {r.emoji || r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true" style={{ animationDuration: `${Math.max(loopTasks.length * 1.5, 20)}s` }}>
            {loopTasks.map((task, index) => (
              <div key={`s2-${task.id}-${index}`} className="glass" style={{ minWidth: '300px', padding: '1.5rem', flexShrink: 0, background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{task.title}</h3>
                  <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-primary)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    🔥 {task.streak || 0} Days
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Shared by @{task.owner}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {task.reactions.map((r, i) => (
                    <span key={`r2-${i}`} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '1.2rem' }}>
                      {r.emoji || r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '4rem', textAlign: 'left' }}>
        <div className="glass" style={{ padding: '2rem' }}>
          <Target size={40} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
          <h3>Set Goals</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Create repeating tasks and track your daily completion.</p>
        </div>
        <div className="glass" style={{ padding: '2rem' }}>
          <TrendingUp size={40} color="var(--accent-success)" style={{ marginBottom: '1rem' }} />
          <h3>Level Up</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Watch your tasks glow and evolve as your streak grows.</p>
        </div>
        <div className="glass" style={{ padding: '2rem' }}>
          <Users size={40} color="var(--accent-secondary)" style={{ marginBottom: '1rem' }} />
          <h3>Connect</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Share tasks, react to friends, and stay accountable together.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
