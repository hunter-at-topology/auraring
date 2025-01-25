'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingSequence from './LoadingSequence';

interface Friend {
  bpm: number;
  name: string;
  id: string;
  auraColors: {
    from: string;
    to: string;
  };
}

interface AuraData {
  transformedData: Friend[];
  events: {
    items?: Array<{
      id: string;
      summary?: string;
      start?: { dateTime?: string; date?: string };
      end?: { dateTime?: string; date?: string };
    }>;
  };
}

export default function AuraRing() {
  const [showLoadingSequence, setShowLoadingSequence] = useState(true);

  const { data: auraData, isLoading } = useQuery<AuraData>({
    queryKey: ['auraData'],
    queryFn: async () => {
      const response = await fetch('/api/aura?tokens=' + encodeURIComponent(localStorage.getItem('googleTokens') || ''));
      return response.json();
    },
    enabled: !showLoadingSequence, // Only start fetching after loading sequence
  });

  if (showLoadingSequence) {
    return <LoadingSequence onComplete={() => setShowLoadingSequence(false)} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading your aura connections...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen max-h-[800px] max-w-[800px] mx-auto">
      {/* Central glowing orb - your aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64">
        <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-xl" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500 animate-pulse shadow-[0_0_60px_20px_rgba(96,165,250,0.4)]" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-300/40 via-transparent to-cyan-300/40 animate-pulse [animation-delay:-.5s]" />
      </div>

      {/* Surrounding friend orbs */}
      {auraData?.transformedData.map((friend, index) => {
        // Get min and max BPM values
        const minBpm = Math.min(...auraData.transformedData.map(f => f.bpm));
        const maxBpm = Math.max(...auraData.transformedData.map(f => f.bpm));
        const bpmRange = maxBpm - minBpm;
        
        // Calculate normalized distance (20-60 range for better fit)
        const normalizedBpm = (friend.bpm - minBpm) / bpmRange; // 0 to 1
        const distance = 20 + (normalizedBpm * 40); // Maps to 20-60 range
        
        const totalFriends = auraData.transformedData.length;
        const angle = (index * 2 * Math.PI) / totalFriends;
        const delay = (index % 8) * 0.15;
        const size = 20;
        
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
                className="absolute inset-0 rounded-full shadow-[0_0_10px_3px_rgba(96,165,250,0.3)]"
                style={{
                  background: `linear-gradient(to bottom right, ${friend.auraColors.from}, ${friend.auraColors.to})`,
                }}
              />
              
              {/* Glass effect */}
              <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm" />
              
              {/* Profile circle */}
              <div className="absolute inset-0.5 rounded-full overflow-hidden bg-gray-100" />

              {/* Name and heart rate info */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="text-white text-[10px] whitespace-nowrap">
                  {friend.name}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-[10px] px-2 py-1 rounded mt-1 whitespace-nowrap">
                  <div>Current: {friend.bpm} BPM</div>
                  <div>Max: {maxBpm} BPM</div>
                  <div>Min: {minBpm} BPM</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}