'use client';

import React from 'react';
import Image from 'next/image';

interface Friend {
  id: string;
  name: string;
  distance: number;
  imageUrl?: string;
  size?: number;
  auraColors: {
    from: string;
    to: string;
  };
}

export default function AuraRing() {
  // Sample friend data with varying distances and sizes
  const sampleFriends: Friend[] = [
    // Inner circle
    ...Array(8).fill(null).map((_, i) => ({
      id: `inner-${i}`,
      name: `Friend ${i + 1}`,
      distance: 35,
      size: 14,
      imageUrl: '/sample-avatar.jpg',
      auraColors: {
        from: 'rgb(255, 200, 220)',
        to: 'rgb(200, 220, 255)'
      }
    })),
    // Middle circle
    ...Array(12).fill(null).map((_, i) => ({
      id: `middle-${i}`,
      name: `Friend ${i + 9}`,
      distance: 50,
      size: 16,
      imageUrl: '/sample-avatar.jpg',
      auraColors: {
        from: 'rgb(200, 255, 220)',
        to: 'rgb(220, 200, 255)'
      }
    })),
    // Outer circle
    ...Array(16).fill(null).map((_, i) => ({
      id: `outer-${i}`,
      name: `Friend ${i + 21}`,
      distance: 70,
      size: 18,
      imageUrl: '/sample-avatar.jpg',
      auraColors: {
        from: 'rgb(220, 200, 255)',
        to: 'rgb(255, 220, 200)'
      }
    }))
  ];

  return (
    <div className="relative w-full max-w-4xl aspect-square">
      {/* Central glowing orb - your aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
        <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-xl" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500 animate-pulse shadow-[0_0_100px_40px_rgba(96,165,250,0.4)]" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-300/40 via-transparent to-cyan-300/40 animate-pulse [animation-delay:-.5s]" />
      </div>

      {/* Surrounding friend orbs */}
      {sampleFriends.map((friend, index) => {
        const angle = (index * 2 * Math.PI) / (friend.distance === 35 ? 8 : friend.distance === 50 ? 12 : 16);
        const delay = (index % 8) * 0.15;
        const size = friend.size || 16;
        
        return (
          <div
            key={friend.id}
            className="absolute transition-all duration-500 hover:scale-125 cursor-pointer group"
            style={{
              top: `${50 + friend.distance * Math.sin(angle)}%`,
              left: `${50 + friend.distance * Math.cos(angle)}%`,
              transform: 'translate(-50%, -50%)',
              width: `${size}px`,
              height: `${size}px`,
              zIndex: Math.floor(friend.distance),
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
              
              {/* Profile image */}
              <div className="absolute inset-0.5 rounded-full overflow-hidden bg-gray-100">
                {friend.imageUrl && (
                  <Image 
                    src={friend.imageUrl} 
                    alt={friend.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {/* Name tooltip */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap backdrop-blur-sm">
                {friend.name}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}