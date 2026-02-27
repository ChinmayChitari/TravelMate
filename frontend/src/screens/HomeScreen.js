import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FaMicrophone, FaCamera, FaRoute, FaRobot } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { apiPost } from '../api';

const Container = styled(motion.div)`
  min-height: 100vh;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  background-color: #1a0f2e;
  background-image: url('/travelmate-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  
  /* Enhanced image rendering for clarity */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: high-quality;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* Hardware acceleration for smooth rendering */
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
  
  /* Ensure no blur filters on the background */
  filter: none !important;
  -webkit-filter: none !important;
  
  /* Prevent any blur from parent elements */
  isolation: isolate;
  
  z-index: 0;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    rgba(20, 15, 35, 0.65) 0%,
    rgba(30, 20, 50, 0.5) 40%,
    rgba(60, 35, 80, 0.3) 65%,
    rgba(80, 45, 100, 0.15) 85%,
    rgba(120, 60, 120, 0.05) 100%
  );
  z-index: 1;
  /* Ensure overlay doesn't blur the background */
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
`;

const HeroSection = styled(motion.section)`
  position: relative;
  z-index: 2;
  padding: 64px 10% 64px 8%;
  max-width: 580px;

  @media (max-width: 1024px) {
    padding: 80px 32px 40px;
    max-width: 100%;
    text-align: center;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-family: 'Plus Jakarta Sans', 'Poppins', sans-serif;
  font-size: clamp(36px, 4.5vw, 52px);
  font-weight: 700;
  line-height: 1.15;
  margin: 0 0 16px;
  color: rgba(255, 255, 255, 0.98);
  letter-spacing: -0.02em;

  @media (max-width: 1024px) {
    text-align: center;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-family: 'Poppins', sans-serif;
  font-size: clamp(16px, 1.6vw, 20px);
  line-height: 1.7;
  margin: 0 0 48px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 400;

  @media (max-width: 1024px) {
    text-align: center;
    margin-bottom: 40px;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 1024px) {
    align-items: center;
  }
`;

const FeatureItem = styled(motion.li)`
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: 'Poppins', sans-serif;
  font-size: 17px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;

  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const FeatureIcon = styled.span`
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
`;

const AuthSection = styled(motion.aside)`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 8% 48px 4%;

  @media (max-width: 1024px) {
    padding: 24px 32px 64px;
  }
`;

const AuthCard = styled(motion.div)`
  width: 100%;
  max-width: 420px;
  background: rgba(45, 48, 58, 0.72);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  border: 1px solid rgba(255, 255, 255, 0.06);
  pointer-events: auto;
  position: relative;
`;

const TabRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
`;

const TabButton = styled(motion.button).attrs({
  type: 'button',
})`
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  color: ${(p) => (p.$active ? 'white' : 'rgba(255,255,255,0.7)')};
  background: ${(p) =>
    p.$active
      ? 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)'
      : 'rgba(30, 30, 40, 0.6)'};
  box-shadow: ${(p) =>
    p.$active
      ? '0 0 0 1px rgba(255,255,255,0.25), 0 10px 25px rgba(124,58,237,0.55)'
      : '0 0 0 1px rgba(255,255,255,0.12)'};

  &:hover {
    color: white;
    box-shadow: ${(p) =>
    p.$active
      ? '0 0 0 1px rgba(255,255,255,0.35), 0 12px 28px rgba(124,58,237,0.65)'
      : '0 0 0 1px rgba(255,255,255,0.2)'};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  /* Ensure form submission works */
  & button[type="submit"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  font-size: 15px;
  font-family: 'Poppins', sans-serif;
  color: white;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-color: rgba(139, 92, 246, 0.6);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }
`;

const SubmitButton = styled(motion.button).attrs({
  type: 'submit',
})`
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(90deg, #7c3aed 0%, #3b82f6 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.25s;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
    transform: translateY(-1px);
  }
`;

const Error = styled.p`
  color: #f87171;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 10px 14px;
  background: rgba(248, 113, 113, 0.12);
  border-radius: 10px;
  border: 1px solid rgba(248, 113, 113, 0.2);
`;

const SwitchText = styled.p`
  text-align: center;
  margin: 24px 0 0;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  color: rgba(255, 255, 255, 0.65);
`;

const SwitchLink = styled.button`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  padding: 0;
  margin-left: 4px;
  text-decoration: underline;

  &:hover {
    color: white;
  }
`;

const NavBar = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 768px) {
    padding: 16px 24px;
  }
