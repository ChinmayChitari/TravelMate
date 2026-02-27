import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';
import { theme } from '../theme';
import { apiGet } from '../api';
import { useAuth } from '../context/AuthContext';

const Container = styled(motion.div)`
  min-height: 100vh;
  background: ${theme.colors.background};
  padding-bottom: ${theme.spacing.xxl}px;
`;

const Header = styled.header`
  background: ${theme.gradients.hero};
  color: white;
  padding: ${theme.spacing.lg}px ${theme.spacing.xl}px;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md}px;
  box-shadow: ${theme.shadows.md};
`;

const BackBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  &:hover { background: rgba(255, 255, 255, 0.3); }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${theme.typography.sizes.xl}px;
  font-weight: ${theme.typography.weights.bold};
`;

const Content = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${theme.spacing.lg}px;
`;

const Card = styled(motion.div)`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.lg}px;
  padding: ${theme.spacing.lg}px ${theme.spacing.xl}px;
  margin-bottom: ${theme.spacing.md}px;
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const PlaceName = styled.h2`
  margin: 0 0 ${theme.spacing.sm}px;
  font-size: ${theme.typography.sizes.lg}px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm}px;
`;

const Description = styled.p`
  margin: 0 0 ${theme.spacing.sm}px;
  font-size: ${theme.typography.sizes.sm}px;
  color: ${theme.colors.textSecondary};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DateText = styled.span`
  font-size: ${theme.typography.sizes.xs}px;
  color: ${theme.colors.textMuted};
`;

const Empty = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl}px ${theme.spacing.lg}px;
  color: ${theme.colors.textMuted};
  font-size: ${theme.typography.sizes.md}px;
`;

const Loading = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl}px;
  color: ${theme.colors.textSecondary};
`;

export default function HistoryScreen() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/signin', { replace: true });
      return;
    }
    apiGet('/tours/history')
      .then(setTours)
      .catch((err) => {
        const msg = err.message || 'Failed to load history';
        setError(msg);
        if (msg.toLowerCase().includes('token') || msg.toLowerCase().includes('unauthorized')) {
          logout();
          navigate('/signin', { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, [token, navigate, logout]);

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
    } catch {
      return '';
    }
  };

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Header>
        <BackBtn onClick={() => navigate(-1)} aria-label="Back">
          <FaArrowLeft />
        </BackBtn>
        <HeaderTitle>Tour History</HeaderTitle>
      </Header>
      <Content>
        {loading && <Loading>Loading your tours...</Loading>}
        {error && <Empty>{error}</Empty>}
        {!loading && !error && tours.length === 0 && (
          <Empty>No tours yet. Chat or scan a landmark to start saving!</Empty>
        )}
        {!loading && !error && tours.length > 0 && tours.map((tour, i) => (
          <Card
            key={tour._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <PlaceName>
              <FaMapMarkerAlt />
              {tour.placeName}
            </PlaceName>
            <Description>{tour.description}</Description>
            <DateText>{formatDate(tour.createdAt)}</DateText>
          </Card>
        ))}
      </Content>
    </Container>
  );
}
