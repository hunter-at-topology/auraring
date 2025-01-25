'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

interface Friend {
  bpm: number;
  name: string;
  id: string;
  auraColors: {
    from: string;
    to: string;
  };
}

type AuraData = {
  transformedData: Friend[];
  events: any;
}

export default function AuraRing() {

  const { data: auraData } = useQuery<AuraData>({
    queryKey: ['auraData'],
    queryFn: async () => {
      console.log(localStorage.getItem('googleTokens'));
      const response = await fetch('/api/aura?tokens=' + encodeURIComponent(localStorage.getItem('googleTokens') || ''));
      return response.json();
    }
  });

  console.log(auraData);

  return (
    <div className="relative w-full max-w-4xl aspect-square">
      {/* Central glowing orb - your aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
        <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-xl" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500 animate-pulse shadow-[0_0_100px_40px_rgba(96,165,250,0.4)]" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-300/40 via-transparent to-cyan-300/40 animate-pulse [animation-delay:-.5s]" />
      </div>

      {/* Surrounding friend orbs */}
      {auraData?.transformedData.map((friend, index) => {
        // Calculate distance based on BPM (lower BPM = closer)
        // Map BPM range (typically 60-100) to distance range (35-65)
        const distance = Math.max(35, Math.min(65, (friend.bpm - 60) * 0.75 + 35));
        const totalFriends = auraData.transformedData.length;
        const angle = (index * 2 * Math.PI) / totalFriends;
        const delay = (index % 8) * 0.15;
        const size = 24; // Consistent size for all friends
        
        return (
          <div
            key={friend.id}
            className="absolute transition-all duration-500 hover:scale-125 cursor-pointer group"
            style={{
              top: `${50 + distance * Math.sin(angle)}%`,
              left: `${50 + distance * Math.cos(angle)}%`,
              transform: 'translate(-50%, -50%)',
              width: `${size}px`,
              height: `${size}px`,
              zIndex: Math.floor(distance),
            }}
          >
            <div 
              className="relative w-full h-full animate-float" 
              style={{ 
                animationDelay: `${delay}s`,
                animationDuration: '3s'
              }}
            >
              {/* Aura glow */}
              <div 
                className="absolute inset-0 rounded-full shadow-[0_0_15px_5px_rgba(96,165,250,0.3)]"
                style={{
                  background: `linear-gradient(to bottom right, ${friend.auraColors.from}, ${friend.auraColors.to})`,
                }}
              />
              
              {/* Glass effect */}
              <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm" />
              
              {/* Profile circle */}
              <div className="absolute inset-0.5 rounded-full overflow-hidden bg-gray-100" />

              {/* Name label */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-xs whitespace-nowrap">
                {friend.name}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}