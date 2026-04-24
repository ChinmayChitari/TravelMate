import React from 'react';
import { Plane, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../store';
import '../styles/global.css';

const Navbar = () => {
  const user = useStore(state => state.user);

  return (
    <nav style={{
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(8px)',
      padding: '16px 0'
    }}>
      <div className="nav-inner" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '0 24px'
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plane color="var(--primary)" size={24} />
          <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '20px' }}>TravelMate</span>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 500, color: 'var(--text-1)' }}>{user.name}</span>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
          }}>
            {user.avatar}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
