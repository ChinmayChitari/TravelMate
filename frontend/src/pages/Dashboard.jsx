import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QuickActions from '../components/QuickActions';
import PlaceCard from '../components/PlaceCard';
import TourCard from '../components/TourCard';
import useStore from '../store';
import { getRecommendations } from '../services/claude';
import { Compass } from 'lucide-react';

const Dashboard = () => {
  const { tours, recommendations, setRecommendations } = useStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (recommendations.length === 0) {
        setLoading(true);
        try {
          const places = await getRecommendations();
          setRecommendations(places);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPlaces();
  }, [recommendations.length, setRecommendations]);

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A, #0EA5E9)',
        borderRadius: 'var(--radius-xl)',
        padding: '60px 40px',
        color: 'white',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* SVG Pattern Overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"60\\" height=\\"60\\" viewBox=\\"0 0 60 60\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cg fill=\\"none\\" fill-rule=\\"evenodd\\"%3E%3Cg fill=\\"%23ffffff\\" fill-opacity=\\"0.05\\"%3E%3Cpath d=\\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          zIndex: 1
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '16px', color: 'white' }}>Explore the World</h1>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '32px' }}>Your AI-powered travel companion for smarter, seamless journeys.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/map" className="btn btn-cta" style={{ backgroundColor: 'white', color: 'var(--primary)' }}>Start Exploring</Link>
            <Link to="/planner" className="btn btn-cta" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(4px)' }}>Plan a Trip</Link>
          </div>
        </div>
      </div>

      <QuickActions />

      {/* Previous Tours */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '24px' }}>Previous Tours</h2>
        {tours.length > 0 ? (
          <div style={{
            display: 'flex', overflowX: 'auto', paddingBottom: '16px', scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none', msOverflowStyle: 'none'
          }}>
            {tours.map((tour, idx) => (
              <TourCard key={idx} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--surface-2)', border: '1px dashed var(--border)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Compass size={32} />
            </div>
            <h3 style={{ marginBottom: '8px' }}>No trips yet</h3>
            <p style={{ marginBottom: '24px' }}>Looks like you haven't started your travel journey. Let's plan your first adventure!</p>
            <Link to="/planner" className="btn btn-primary">Plan Your First Trip</Link>
          </div>
        )}
      </section>

      {/* AI Recommendations */}
      <section>
        <h2 style={{ marginBottom: '24px' }}>AI Recommended Places</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading recommendations...</div>
        ) : (
          <div className="grid-3">
            {recommendations.map((place, idx) => (
              <PlaceCard key={idx} place={place} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
