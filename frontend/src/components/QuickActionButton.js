import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Button = styled(motion.button)`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: #1e293b;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  }
`;

const IconWrap = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #4f46e5 0%, #0d9488 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
`;

const Label = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #334155;
  text-align: center;
  line-height: 1.3;
`;

export default function QuickActionButton({ icon, label, onClick }) {
  return (
    <Button
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <IconWrap>{icon}</IconWrap>
      <Label>{label}</Label>
    </Button>
  );
}
