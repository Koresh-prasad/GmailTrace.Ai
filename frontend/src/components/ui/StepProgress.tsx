import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface StepItem {
  id: string | number;
  label: string;
  description?: string;
}

interface StepProgressProps {
  steps: StepItem[];
  currentStepIndex: number; // 0-based index of currently executing step
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStepIndex,
  orientation = 'horizontal',
  className = ''
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={cn('flex flex-col space-y-4', className)}>
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

          return (
            <div key={step.id} className="relative flex items-start group">
              {/* Connector line */}
              {idx !== steps.length - 1 && (
                <div
                  className={cn(
                    'absolute left-4 top-8 -ml-px w-0.5 h-full transition-colors duration-500',
                    isDone ? 'bg-primary' : 'bg-border/60'
                  )}
                />
              )}

              {/* Step indicator node */}
              <div className="relative z-10 flex items-center justify-center">
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 rounded-full bg-accent/20 border border-accent text-accent flex items-center justify-center shadow-glow-accent"
                  >
                    <Check size={16} strokeWidth={3} />
                  </motion.div>
                ) : isCurrent ? (
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-8 h-8 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center shadow-glow-primary"
                  >
                    <Loader2 size={16} className="animate-spin" />
                  </motion.div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-surface border border-border/70 text-text-muted flex items-center justify-center">
                    <span className="text-xs font-mono">{idx + 1}</span>
                  </div>
                )}
              </div>

              {/* Step label */}
              <div className="ml-4 min-w-0 flex-1 pt-1">
                <p
                  className={cn(
                    'text-sm font-semibold transition-colors duration-300 font-heading',
                    isDone ? 'text-accent' : isCurrent ? 'text-primary' : 'text-text-muted'
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-text-muted mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between relative">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10 flex-1">
                {/* Node */}
                <div className="flex items-center justify-center">
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="w-9 h-9 rounded-full bg-accent/20 border border-accent text-accent flex items-center justify-center shadow-glow-accent"
                    >
                      <Check size={18} strokeWidth={3} />
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-9 h-9 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center shadow-glow-primary"
                    >
                      <Loader2 size={18} className="animate-spin" />
                    </motion.div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-surface border border-border/80 text-text-muted flex items-center justify-center">
                      <span className="text-xs font-mono">{idx + 1}</span>
                    </div>
                  )}
                </div>

                {/* Label */}
                <p
                  className={cn(
                    'text-xs font-medium mt-2 text-center max-w-[110px] truncate',
                    isDone ? 'text-accent' : isCurrent ? 'text-primary font-bold' : 'text-text-muted'
                  )}
                  title={step.label}
                >
                  {step.label}
                </p>
              </div>

              {/* Connecting line */}
              {idx !== steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-border relative -mt-6 mx-2">
                  <div
                    className={cn(
                      'h-full transition-all duration-500',
                      idx < currentStepIndex ? 'bg-primary' : 'bg-transparent'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
