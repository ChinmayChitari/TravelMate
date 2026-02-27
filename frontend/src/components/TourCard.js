import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaCalendarDay } from 'react-icons/fa';

const Card = styled(motion.div)`
  flex-shrink: 0;
  width: 280px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  gap: 16px;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #e0e7ff 0%, #ccfbf1 100%);
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: #4f46e5;
  font-size: 20px;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PlaceName = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.01em;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export default function TourCard({ tour, index = 0 }) {
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <Card
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <HeaderRow>
        <IconContainer>
          <FaMapMarkerAlt />
        </IconContainer>
        <TitleBox>
          <PlaceName>{tour.placeName}</PlaceName>
          <DateRow>
            <FaCalendarDay size={12} />
            {formatDate(tour.createdAt)}
          </DateRow>
        </TitleBox>
      </HeaderRow>
      <Description>{tour.description}</Description>
    </Card>
  );
}
