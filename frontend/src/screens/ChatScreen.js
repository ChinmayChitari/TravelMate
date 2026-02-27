import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { FaMicrophone, FaPaperPlane, FaCamera, FaStop } from 'react-icons/fa';
import { theme } from '../theme';
import API_BASE, { getAuthHeaders } from '../api';

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
`;

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  background: ${theme.colors.background};
`;

const Header = styled.header`
  background: ${theme.gradients.hero};
  color: white;
  padding: ${theme.spacing.lg}px ${theme.spacing.xl}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${theme.shadows.md};
  z-index: 10;
`;

const BackBtn = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: ${theme.radii.round}px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${theme.typography.sizes.xl}px;
  font-weight: ${theme.typography.weights.bold};
`;

const ChatArea = styled.div`
  flex: 1;
  padding: ${theme.spacing.lg}px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md}px;
  scroll-behavior: smooth;
`;

const MessageBubble = styled(motion.div)`
  max-width: 82%;
  padding: ${theme.spacing.md}px ${theme.spacing.lg}px;
  border-radius: ${theme.radii.lg}px;
  font-size: ${theme.typography.sizes.md}px;
  line-height: 1.5;
  word-wrap: break-word;
  align-self: ${(p) => (p.$isUser ? 'flex-end' : 'flex-start')};
  background: ${(p) =>
    p.$isUser ? theme.colors.userBubble : theme.colors.aiBubble};
  color: ${(p) => (p.$isUser ? 'white' : theme.colors.text)};
  border-bottom-right-radius: ${(p) => (p.$isUser ? '6px' : theme.radii.lg + 'px')};
  border-bottom-left-radius: ${(p) => (p.$isUser ? theme.radii.lg + 'px' : '6px')};
  box-shadow: ${(p) =>
    p.$isUser ? theme.shadows.button : theme.shadows.card};
  border: ${(p) =>
    p.$isUser ? 'none' : `1px solid ${theme.colors.aiBubbleBorder}`};

  p { margin: 0 0 0.5em; }
  p:last-child { margin-bottom: 0; }
  strong { font-weight: ${theme.typography.weights.bold}; }
`;

const TypingIndicator = styled(motion.div)`
  align-self: flex-start;
  padding: ${theme.spacing.md}px ${theme.spacing.lg}px;
  border-radius: ${theme.radii.lg}px;
  background: ${theme.colors.aiBubble};
  border: 1px solid ${theme.colors.aiBubbleBorder};
  display: flex;
  gap: 6px;
  box-shadow: ${theme.shadows.card};
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${theme.colors.secondary};
  animation: ${pulse} 1.2s ease-in-out infinite;
  animation-delay: ${(p) => p.$delay || 0}s;
`;

const InputRow = styled.div`
  padding: ${theme.spacing.md}px ${theme.spacing.lg}px ${theme.spacing.xl}px;
  background: ${theme.colors.surface};
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm}px;
`;

const IconButton = styled.button`
  background: ${(p) => (p.$active ? theme.colors.error : theme.colors.backgroundDark)};
  color: ${(p) => (p.$active ? 'white' : theme.colors.textSecondary)};
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: ${(p) => (p.$active ? theme.shadows.fab : theme.shadows.sm)};
  &:hover {
    transform: scale(1.05);
  }
`;

const InputField = styled.input`
  flex: 1;
  padding: 14px 20px;
  border-radius: ${theme.radii.xxl}px;
  border: 1px solid rgba(91, 127, 255, 0.2);
  background: ${theme.colors.background};
  outline: none;
  font-size: ${theme.typography.sizes.md}px;
  font-family: inherit;
  transition: all 0.2s;
  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(91, 127, 255, 0.15);
  }
`;

const SendButton = styled(IconButton)`
  background: ${theme.gradients.buttonPrimary};
  color: white;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FAB = styled(motion.button)`
  position: fixed;
  bottom: ${theme.spacing.xl + 60}px;
  right: ${theme.spacing.lg}px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${theme.gradients.buttonPrimary};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  cursor: pointer;
  box-shadow: ${theme.shadows.fab};
  z-index: 20;
  &:hover {
    transform: scale(1.08);
  }
`;

export default function ChatScreen() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI Travel Guide. 🌍 Ask me about any place or upload a photo from the camera screen!",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  const speak = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    if (isRecording) {
      setIsRecording(false);
      window.speechRecognitionInstance?.stop();
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };
      window.speechRecognitionInstance = recognition;
      recognition.start();
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userMsg = { text: inputText, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/chat`, { message: inputText }, { headers: getAuthHeaders() });
      const botMsg = { text: response.data.reply, isUser: false };
      setMessages((prev) => [...prev, botMsg]);
      speak(response.data.reply);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ I'm having trouble connecting. Is the backend running?",
          isUser: false,
        },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <BackBtn onClick={() => navigate('/')} aria-label="Back">
          ←
        </BackBtn>
        <HeaderTitle>Talk to Guide</HeaderTitle>
        <div style={{ width: 40 }} />
      </Header>

      <ChatArea>
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              $isUser={msg.isUser}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.isUser ? (
                msg.text
              ) : (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              )}
            </MessageBubble>
          ))}
        </AnimatePresence>
        {isLoading && (
          <TypingIndicator
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dot $delay={0} />
            <Dot $delay={0.2} />
            <Dot $delay={0.4} />
          </TypingIndicator>
        )}
        <div ref={chatEndRef} />
      </ChatArea>

      <InputRow>
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          title="Upload photo / Scan landmark"
          aria-label="Upload photo"
        >
          <FaCamera />
        </IconButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
              const base64Image = reader.result;
              setMessages((prev) => [
                ...prev,
                { text: '📷 Analyzing image...', isUser: true },
              ]);
              setIsLoading(true);
              try {
                const res = await axios.post(`${API_BASE}/image/analyze`, {
                  image: base64Image,
                }, { headers: getAuthHeaders() });
                const { name, description } = res.data;
                const replyText = `That looks like **${name}**! ${description}`;
                setMessages((prev) => [
                  ...prev,
                  { text: replyText, isUser: false },
                ]);
                speak(`That looks like ${name}! ${description}`);
              } catch {
                setMessages((prev) => [
                  ...prev,
                  {
                    text: "Sorry, I couldn't identify that place.",
                    isUser: false,
                  },
                ]);
              }
              setIsLoading(false);
            };
          }}
          style={{ display: 'none' }}
          accept="image/*"
        />
        <InputField
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <IconButton
          onClick={toggleListening}
          $active={isRecording}
          title="Voice input"
          aria-label="Voice input"
        >
          {isRecording ? <FaStop /> : <FaMicrophone />}
        </IconButton>
        <SendButton
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          aria-label="Send"
        >
          <FaPaperPlane />
        </SendButton>
      </InputRow>

      <FAB
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        onClick={toggleListening}
        aria-label="Voice input"
      >
        <FaMicrophone />
      </FAB>
    </Container>
  );
}
