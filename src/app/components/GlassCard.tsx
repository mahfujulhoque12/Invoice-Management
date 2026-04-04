import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-white/40 bg-white/55 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.4)_inset] ${onClick ? 'cursor-pointer hover:bg-white/70 transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
