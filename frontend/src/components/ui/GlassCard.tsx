import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: 'blue' | 'green' | 'red' | 'amber' | 'none';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  interactive = false,
  ...props
}) => {
  const glowClasses = {
    blue: 'hover:border-primary/50 hover:shadow-glow-primary',
    green: 'hover:border-accent/50 hover:shadow-glow-accent',
    red: 'hover:border-danger/50 hover:shadow-glow-danger',
    amber: 'hover:border-warning/50 hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.35)]',
    none: 'hover:border-border/80'
  };

  return (
    <motion.div
      whileHover={interactive ? { y: -3, scale: 1.008 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative rounded-2xl p-6 backdrop-blur-xl transition-all duration-300',
        'bg-surface-glass/90 dark:bg-surface-glass/80',
        'border border-border/70 dark:border-border/60',
        'shadow-glass text-text-primary dark:text-text-primary',
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
