import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { FaCamera, FaTimes, FaVolumeUp, FaRoute, FaSave } from 'react-icons/fa';
import { theme } from '../theme';
import API_BASE, { getAuthHeaders } from '../api';
import { useAuth } from '../context/AuthContext';
import { apiPost } from '../api';

const scanLine = keyframes`
  0% { transform: translateY(-100%); opacity: 0.8; }
  50% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0.8; }
`;

const cornerGlow = keyframes`
  0%, 100% { opacity: 0.9; filter: drop-shadow(0 0 8px ${theme.colors.neon}); }
  50% { opacity: 1; filter: drop-shadow(0 0 16px ${theme.colors.neon}); }
`;

const Container = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: #0a0a0f;
  display: flex;
  flex-direction: column;
  z-index: 100;
`;

const Preview = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 100%);
  overflow: hidden;
`;

const DarkOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  pointer-events: none;
`;

const CapturedImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FrameWrapper = styled.div`
  position: absolute;
  width: min(280px, 85vw);
  height: min(280px, 85vw);
  max-width: 320px;
  max-height: 320px;
  z-index: 2;
`;

const FrameBorder = styled(motion.div)`
  position: absolute;
  inset: 0;
  border-radius: 28px;
  border: 2px solid rgba(0, 201, 167, 0.6);
  box-shadow: 0 0 24px rgba(0, 201, 167, 0.3), inset 0 0 24px rgba(0, 201, 167, 0.05);
  animation: ${cornerGlow} 2s ease-in-out infinite;
  pointer-events: none;
`;

const Corner = styled.div`
  position: absolute;
  width: 32px;
  height: 32px;
  border-color: ${theme.colors.neon};
  border-style: solid;
  border-width: 0;
  box-shadow: 0 0 12px ${theme.colors.neon};
`;
const CornerTL = styled(Corner)` top: 8px; left: 8px; border-top-width: 3px; border-left-width: 3px; border-radius: 8px 0 0 0; `;
const CornerTR = styled(Corner)` top: 8px; right: 8px; border-top-width: 3px; border-right-width: 3px; border-radius: 0 8px 0 0; `;
const CornerBL = styled(Corner)` bottom: 8px; left: 8px; border-bottom-width: 3px; border-left-width: 3px; border-radius: 0 0 0 8px; `;
const CornerBR = styled(Corner)` bottom: 8px; right: 8px; border-bottom-width: 3px; border-right-width: 3px; border-radius: 0 0 8px 0; `;

const FrameLabel = styled.p`
  position: absolute;
  top: -44px;
  left: 0;
  right: 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  font-size: ${theme.typography.sizes.sm}px;
  font-weight: ${theme.typography.weights.medium};
  margin: 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  z-index: 3;
`;

const ScanLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, ${theme.colors.neon}, ${theme.colors.secondary}, transparent);
  box-shadow: 0 0 24px ${theme.colors.neon};
  animation: ${scanLine} 2.2s ease-in-out infinite;
  pointer-events: none;
  z-index: 4;
`;

const AnalyzingText = styled(motion.div)`
  position: absolute;
  bottom: 120px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: ${theme.typography.sizes.lg}px;
  font-weight: ${theme.typography.weights.semibold};
  text-shadow: 0 2px 12px rgba(0,0,0,0.6);
  z-index: 5;
`;

const InstructionPanel = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${theme.spacing.xl}px ${theme.spacing.lg}px ${theme.spacing.xxl}px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: ${theme.radii.xxl}px ${theme.radii.xxl}px 0 0;
`;

const Instruction = styled.p`
  margin: 0 0 ${theme.spacing.lg}px;
  color: rgba(255, 255, 255, 0.9);
  font-size: ${theme.typography.sizes.md}px;
  text-align: center;
  line-height: 1.4;
`;

const CaptureButton = styled(motion.button)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid white;
  background: transparent;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 2rem;
  box-shadow: 0 0 0 0 rgba(0, 201, 167, 0.5);
  transition: box-shadow 0.3s;
  &:hover {
    box-shadow: 0 0 0 14px rgba(0, 201, 167, 0.25);
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: ${theme.spacing.lg}px;
  right: ${theme.spacing.lg}px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  font-size: 1.2rem;
  backdrop-filter: blur(8px);
  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const ResultPanel = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${theme.spacing.xl}px ${theme.spacing.lg}px calc(${theme.spacing.xxl}px + env(safe-area-inset-bottom, 0));
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: ${theme.radii.xxl}px ${theme.radii.xxl}px 0 0;
  box-shadow: ${theme.shadows.glass};
  z-index: 15;
`;

const ResultName = styled.h2`
  margin: 0 0 ${theme.spacing.xs}px;
  font-size: ${theme.typography.sizes.display}px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text};
  line-height: 1.2;
`;

