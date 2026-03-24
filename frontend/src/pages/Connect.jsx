import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquarePlus } from 'lucide-react';

const Connect = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const res = await api.get('/connect/feed');
      setFeed(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleReaction = async (taskId, emoji) => {
    try {
      await api.post(`/connect/${taskId}/react`, { emoji });
      fetchFeed();
    } catch (err) {
      console.error(err);
    }
  };

  const availableEmojis = ['🔥', '👏', '💪', '🏆', '💧', '📚'];

  if (loading) return <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>Loading...</div>;

  return (
    <div className="page-container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Community Feed</h1>
        <p style={{ color: 'var(--text-muted)' }}>See what habits others are building</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {feed.length === 0 ? (
          <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No shared habits yet.</p>
          </div>
        ) : (
          feed.map(task => (
            <div key={task.id} className="glass animate-fade-in" style={{ padding: '2rem' }}>
              <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{task.title}</h3>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>@{task.owner}</span>
                </div>
                {task.description && <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{task.description}</p>}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {task.reactions.map((r, i) => (
                    <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>
                      {r.emoji}
                    </span>
                  ))}
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}><MessageSquarePlus size={20} /></span>
                  {availableEmojis.map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => handleReaction(task.id, emoji)}
                      className="btn"
                      style={{ padding: '0.25rem 0.5rem', background: 'transparent', fontSize: '1.25rem' }}
                      title="React"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Connect;