`;

const Logo = styled.span`
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  letter-spacing: -0.02em;
`;



const features = [
  { icon: <FaMicrophone />, text: 'Voice-guided tours' },
  { icon: <FaCamera />, text: 'Instant landmark recognition' },
  { icon: <FaRoute />, text: 'Find the best routes' },
  { icon: <FaRobot />, text: 'AI travel recommendations' },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, setToken } = useAuth();

  const getInitialTab = () => {
    if (location.pathname === '/signup') return 'signup';
    return 'signin';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);

  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);

  useEffect(() => {
    setActiveTab(location.pathname === '/signup' ? 'signup' : 'signin');
  }, [location.pathname]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Sign In form submitted');
    setSignInError('');
    if (!signInEmail.trim() || !signInPassword) {
      setSignInError('Please fill all fields');
      return;
    }
    setSignInLoading(true);
    try {
      console.log('Sending sign in request...');
      const res = await apiPost('/auth/signin', {
        email: signInEmail.trim(),
        password: signInPassword,
      });
      console.log('Sign in successful', res);
      setToken(res.token, res.user);
      setTimeout(() => navigate('/dashboard', { replace: true }), 0);
    } catch (err) {
      console.error('Sign in error:', err);
      setSignInError(err.message || err.response?.data?.error || 'Sign in failed');
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Sign Up form submitted');
    setSignUpError('');
    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
      setSignUpError('Please fill all fields');
      return;
    }
    setSignUpLoading(true);
    try {
      console.log('Sending sign up request...');
      const res = await apiPost('/auth/signup', {
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
      });
      console.log('Sign up successful', res);
      setToken(res.token, res.user);
      setTimeout(() => navigate('/dashboard', { replace: true }), 0);
    } catch (err) {
      console.error('Sign up error:', err);
      setSignUpError(err.message || err.response?.data?.error || 'Sign up failed');
    } finally {
      setSignUpLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSignInError('');
    setSignUpError('');
    navigate(tab === 'signup' ? '/signup' : '/signin', { replace: true });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08 + 0.15, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <BackgroundImage />
      <Overlay />
      <NavBar initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <Logo onClick={() => navigate('/')}>Travelmate</Logo>
      </NavBar>
      <HeroSection>
        <HeroTitle variants={itemVariants} custom={0} initial="hidden" animate="visible">
          Your Personal AI Travel Guide
        </HeroTitle>
        <HeroSubtitle variants={itemVariants} custom={1} initial="hidden" animate="visible">
          Explore the world with your smart AI companion.
        </HeroSubtitle>
        <FeatureList>
          {features.map((feature, i) => (
            <FeatureItem key={i} variants={itemVariants} custom={i + 2} initial="hidden" animate="visible">
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <span>{feature.text}</span>
            </FeatureItem>
          ))}
        </FeatureList>
      </HeroSection>

      {!isAuthenticated && (
        <AuthSection>
          <AuthCard
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <TabRow>
              <TabButton
                $active={activeTab === 'signin'}
                onClick={() => switchTab('signin')}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </TabButton>
              <TabButton
                $active={activeTab === 'signup'}
                onClick={() => switchTab('signup')}
                whileTap={{ scale: 0.98 }}
              >
                Sign Up
              </TabButton>
            </TabRow>

            <AnimatePresence mode="wait">
              {activeTab === 'signin' ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {signInError && <Error>{signInError}</Error>}
                  <Form onSubmit={handleSignIn} noValidate>
                    <InputGroup>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </InputGroup>
                    <InputGroup>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                    </InputGroup>
                    <SubmitButton
                      type="submit"
                      disabled={signInLoading}
                      whileTap={{ scale: 0.98 }}
                    >
                      {signInLoading ? 'Signing in...' : 'Sign In'}
                    </SubmitButton>
                  </Form>
                  <SwitchText>
                    New here? <SwitchLink onClick={() => switchTab('signup')}>Sign Up</SwitchLink>
                  </SwitchText>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {signUpError && <Error>{signUpError}</Error>}
                  <Form onSubmit={handleSignUp} noValidate>
                    <InputGroup>
                      <Label>Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        autoComplete="name"
                        required
                      />
                    </InputGroup>
                    <InputGroup>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </InputGroup>
                    <InputGroup>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                    </InputGroup>
                    <SubmitButton
                      type="submit"
                      disabled={signUpLoading}
                      whileTap={{ scale: 0.98 }}
                    >
                      {signUpLoading ? 'Signing up...' : 'Sign Up'}
                    </SubmitButton>
                  </Form>
                  <SwitchText>
                    Already have an account? <SwitchLink onClick={() => switchTab('signin')}>Sign In</SwitchLink>
                  </SwitchText>
                </motion.div>
              )}
            </AnimatePresence>
          </AuthCard>
        </AuthSection>
      )}

      {isAuthenticated && (
        <AuthSection>
          <AuthCard
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <HeroSubtitle style={{ margin: 0, textAlign: 'center', color: 'rgba(255,255,255,0.9)' }}>
              Ready to explore? Head to your dashboard.
            </HeroSubtitle>
            <SubmitButton
              onClick={() => navigate('/dashboard')}
              style={{ marginTop: 24 }}
              whileTap={{ scale: 0.98 }}
            >
              Go to Dashboard
            </SubmitButton>
          </AuthCard>
        </AuthSection>
      )}
    </Container>
  );
}
