import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaMapPin } from 'react-icons/fa';

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.5);
  min-width: 300px;
  max-width: 320px;
  flex-shrink: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  height: 180px;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const PlaceImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  ${Card}:hover & {
    transform: scale(1.08);
  }
`;

const BestTimeBadge = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  z-index: 2;
`;

const Content = styled.div`
  padding: 24px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
`;

const MetaLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const ReasonText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 24px;
`;

const GradientButton = styled(motion.button)`
  margin-top: auto;
  width: 100%;
  padding: 14px 20px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.25);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(135deg, #4f46e5 0%, #0891b2 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }

  span, svg {
    position: relative;
    z-index: 1;
  }
`;

export default function RecommendCard({ place, index = 0 }) {
  let fallbackImg = 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80';
  if (index % 3 === 1) fallbackImg = 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80';
  if (index % 3 === 2) fallbackImg = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';

  const imageUrl = (place.image && place.image !== 'false') ? place.image : fallbackImg;

  return (
    <Card
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ scale: 1.03, y: -5 }}
    >
      <ImageContainer>
        <PlaceImage src={imageUrl} alt={place.name} />
        <BestTimeBadge>⭐ {place.bestTime || 'Anytime'}</BestTimeBadge>
      </ImageContainer>
      <Content>
        <Title>{place.name}</Title>
        <MetaLabel>Why visit?</MetaLabel>
        <ReasonText>{place.reason}</ReasonText>
        <GradientButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <FaMapPin size={14} />
          <span>Explore Location</span>
        </GradientButton>
      </Content>
    </Card>
  );
}
