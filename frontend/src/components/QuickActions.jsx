import React from 'react';
import { MessageSquare, Camera, Map, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const actions = [
    { id: 'chat', label: 'Talk to Guide', icon: <MessageSquare size={24} />, link: '/chat', gradient: 'linear-gradient(135deg, #2563EB, #0EA5E9)' },
    { id: 'camera', label: 'Scan Landmark', icon: <Camera size={24} />, link: '/camera', gradient: 'linear-gradient(135deg, #0EA5E9, #10B981)' },
    { id: 'planner', label: 'Trip Planner', icon: <Calendar size={24} />, link: '/planner', gradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)' },
    { id: 'map', label: 'Explore Map', icon: <Map size={24} />, link: '/map', gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)' }
  ];

  return (
    <div className="grid-4" style={{ marginBottom: '40px' }}>
      {actions.map(action => (
        <Link to={action.link} key={action.id} style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '24px', textAlign: 'center', height: '100%' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              background: action.gradient
            }}>
              {action.icon}
            </div>
            <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{action.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
