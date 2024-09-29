'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';

interface ClientWrapperProps {
  children: React.ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => (
  <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
    <Navigation />
  </>
);

export default ClientWrapper;