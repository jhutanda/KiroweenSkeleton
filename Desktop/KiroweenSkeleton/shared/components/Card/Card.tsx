import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  onClick,
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700';
  
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <motion.div
      className={`${baseClasses} ${paddingClasses[padding]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;