import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'danger' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm font-semibold rounded-2xl gap-2',
    lg: 'px-7 py-3.5 text-base font-semibold rounded-2xl gap-2.5'
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-glow-primary hover:from-blue-500 hover:to-indigo-500 border border-blue-400/30',
    ghost:
      'bg-transparent hover:bg-surface/60 text-text-primary dark:text-text-primary hover:text-white border border-transparent',
    danger:
      'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-glow-danger hover:from-red-500 hover:to-rose-500 border border-red-400/30',
    accent:
      'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-glow-accent hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/30',
    outline:
      'bg-surface-glass/40 hover:bg-surface-glass/80 text-text-primary border border-border/80 hover:border-primary/50'
  };

  return (
    <motion.button
      whileHover={disabled || isLoading ? undefined : { scale: 1.025 }}
      whileTap={disabled || isLoading ? undefined : { scale: 0.975 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-heading transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
        </>
      )}
    </motion.button>
  );
};
