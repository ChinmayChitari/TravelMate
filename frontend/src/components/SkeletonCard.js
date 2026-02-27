import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme';

const shimmer = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const SkeletonBox = styled.div`
  background: linear-gradient(90deg, ${theme.colors.backgroundDark} 25%, ${theme.colors.background} 50%, ${theme.colors.backgroundDark} 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: ${theme.radii.lg}px;
`;

export function SkeletonTourCard() {
  return (
    <SkeletonBox
      style={{
        width: 280,
        minWidth: 280,
        height: 120,
        flexShrink: 0,
      }}
    />
  );
}

export function SkeletonRecommendCard() {
  return (
    <SkeletonBox
      style={{
        width: 280,
        minWidth: 280,
        height: 260,
        flexShrink: 0,
      }}
    />
  );
}

export default SkeletonBox;
