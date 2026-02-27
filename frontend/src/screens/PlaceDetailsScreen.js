import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaVolumeUp, FaArrowLeft } from 'react-icons/fa';
import { theme } from '../theme';

const Container = styled(motion.div)`
  min-height: 100vh;
  background: ${theme.colors.background};
  padding-bottom: ${theme.spacing.xxl}px;
`;

const HeaderWrap = styled.div`
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
`;

const HeaderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GradientOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: ${theme.gradients.overlayBottom};
  pointer-events: none;
`;

const TitleOverImage = styled(motion.h1)`
  position: absolute;
  bottom: ${theme.spacing.xl}px;
  left: ${theme.spacing.lg}px;
  right: ${theme.spacing.lg}px;
  margin: 0;
  font-size: ${theme.typography.sizes.display}px;
  font-weight: ${theme.typography.weights.bold};
  color: white;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
  z-index: 2;
`;

const BackBtn = styled(motion.button)`
  position: absolute;
  top: ${theme.spacing.lg}px;
  left: ${theme.spacing.lg}px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  font-size: 1.2rem;
  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const VoiceBtn = styled(motion.button)`
  position: absolute;
  bottom: ${theme.spacing.xl}px;
  right: ${theme.spacing.lg}px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
  color: ${theme.colors.primary};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  font-size: 1.5rem;
  box-shadow: ${theme.shadows.lg};
  &:hover {
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg}px;
  margin-top: -${theme.spacing.xl}px;
  position: relative;
  z-index: 2;
`;

const Card = styled(motion.div)`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.xl}px;
  padding: ${theme.spacing.lg}px ${theme.spacing.xl}px;
  margin-bottom: ${theme.spacing.md}px;
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const CardTitle = styled.h2`
  font-size: ${theme.typography.sizes.lg}px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary};
  margin: 0 0 ${theme.spacing.sm}px;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm}px;
`;

const CardBody = styled.p`
  font-size: ${theme.typography.sizes.md}px;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const stagger = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function PlaceDetailsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { place = {}, image } = location.state || {};

  const {
    name = 'Unknown Place',
    description = 'No description available.',
    bestTime = 'Any time',
    history,
    funFacts,
  } = place;

  const speak = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const fullText = [description, history, funFacts, `Best time to visit: ${bestTime}`]
    .filter(Boolean)
    .join(' ');

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <HeaderWrap>
        {image ? (
          <HeaderImage src={image} alt={name} />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: theme.gradients.hero,
            }}
          />
        )}
        <GradientOverlay />
        <BackBtn onClick={() => navigate(-1)} aria-label="Back" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <FaArrowLeft />
        </BackBtn>
        <TitleOverImage
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {name}
        </TitleOverImage>
        <VoiceBtn
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => speak(fullText)}
          aria-label="Listen"
        >
          <FaVolumeUp />
        </VoiceBtn>
      </HeaderWrap>

      <Content variants={stagger} initial="initial" animate="animate">
        <Card variants={itemVariants} transition={{ duration: 0.4 }}>
          <CardTitle>About</CardTitle>
          <CardBody>{description}</CardBody>
        </Card>

        {history && (
          <Card variants={itemVariants} transition={{ duration: 0.4 }}>
            <CardTitle>History</CardTitle>
            <CardBody>{history}</CardBody>
          </Card>
        )}

        {funFacts && (
          <Card variants={itemVariants} transition={{ duration: 0.4 }}>
            <CardTitle>Fun Facts</CardTitle>
            <CardBody>{funFacts}</CardBody>
          </Card>
        )}

        <Card variants={itemVariants} transition={{ duration: 0.4 }}>
          <CardTitle>Best Time to Visit</CardTitle>
          <CardBody>{bestTime}</CardBody>
        </Card>
      </Content>
    </Container>
  );
}
