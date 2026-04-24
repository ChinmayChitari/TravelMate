import React from 'react';
import { Bookmark, Share2, Info, Sun, Sunset, Moon } from 'lucide-react';

const PlaceCard = ({ place }) => {
  const getIcon = (time) => {
    if (!time) return <Sun size={14} />;
    const lower = time.toLowerCase();
    if (lower.includes('morning')) return <Sun size={14} />;
    if (lower.includes('sunset') || lower.includes('evening')) return <Sunset size={14} />;
    if (lower.includes('night')) return <Moon size={14} />;
    return <Sun size={14} />;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '200px', width: '100%' }}>
        <img 
          src={place.imageUrl || `https://source.unsplash.com/300x200/?${encodeURIComponent(place.name)}`} 
          alt={place.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white'
        }}>
          <h3 style={{ margin: 0, color: 'white' }}>{place.name}</h3>
        </div>
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--primary)' }}>
            {getIcon(place.bestTime)} {place.bestTime}
          </span>
        </div>
      </div>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: '14px', flex: 1, marginBottom: '16px' }}>{place.description}</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <button className="btn-icon"><Bookmark size={18} /></button>
          <button className="btn-icon"><Share2 size={18} /></button>
          <button className="btn-icon"><Info size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
