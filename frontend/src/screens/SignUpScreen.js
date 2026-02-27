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

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  margin-bottom: ${theme.spacing.md}px;
  border-radius: ${theme.radii.md}px;
  border: 1px solid rgba(91, 127, 255, 0.25);
  font-size: ${theme.typography.sizes.md}px;
  font-family: inherit;
  outline: none;
  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(91, 127, 255, 0.15);
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
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Error = styled.p`
  color: ${theme.colors.error};
  font-size: ${theme.typography.sizes.sm}px;
  margin: 0 0 ${theme.spacing.md}px;
  text-align: center;
`;

const LinkRow = styled.p`
  text-align: center;
  margin: ${theme.spacing.lg}px 0 0;
  font-size: ${theme.typography.sizes.sm}px;
  color: ${theme.colors.textSecondary};
`;

const StyledLink = styled(Link)`
  color: ${theme.colors.primary};
  font-weight: ${theme.typography.weights.semibold};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

export default function SignUpScreen() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await apiPost('/auth/signup', { name: name.trim(), email: email.trim(), password });
      setToken(res.token, res.user);
      // Defer navigation so auth context has updated before ProtectedRoute runs
      setTimeout(() => navigate('/dashboard', { replace: true }), 0);
    } catch (err) {
      setError(err.message || (err.response?.data?.error) || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Card initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <Title>Sign Up</Title>
        {error && <Error>{error}</Error>}
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
        <LinkRow>
          Already have an account? <StyledLink to="/signin">Sign In</StyledLink>
        </LinkRow>
      </Card>
    </Container>
  );
}
