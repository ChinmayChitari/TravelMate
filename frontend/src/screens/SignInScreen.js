import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { theme } from '../theme';
import { apiPost } from '../api';
import { useAuth } from '../context/AuthContext';

const Container = styled(motion.div)`
  min-height: 100vh;
  background: ${theme.gradients.hero};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg}px;
`;

const Card = styled(motion.div)`
  width: 100%;
  max-width: 380px;
  background: white;
  border-radius: ${theme.radii.xl}px;
  padding: ${theme.spacing.xl}px;
  box-shadow: ${theme.shadows.xl};
`;

const Title = styled.h1`
  margin: 0 0 ${theme.spacing.lg}px;
  font-size: ${theme.typography.sizes.xxl}px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text};
  text-align: center;
`;

const InputWrapper = styled.div`
  margin-bottom: ${theme.spacing.md}px;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border-radius: ${theme.radii.md}px;
  border: 1px solid ${(props) => (props.$hasError ? '#ef4444' : 'rgba(91, 127, 255, 0.25)')};
  font-size: ${theme.typography.sizes.md}px;
  font-family: inherit;
  outline: none;
  background-color: ${(props) => (props.$hasError ? 'rgba(239, 68, 68, 0.02)' : 'transparent')};
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${(props) => (props.$hasError ? '#ef4444' : theme.colors.primary)};
    box-shadow: 0 0 0 3px ${(props) => (props.$hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(91, 127, 255, 0.15)')};
  }
`;

const ErrorText = styled(motion.div)`
  color: #ef4444;
  font-size: 13.5px;
  margin-top: 8px;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  line-height: 1.4;
`;

const SignUpMessage = styled.div`
  margin-top: 6px;
  color: ${theme.colors.textSecondary};
  font-size: 13.5px;
`;

const SignUpLink = styled(Link)`
  color: ${theme.colors.primary};
  font-weight: ${theme.typography.weights.semibold};
  text-decoration: none;
  &:hover { 
    text-decoration: underline; 
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: ${theme.radii.md}px;
  background: ${theme.gradients.buttonPrimary};
  color: white;
  font-size: ${theme.typography.sizes.md}px;
  font-weight: ${theme.typography.weights.bold};
  cursor: pointer;
  margin-top: ${theme.spacing.sm}px;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LinkRow = styled.div`
  text-align: center;
  margin: ${theme.spacing.lg}px 0 0;
  font-size: ${theme.typography.sizes.sm}px;
  color: ${theme.colors.textSecondary};
`;

const Spinner = styled.div`
  @keyframes spin {
    100% { transform: rotate(360deg); }
  }
  animation: spin 1s linear infinite;
  display: flex;
`;

export default function SignInScreen() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const WarningIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );

  const SpinnerIcon = () => (
    <Spinner>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
      </svg>
    </Spinner>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      newErrors.emailError = true;
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
      newErrors.emailError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      newErrors.passwordError = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await apiPost('/auth/signin', { email: email.trim(), password });
      setToken(res.token, res.user);
      setTimeout(() => navigate('/dashboard', { replace: true }), 0);
    } catch (err) {
      const errorMsg = err.message || (err.response?.data?.error) || 'Sign in failed';

      if (errorMsg === 'User not found') {
        setErrors({
          email: 'No account found with this email.',
          emailError: true,
          type: 'not_found'
        });
      } else if (errorMsg === 'Invalid credentials') {
        setErrors({
          password: 'Invalid email or password. Please try again.',
          passwordError: true,
          emailError: true,
          type: 'invalid_credentials'
        });
      } else {
        // Fallback for any other general error
        setErrors({
          password: errorMsg,
          passwordError: true,
          emailError: true,
          type: 'general'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Card initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <Title>Sign In</Title>
        <form onSubmit={handleSubmit} noValidate>
          <InputWrapper>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              $hasError={errors.emailError}
              disabled={loading}
            />
            {errors.email && (
              <ErrorText
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <WarningIcon />
                <div>
                  <div>{errors.email}</div>
                  {errors.type === 'not_found' && (
                    <SignUpMessage>
                      Don't have an account? <SignUpLink to="/signup">Create one now.</SignUpLink>
                    </SignUpMessage>
                  )}
                </div>
              </ErrorText>
            )}
          </InputWrapper>

          <InputWrapper>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              $hasError={errors.passwordError}
              disabled={loading}
            />
            {errors.password && (
              <ErrorText
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <WarningIcon />
                <div>{errors.password}</div>
              </ErrorText>
            )}
          </InputWrapper>

          <Button type="submit" disabled={loading} whileTap={!loading ? { scale: 0.98 } : {}}>
            {loading ? (
              <>
                <SpinnerIcon />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <LinkRow>
          Don't have an account? <SignUpLink to="/signup">Sign Up</SignUpLink>
        </LinkRow>
      </Card>
    </Container>
  );
}
