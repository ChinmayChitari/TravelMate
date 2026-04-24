import React from 'react';
import { Calendar } from 'lucide-react';

const TourCard = ({ tour }) => {
  return (
    <div className="card" style={{
      minWidth: '280px',
      marginRight: '16px',
      display: 'inline-block',
      scrollSnapAlign: 'start'
    }}>
      <div style={{ position: 'relative', height: '160px' }}>
        <img 
          src={tour.image || `https://source.unsplash.com/280x160/?${encodeURIComponent(tour.destination)}`} 
          alt={tour.destination}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{tour.destination}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-2)', fontSize: '14px', marginBottom: '16px' }}>
          <Calendar size={14} />
          <span>{tour.date}</span>
        </div>
        <button className="btn btn-secondary w-full">View Details</button>
      </div>
    </div>
  );
};

export default TourCard;
