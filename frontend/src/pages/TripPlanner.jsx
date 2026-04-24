import React, { useState } from 'react';
import { Search, Map, Calendar as CalendarIcon, Users, CreditCard, ChevronDown, Download, Share2, Save, RefreshCw } from 'lucide-react';
import { planTrip } from '../services/claude';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const TripPlanner = () => {
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    budget: 1000,
    currency: 'USD',
    style: 'Adventure',
    interests: ['History', 'Nature'],
    travelers: 2,
    language: 'English'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  const styles = ['Adventure', 'Cultural', 'Relaxing', 'Food & Dining', 'Nightlife'];
  const interestsList = ['History', 'Nature', 'Nightlife', 'Shopping', 'Art', 'Architecture', 'Sports'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR'];

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleGenerate = async () => {
    if (!formData.destination) {
      setError("Please enter a destination");
      return;
    }
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await planTrip(formData);
      setPlan(data);
    } catch (err) {
      setError(err.message || 'Failed to generate trip plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = plan ? {
    labels: ['Accommodation', 'Food', 'Transport', 'Activities'],
    datasets: [
      {
        data: [
          plan.budgetBreakdown.accommodation,
          plan.budgetBreakdown.food,
          plan.budgetBreakdown.transport,
          plan.budgetBreakdown.activities
        ],
        backgroundColor: [
          '#2563EB',
          '#10B981',
          '#F59E0B',
          '#EC4899'
        ],
        borderWidth: 0,
      },
    ],
  } : null;

  return (
    <div style={{ width: '100%', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '16px' }}>Plan Your Perfect Trip</h1>
        <p style={{ fontSize: '18px', color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto' }}>
          Tell us your preferences, and our AI will create a personalized, detailed itinerary just for you.
        </p>
      </div>

      {!plan ? (
        <div className="card" style={{ padding: '40px' }}>
          {error && (
            <div style={{ padding: '16px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          <div className="grid-4" style={{ marginBottom: '24px' }}>
            <div className="input-group" style={{ gridColumn: 'span 4' }}>
              <label>Destination</label>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-3)' }} />
                <input 
                  type="text" 
                  className="input-field w-full" 
                  placeholder="Where do you want to go? (e.g. Tokyo, Japan)"
                  value={formData.destination}
                  onChange={e => setFormData({...formData, destination: e.target.value})}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div className="input-group" style={{ gridColumn: 'span 2' }}>
              <label>Number of Days</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button 
                  onClick={() => setFormData(prev => ({...prev, days: Math.max(1, prev.days - 1)}))}
                  className="btn btn-secondary" style={{ padding: '10px 16px', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}>-</button>
                <div style={{ flex: 1, textAlign: 'center', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '10px', fontWeight: 600 }}>
                  {formData.days}
                </div>
                <button 
                  onClick={() => setFormData(prev => ({...prev, days: Math.min(30, prev.days + 1)}))}
                  className="btn btn-secondary" style={{ padding: '10px 16px', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>+</button>
              </div>
            </div>

            <div className="input-group" style={{ gridColumn: 'span 2' }}>
              <label>Number of Travelers</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button 
                  onClick={() => setFormData(prev => ({...prev, travelers: Math.max(1, prev.travelers - 1)}))}
                  className="btn btn-secondary" style={{ padding: '10px 16px', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}>-</button>
                <div style={{ flex: 1, textAlign: 'center', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '10px', fontWeight: 600 }}>
                  {formData.travelers}
                </div>
                <button 
                  onClick={() => setFormData(prev => ({...prev, travelers: Math.min(20, prev.travelers + 1)}))}
                  className="btn btn-secondary" style={{ padding: '10px 16px', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>+</button>
              </div>
            </div>

            <div className="input-group" style={{ gridColumn: 'span 2' }}>
              <label>Total Budget</label>
              <div style={{ display: 'flex' }}>
                <select 
                  className="input-field" 
                  value={formData.currency}
                  onChange={e => setFormData({...formData, currency: e.target.value})}
                  style={{ borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', borderRight: 'none', backgroundColor: 'var(--surface-2)' }}
                >
                  {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input 
                  type="number" 
                  className="input-field w-full" 
                  value={formData.budget}
                  onChange={e => setFormData({...formData, budget: e.target.value})}
                  style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
                />
              </div>
            </div>

            <div className="input-group" style={{ gridColumn: 'span 2' }}>
              <label>Language</label>
              <select 
                className="input-field w-full"
                value={formData.language}
                onChange={e => setFormData({...formData, language: e.target.value})}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-2)', marginBottom: '12px' }}>Travel Style</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {styles.map(style => (
                <button
                  key={style}
                  onClick={() => setFormData({...formData, style})}
                  style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-xl)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                    backgroundColor: formData.style === style ? 'var(--primary)' : 'var(--surface-2)',
                    color: formData.style === style ? 'white' : 'var(--text-1)',
                    border: `1px solid ${formData.style === style ? 'var(--primary)' : 'var(--border)'}`
                  }}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-2)', marginBottom: '12px' }}>Interests</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {interestsList.map(interest => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                    backgroundColor: formData.interests.includes(interest) ? 'var(--primary-light)' : 'transparent',
                    color: formData.interests.includes(interest) ? 'var(--primary)' : 'var(--text-2)',
                    border: `1px solid ${formData.interests.includes(interest) ? 'var(--primary)' : 'var(--border)'}`
                  }}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="btn btn-primary w-full btn-cta" 
            onClick={handleGenerate}
            disabled={isLoading}
            style={{ 
              background: 'linear-gradient(135deg, #2563EB, #0EA5E9)', 
              border: 'none',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Crafting your perfect trip...' : 'Generate Trip Plan'}
          </button>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '24px' }}>
            <button className="btn btn-secondary"><Save size={16} /> Save Trip</button>
            <button className="btn btn-secondary"><Share2 size={16} /> Share</button>
            <button className="btn btn-secondary"><Download size={16} /> Download PDF</button>
            <button className="btn btn-primary" onClick={() => setPlan(null)}><RefreshCw size={16} /> Regenerate</button>
          </div>

          <div className="grid-3">
            <div style={{ gridColumn: 'span 2' }}>
              <h2 style={{ marginBottom: '24px' }}>Your Itinerary</h2>
              {plan.itinerary.map((day, idx) => (
                <div key={idx} className="card" style={{ marginBottom: '16px', overflow: 'visible' }}>
                  <div style={{ padding: '16px 24px', backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: 'var(--radius-xl)', fontWeight: 'bold', fontSize: '14px' }}>Day {day.day}</div>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>{day.date}</h3>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{ position: 'relative' }}>
                      {/* Timeline line */}
                      <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '24px', width: '2px', backgroundColor: 'var(--border)' }}></div>
                      
                      {day.activities.map((activity, aIdx) => (
                        <div key={aIdx} style={{ display: 'flex', gap: '24px', marginBottom: aIdx === day.activities.length - 1 ? 0 : '32px', position: 'relative' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'white', border: '2px solid var(--primary)', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                          </div>
                          <div style={{ flex: 1, backgroundColor: 'var(--surface-2)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <div>
                                <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '4px' }}>{activity.time}</span>
                                <h4 style={{ margin: 0, fontSize: '16px' }}>{activity.name}</h4>
                              </div>
                              <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{formData.currency} {activity.cost}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '14px' }}>{activity.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '24px', textAlign: 'center' }}>Budget Breakdown</h3>
                <div style={{ width: '200px', margin: '0 auto 24px' }}>
                  <Doughnut data={chartData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(plan.budgetBreakdown).map(([category, amount], i) => {
                    const colors = ['#2563EB', '#10B981', '#F59E0B', '#EC4899'];
                    return (
                      <div key={category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors[i % colors.length] }}></div>
                          <span style={{ textTransform: 'capitalize', color: 'var(--text-2)', fontSize: '14px' }}>{category}</span>
                        </div>
                        <span style={{ fontWeight: 600 }}>{formData.currency} {amount}</span>
                      </div>
                    );
                  })}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Total</span>
                    <span>{formData.currency} {Object.values(plan.budgetBreakdown).reduce((a, b) => a + b, 0)}</span>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sun size={20} color="var(--primary)" /> Best Season
                </h3>
                <p style={{ margin: 0, fontSize: '14px' }}>{plan.bestSeason}</p>
              </div>

              <div className="card" style={{ padding: '24px', backgroundColor: 'var(--primary-light)' }}>
                <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Travel Tips</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-1)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {plan.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      )}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default TripPlanner;
