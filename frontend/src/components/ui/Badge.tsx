import React from 'react';
import { cn } from '../../utils/cn';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

export interface BadgeProps {
  status: 'Safe' | 'Suspicious' | 'Malicious' | 'Neutral' | 'Info' | 'PASS' | 'FAIL';
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  children,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const normalized = status.toUpperCase();

  const isSafe = normalized === 'SAFE' || normalized === 'PASS';
  const isSuspicious = normalized === 'SUSPICIOUS' || normalized === 'WARNING';
  const isMalicious = normalized === 'MALICIOUS' || normalized === 'FAIL';

  const styleClasses = isSafe
    ? 'bg-accent/15 text-accent border-accent/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
    : isSuspicious
    ? 'bg-warning/15 text-warning border-warning/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
    : isMalicious
    ? 'bg-danger/15 text-danger border-danger/30 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
    : 'bg-primary/15 text-primary border-primary/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]';

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1 font-medium',
    md: 'text-xs px-3 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-4 py-1.5 gap-2 font-bold'
  };

  const renderIcon = () => {
    if (!showIcon) return null;
    const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;
    if (isSafe) return <ShieldCheck size={iconSize} className="shrink-0" />;
    if (isSuspicious) return <AlertTriangle size={iconSize} className="shrink-0" />;
    if (isMalicious) return <AlertOctagon size={iconSize} className="shrink-0" />;
    return <Info size={iconSize} className="shrink-0" />;
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border tracking-wide uppercase select-none transition-all',
        sizeClasses[size],
        styleClasses,
        className
      )}
    >
      {renderIcon()}
      <span>{children || status}</span>
    </span>
  );
};