const Confidence = styled.span`
  font-size: ${theme.typography.sizes.sm}px;
  color: ${theme.colors.accent};
  font-weight: ${theme.typography.weights.semibold};
  margin-bottom: ${theme.spacing.sm}px;
  display: inline-block;
`;

const DescriptionPreview = styled.p`
  margin: 0 0 ${theme.spacing.lg}px;
  font-size: ${theme.typography.sizes.sm}px;
  color: ${theme.colors.textSecondary};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ResultActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm}px;
  flex-wrap: wrap;
`;

const ActionBtn = styled(motion.button)`
  flex: 1;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 18px;
  border-radius: ${theme.radii.lg}px;
  border: none;
  font-size: ${theme.typography.sizes.sm}px;
  font-weight: ${theme.typography.weights.semibold};
  cursor: pointer;
  color: white;
  background: ${(p) => (p.$accent ? theme.colors.accent : theme.gradients.buttonPrimary)};
  box-shadow: ${theme.shadows.button};
  &:hover {
    opacity: 0.95;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

function triggerHaptic() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(50);
  }
}

export default function CameraScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const [capturedImage, setCapturedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setCapturedImage(base64Image);
      setResult(null);
      setAnalyzing(true);
      try {
        const res = await axios.post(
          `${API_BASE}/image/analyze`,
          { image: base64Image },
          { headers: getAuthHeaders() }
        );
        setAnalyzing(false);
        triggerHaptic();
        setResult({
          ...res.data,
          image: base64Image,
        });
      } catch {
        setAnalyzing(false);
        triggerHaptic();
        setResult({
          name: 'Unknown Place',
          description: "Couldn't identify this landmark. Try again with a clearer shot!",
          bestTime: 'N/A',
          confidence: 0,
          image: base64Image,
        });
      }
    };
    e.target.value = '';
  };

  const speak = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  const handleHearGuide = () => {
    if (result?.description) speak(result.description);
  };

  const handleViewRoute = () => {
    if (result) navigate('/place', { state: { place: result, image: result.image } });
  };

  const handleSaveTour = async () => {
    if (!result || !isAuthenticated || saved) return;
    setSaving(true);
    try {
      await apiPost('/tours', {
        placeName: result.name,
        description: result.description || result.name,
      });
      setSaved(true);
    } catch {
      setSaving(false);
    }
    setSaving(false);
  };

  const confidencePercent = result?.confidence != null
    ? Math.round((typeof result.confidence === 'number' && result.confidence <= 1 ? result.confidence * 100 : result.confidence))
    : null;

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CloseBtn onClick={() => navigate(-1)} aria-label="Close">
        <FaTimes />
      </CloseBtn>

      <Preview>
        {capturedImage ? (
          <>
            <CapturedImage src={capturedImage} alt="Captured" />
            <DarkOverlay />
            {analyzing && (
              <>
                <ScanLine />
                <AnalyzingText
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  Analyzing Landmark...
                </AnalyzingText>
              </>
            )}
          </>
        ) : (
          <>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.4)',
                fontSize: theme.typography.sizes.lg,
                textAlign: 'center',
                padding: theme.spacing.xl,
              }}
            >
              Point your camera at a landmark
            </div>
            <DarkOverlay />
            <FrameWrapper>
              <FrameLabel>Align the landmark inside the frame</FrameLabel>
              <FrameBorder />
              <CornerTL />
              <CornerTR />
              <CornerBL />
              <CornerBR />
            </FrameWrapper>
          </>
        )}

        <AnimatePresence>
          {!capturedImage && (
            <InstructionPanel
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            >
              <Instruction>
                Tap below to choose a photo from your device. We'll identify the landmark.
              </Instruction>
              <CaptureButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCapture}
                aria-label="Choose photo"
              >
                <FaCamera />
              </CaptureButton>
            </InstructionPanel>
          )}

          {result && !analyzing && (
            <ResultPanel
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              <ResultName>{result.name}</ResultName>
              {confidencePercent != null && (
                <Confidence>AI confidence: {confidencePercent}%</Confidence>
              )}
              <DescriptionPreview>{result.description}</DescriptionPreview>
              <ResultActions>
                <ActionBtn whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleHearGuide}>
                  <FaVolumeUp size={18} />
                  Hear Guide
                </ActionBtn>
                <ActionBtn whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleViewRoute}>
                  <FaRoute size={18} />
                  View Route
                </ActionBtn>
                {isAuthenticated && (
                  <ActionBtn
                    $accent
                    disabled={saved}
                    whileHover={!saved ? { scale: 1.02 } : {}}
                    whileTap={!saved ? { scale: 0.98 } : {}}
                    onClick={handleSaveTour}
                  >
                    <FaSave size={18} />
                    {saving ? 'Saving...' : saved ? 'Saved' : 'Save Tour'}
                  </ActionBtn>
                )}
              </ResultActions>
            </ResultPanel>
          )}
        </AnimatePresence>
      </Preview>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />
    </Container>
  );
}
