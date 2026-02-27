import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { FaMicrophone, FaCamera, FaCompass, FaSignOutAlt, FaSyncAlt, FaChevronDown, FaHistory, FaMapMarkedAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../api';
import TourCard from '../components/TourCard';
import RecommendCard from '../components/RecommendCard';
import QuickActionButton from '../components/QuickActionButton';
import { SkeletonTourCard, SkeletonRecommendCard } from '../components/SkeletonCard';

const gradientAnim = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Background = styled.div`
  position: fixed;
  inset: 0;
  background: linear-gradient(-45deg, #e0e7ff, #f3e8ff, #ccfbf1, #f8fafc);
  background-size: 400% 400%;
  animation: ${gradientAnim} 15s ease infinite;
  z-index: -1;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    backdrop-filter: blur(80px);
    -webkit-backdrop-filter: blur(80px);
    background: rgba(255, 255, 255, 0.4);
  }
`;

const Page = styled(motion.div)`
  min-height: 100vh;
  font-family: 'Poppins', 'Inter', sans-serif;
  color: #1e293b;
  padding-bottom: 80px;
`;

const NavBar = styled(motion.header)`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.8);
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const Brand = styled.div`
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #4f46e5, #0d9488);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  letter-spacing: -0.02em;
`;

const ProfileContainer = styled.div`
  position: relative;
`;

const ProfileBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.8);
  border: 1px solid rgba(0,0,0,0.05);
  padding: 6px 16px 6px 6px;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a78bfa, #2dd4bf);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
`;

const ProfileName = styled.span`
  font-weight: 500;
  font-size: 15px;
  color: #334155;
  @media (max-width: 768px) {
    display: none;
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,1);
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  border-radius: 16px;
  padding: 8px;
  min-width: 160px;
  transform-origin: top right;
`;

const DropdownItem = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(239, 68, 68, 0.08);
    color: #ef4444;
  }
`;

const Content = styled(motion.main)`
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 32px;
  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const HeaderGreeting = styled(motion.div)`
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: clamp(32px, 5vw, 42px);
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: clamp(16px, 3vw, 18px);
  color: #64748b;
  margin: 0;
  font-weight: 400;
`;

const Section = styled(motion.section)`
  margin-bottom: 56px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const IconButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid rgba(79, 70, 229, 0.2);
  background: rgba(79, 70, 229, 0.05);
  color: #4f46e5;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: rgba(79, 70, 229, 0.1);
  }

  & svg.spin {
    animation: ${spin} 1s linear infinite;
  }
`;

const TextLink = styled.button`
  background: none;
  border: none;
  color: #0d9488;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const HorizontalScroll = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 10px;
  margin: -10px;
  scroll-snap-type: x mandatory;
  padding-bottom: 20px;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.1);
    border-radius: 10px;
  }
  & > * {
    scroll-snap-align: start;
  }
`;

const EmptyStateContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px dashed rgba(79, 70, 229, 0.3);
  border-radius: 20px;
  padding: 60px 24px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #a78bfa, #2dd4bf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0px 8px 16px rgba(45, 212, 191, 0.2));
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 8px;
`;

const EmptyDesc = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
  max-width: 300px;
  line-height: 1.5;
`;

const QuickRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tours, setTours] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [toursLoading, setToursLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchTours = useCallback(() => {
    return apiGet('/tours/history')
      .then(setTours)
      .catch(() => setTours([]))
      .finally(() => setToursLoading(false));
  }, []);

  const fetchRecommendations = useCallback(() => {
    return apiGet('/tours/recommend')
      .then(setRecommendations)
      .catch(() => setRecommendations([]))
      .finally(() => setRecLoading(false));
  }, []);

  useEffect(() => {
    fetchTours();
    fetchRecommendations();
  }, [fetchTours, fetchRecommendations]);

  const handleRefresh = () => {
    setRefreshing(true);
    setToursLoading(true);
    setRecLoading(true);
    Promise.all([fetchTours(), fetchRecommendations()]).finally(() => setRefreshing(false));
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <>
      <Background />
      <Page
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        onClick={closeDropdown}
      >
        <NavBar initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Brand onClick={() => navigate('/')}>Travelmate</Brand>
          <ProfileContainer onClick={(e) => e.stopPropagation()}>
            <ProfileBtn onClick={toggleDropdown} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Avatar>{user?.name ? user.name.charAt(0).toUpperCase() : 'T'}</Avatar>
              <ProfileName>{user?.name || 'Traveler'}</ProfileName>
              <FaChevronDown size={12} color="#64748b" />
            </ProfileBtn>
            <AnimatePresence>
              {dropdownOpen && (
                <DropdownMenu
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownItem onClick={() => navigate('/history')} style={{ color: '#334155' }}>
                    <FaHistory /> History
                  </DropdownItem>
                  <DropdownItem onClick={handleLogout} style={{ color: '#ef4444' }}>
                    <FaSignOutAlt /> Logout
                  </DropdownItem>
                </DropdownMenu>
              )}
            </AnimatePresence>
          </ProfileContainer>
        </NavBar>

        <Content
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <HeaderGreeting>
            <Title>Inspire your next journey.</Title>
            <Subtitle>Discover personalized recommendations or revisit past explorations.</Subtitle>
          </HeaderGreeting>

          <Section>
            <SectionHeader>
              <SectionTitle>Previous Tours</SectionTitle>
              <ActionRow>
                <IconButton onClick={handleRefresh} disabled={refreshing} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <FaSyncAlt className={refreshing ? 'spin' : ''} />
                  {refreshing ? 'Refreshing' : 'Refresh'}
                </IconButton>
                {tours.length > 0 && <TextLink onClick={() => navigate('/history')}>See all</TextLink>}
              </ActionRow>
            </SectionHeader>

            {toursLoading ? (
              <HorizontalScroll>
                <SkeletonTourCard />
                <SkeletonTourCard />
                <SkeletonTourCard />
              </HorizontalScroll>
            ) : tours.length === 0 ? (
              <EmptyStateContainer initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <EmptyIcon><FaMapMarkedAlt /></EmptyIcon>
                <EmptyTitle>Ready for an adventure?</EmptyTitle>
                <EmptyDesc>You don't have any past tours yet. Start exploring by chatting with the guide or scanning a landmark.</EmptyDesc>
              </EmptyStateContainer>
            ) : (
              <HorizontalScroll>
                {tours.map((tour, i) => (
                  <TourCard key={tour._id} tour={tour} index={i} />
                ))}
              </HorizontalScroll>
            )}
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>AI Recommended Places</SectionTitle>
            </SectionHeader>

            {recLoading ? (
              <HorizontalScroll>
                <SkeletonRecommendCard />
                <SkeletonRecommendCard />
                <SkeletonRecommendCard />
              </HorizontalScroll>
            ) : recommendations.length === 0 ? (
              <EmptyStateContainer initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <EmptyIcon>✨</EmptyIcon>
                <EmptyTitle>No recommendations yet</EmptyTitle>
                <EmptyDesc>Check back later or interact with the guide for highly personalized travel spots.</EmptyDesc>
              </EmptyStateContainer>
            ) : (
              <HorizontalScroll>
                {recommendations.map((place, i) => (
                  <RecommendCard key={place.id || i} place={place} index={i} />
                ))}
              </HorizontalScroll>
            )}
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>Quick Actions</SectionTitle>
            </SectionHeader>
            <QuickRow>
              <QuickActionButton icon={<FaMicrophone />} label="Talk to Guide" onClick={() => navigate('/chat')} />
              <QuickActionButton icon={<FaCamera />} label="Scan Landmark" onClick={() => navigate('/camera')} />
              <QuickActionButton icon={<FaCompass />} label="Explore Nearby" onClick={() => navigate('/chat')} />
            </QuickRow>
          </Section>
        </Content>
      </Page>
    </>
  );
}
