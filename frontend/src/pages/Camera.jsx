import React, { useState, useRef } from 'react';
import { Camera as CameraIcon, Upload, ArrowLeft, MessageSquare, Sun, Sunset, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { identifyLandmark } from '../services/claude';

const Camera = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleIdentify = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await identifyLandmark(selectedImage);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (time) => {
    if (!time) return <Sun size={16} />;
    const lower = time.toLowerCase();
    if (lower.includes('morning')) return <Sun size={16} />;
    if (lower.includes('sunset') || lower.includes('evening')) return <Sunset size={16} />;
    if (lower.includes('night')) return <Moon size={16} />;
    return <Sun size={16} />;
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link to="/dashboard" style={{ color: 'var(--text-1)' }}><ArrowLeft size={24} /></Link>
        <h1 style={{ margin: 0 }}>Identify Landmark</h1>
      </div>

      <div className="card" style={{ padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
        {!previewUrl ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px 24px',
              cursor: 'pointer', transition: 'border-color 0.2s', backgroundColor: 'var(--surface-2)'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <CameraIcon size={48} color="var(--primary)" style={{ marginBottom: '16px', opacity: 0.8 }} />
            <h3 style={{ marginBottom: '8px' }}>Upload a Photo</h3>
            <p style={{ color: 'var(--text-2)', fontSize: '14px', margin: 0 }}>Drop a landmark photo or tap to upload</p>
          </div>
        ) : (
          <div>
            <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '24px' }}>
              <img src={previewUrl} alt="Preview" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', backgroundColor: '#000' }} />
              <button 
                onClick={() => { setPreviewUrl(null); setSelectedImage(null); setResult(null); }}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}
              >×</button>
            </div>
            
            {!result && !isLoading && (
              <button className="btn btn-primary w-full" onClick={handleIdentify} style={{ padding: '14px' }}>
                <Upload size={18} /> Identify Landmark
              </button>
            )}

            {isLoading && (
              <div style={{ padding: '24px 0' }}>
                <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
                <p style={{ color: 'var(--text-2)', fontWeight: 500 }}>Analyzing your photo...</p>
              </div>
            )}
            
            {error && (
              <div style={{ padding: '16px', backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-md)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                {error}
              </div>
            )}
          </div>
        )}
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleImageChange}
        />
      </div>

      {result && (
        <div className="card" style={{ padding: '32px', animation: 'fadeIn 0.5s ease' }}>
          <h2 style={{ marginBottom: '8px', color: 'var(--primary)' }}>{result.name}</h2>
          <p style={{ color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', fontWeight: 500 }}>
             {result.location}
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <span className="badge" style={{ fontSize: '14px', padding: '6px 12px' }}>
              {getIcon(result.bestTimeToVisit)} Best time: {result.bestTimeToVisit}
            </span>
            <span className="badge" style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-1)', fontSize: '14px', padding: '6px 12px' }}>
              {result.category}
            </span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '8px' }}>Description</h4>
            <p>{result.description}</p>
          </div>

          <div style={{ marginBottom: '32px', padding: '16px', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--primary)' }}>💡 Fun Fact</h4>
            <p style={{ margin: 0, color: 'var(--text-1)' }}>{result.funFact}</p>
          </div>

          <button 
            className="btn btn-secondary w-full" 
            onClick={() => navigate('/chat')}
            style={{ padding: '14px', borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            <MessageSquare size={18} /> Chat about this place
          </button>
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Camera;
