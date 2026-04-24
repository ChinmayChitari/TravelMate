import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, Camera as CameraIcon, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sendMessage } from '../services/claude';

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Travel Guide. How can I help you explore the world today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.slice(-5); // Keep last 5 messages for context
      const response = await sendMessage(userMsg, history, language);
      setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (err) {
      setError(err.message || 'Connection failed. Please try again.');
      // Remove the user message if it failed or keep it? We'll keep it and show error.
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUserMsg = messages.filter(m => m.role === 'user').pop();
    if (lastUserMsg) {
      setInput(lastUserMsg.content);
      setError(null);
    }
  };

  return (
    <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/dashboard" style={{ color: 'var(--text-2)' }}><ArrowLeft size={24} /></Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>AI Travel Guide</h2>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} title="Online"></div>
          </div>
        </div>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--surface-2)', fontSize: '14px', outline: 'none' }}
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>Hindi</option>
        </select>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: 'var(--surface-2)' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '16px',
            gap: '12px'
          }}>
            {msg.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>
                <Globe size={18} color="var(--primary)" />
              </div>
            )}
            <div style={{
              maxWidth: '75%',
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'white',
              color: msg.role === 'user' ? 'white' : 'var(--text-1)',
              boxShadow: msg.role === 'assistant' ? 'var(--shadow-sm)' : 'none',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              borderTopRightRadius: msg.role === 'user' ? '4px' : 'var(--radius-lg)',
              borderTopLeftRadius: msg.role === 'assistant' ? '4px' : 'var(--radius-lg)',
            }}>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'inherit' }}>{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <Globe size={18} color="var(--primary)" />
            </div>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: 'white', borderTopLeftRadius: '4px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-3)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-3)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></div>
                <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-3)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <p style={{ color: 'var(--text-2)', marginBottom: '8px' }}>{error}</p>
            <button className="btn btn-secondary" onClick={handleRetry}>Retry</button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '16px 24px', backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--surface-2)', padding: '8px 16px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <button className="btn-icon" style={{ padding: '4px' }}><CameraIcon size={20} /></button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '15px', color: 'var(--text-1)' }}
          />
          <button className="btn-icon" style={{ padding: '4px' }}><Mic size={20} /></button>
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{ 
              backgroundColor: input.trim() && !isLoading ? 'var(--primary)' : 'var(--text-3)', 
              color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s'
            }}>
            <Send size={16} style={{ marginLeft: '2px' }} />
          </button>
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Chat;
