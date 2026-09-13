import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface RiskGaugeProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  showVerdict?: boolean;
  className?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score = 0,
  size = 180,
  strokeWidth = 14,
  showVerdict = true,
  className = ''
}) => {
  const clampedScore = Math.min(100, Math.max(0, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let color = '#10B981'; // green
  let glowClass = 'shadow-glow-accent';
  let verdict = 'SAFE';
  let textColor = 'text-accent';

  if (clampedScore >= 70) {
    color = '#EF4444'; // red
    glowClass = 'shadow-glow-danger';
    verdict = 'MALICIOUS';
    textColor = 'text-danger';
  } else if (clampedScore >= 30) {
    color = '#F59E0B'; // amber
    glowClass = 'shadow-[0_0_25px_rgba(245,158,11,0.4)]';
    verdict = 'SUSPICIOUS';
    textColor = 'text-warning';
  }

  return (
    <div
      className={cn('relative inline-flex flex-col items-center justify-center select-none', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border/60"
          fill="transparent"
        />

        {/* Animated Progress Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          fill="transparent"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <span className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary dark:text-text-primary tracking-tight">
            {clampedScore}
            <span className="text-sm text-text-muted font-normal">/100</span>
          </span>
          <span className="text-[11px] uppercase tracking-wider text-text-muted font-medium mt-0.5">
            Risk Score
          </span>
          {showVerdict && (
            <span
              className={cn(
                'mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full border',
                textColor,
                clampedScore >= 70
                  ? 'border-danger/40 bg-danger/10'
                  : clampedScore >= 30
                  ? 'border-warning/40 bg-warning/10'
                  : 'border-accent/40 bg-accent/10'
              )}
            >
              {verdict}
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
};
