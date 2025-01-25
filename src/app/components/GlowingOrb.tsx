'use client';

import React from 'react';

interface GlowingOrbProps {
  size?: number;
  text?: string;
  className?: string;
  animate?: boolean;
}

export default function GlowingOrb({ size = 256, text, className = '', animate = false }: GlowingOrbProps) {
  return (
    <div 
      className={`relative ${animate ? 'animate-float' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Base glow layer */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-500/10 backdrop-blur-xl" />
      
      {/* Primary glow layer */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/80 via-cyan-300/80 to-purple-500/80 mix-blend-screen animate-pulse shadow-[0_0_150px_50px_rgba(96,165,250,0.3)]" />
      
      {/* Secondary glow layer */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-300/30 via-transparent to-purple-400/30 mix-blend-screen animate-pulse [animation-delay:-.5s]" />
      
      {/* Text content */}
      {text && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-4xl font-light tracking-[0.2em] animate-pulse mix-blend-overlay">
            {text}
          </div>
        </div>
      )}
    </div>
  );
} 