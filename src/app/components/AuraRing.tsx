'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingSequence from './LoadingSequence';
import GlowingOrb from './GlowingOrb';

interface Event {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  attendees?: Array<{ email: string }>;
}

interface AuraData {
  events: Event[];
  attendeeHeartRates: { [email: string]: number[] };
}

export default function AuraRing() {
  const [showLoadingSequence, setShowLoadingSequence] = useState(true);
  const [selectedAttendee, setSelectedAttendee] = useState<string | null>(null);

  const { data: auraData, isLoading } = useQuery<AuraData>({
    queryKey: ['auraData'],
    queryFn: async () => {
      const response = await fetch('/api/aura?tokens=' + encodeURIComponent(localStorage.getItem('googleTokens') || ''));
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    },
    enabled: !showLoadingSequence,
  });

  if (showLoadingSequence) {
    return <LoadingSequence onComplete={() => setShowLoadingSequence(false)} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-white text-xl">Finalizing...</div>
      </div>
    );
  }

  // Get unique attendees
  const uniqueAttendees = new Set<string>();
  auraData?.events.forEach(event => {
    event.attendees?.forEach(attendee => {
      if (attendee.email) {
        uniqueAttendees.add(attendee.email);
      }
    });
  });

  const attendeeArray = Array.from(uniqueAttendees);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      {/* Gooey effect base */}
      <div className="absolute inset-0 bg-black filter blur-[200px] opacity-90" />
      
      {/* Lava lamp background effect */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="relative w-screen h-screen">
          {/* Layer 1 - Deep background blobs */}
          <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full mix-blend-screen opacity-40 animate-blob-1" 
               style={{ filter: 'blur(150px)', transform: 'translate(-50%, -50%)' }} />
          <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full mix-blend-screen opacity-40 animate-blob-2 [animation-delay:-15s]"
               style={{ filter: 'blur(180px)', transform: 'translate(-50%, -50%)' }} />
          
          {/* Layer 2 - Mid-level blobs */}
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/30 to-blue-600/30 rounded-full mix-blend-screen opacity-50 animate-blob-3 [animation-delay:-7s]"
               style={{ filter: 'blur(130px)', transform: 'translate(-50%, -50%)' }} />
          <div className="absolute top-1/2 left-1/2 w-[750px] h-[750px] bg-gradient-to-r from-pink-400/30 to-purple-600/30 rounded-full mix-blend-screen opacity-50 animate-blob-4 [animation-delay:-20s]"
               style={{ filter: 'blur(140px)', transform: 'translate(-50%, -50%)' }} />
          
          {/* Layer 3 - Accent blobs */}
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/40 to-cyan-600/40 rounded-full mix-blend-screen opacity-60 animate-blob-2 [animation-delay:-10s]"
               style={{ filter: 'blur(100px)', transform: 'translate(-50%, -50%)' }} />
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-400/40 to-pink-600/40 rounded-full mix-blend-screen opacity-60 animate-blob-3 [animation-delay:-18s]"
               style={{ filter: 'blur(90px)', transform: 'translate(-50%, -50%)' }} />
          
          {/* Layer 4 - Small highlight blobs */}
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-cyan-300/50 to-blue-500/50 rounded-full mix-blend-screen opacity-70 animate-blob-4 [animation-delay:-5s]"
               style={{ filter: 'blur(70px)', transform: 'translate(-50%, -50%)' }} />
          <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-gradient-to-r from-pink-300/50 to-purple-500/50 rounded-full mix-blend-screen opacity-70 animate-blob-1 [animation-delay:-12s]"
               style={{ filter: 'blur(60px)', transform: 'translate(-50%, -50%)' }} />
        </div>
      </div>

      {/* Main content container */}
      <div className="relative w-full h-screen max-h-[800px] max-w-[800px] mx-auto">
        {/* Central aura orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <GlowingOrb size={256} text="aura" />
        </div>

        {/* Surrounding attendee orbs */}
        {attendeeArray.map((email, index) => {
          const heartRates = auraData?.attendeeHeartRates[email] || [];
          const avgHeartRate = heartRates.length > 0
            ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length)
            : 0;

          // Calculate dynamic distance based on heart rate
          const allHeartRates = Object.values(auraData?.attendeeHeartRates || {})
            .flatMap(rates => rates.length > 0 
              ? [Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)]
              : []);

          const minBpm = Math.min(...allHeartRates, avgHeartRate);
          const maxBpm = Math.max(...allHeartRates, avgHeartRate);
          const bpmRange = maxBpm - minBpm || 1;

          // Map heart rate to distance (30-70 range)
          const normalizedBpm = avgHeartRate ? (avgHeartRate - minBpm) / bpmRange : 0.5;
          const distance = 30 + (normalizedBpm * 40);

          const totalAttendees = attendeeArray.length;
          const angle = (index * 2 * Math.PI) / totalAttendees;
          const delay = (index % 8) * 0.15;
          
          // Dynamic size based on heart rate
          const baseSize = 40;
          const sizeVariation = avgHeartRate ? (normalizedBpm * 10) : 0;
          const size = baseSize + sizeVariation;

          // Dynamic glow intensity based on heart rate
          const glowIntensity = avgHeartRate ? Math.min(0.8, 0.4 + (normalizedBpm * 0.4)) : 0.4;
          const glowSize = avgHeartRate ? Math.min(30, 15 + (normalizedBpm * 15)) : 15;
          
          return (
            <div
              key={email}
              className="absolute transition-all duration-500 hover:scale-125 cursor-pointer group"
              style={{
                top: `${50 + distance * Math.sin(angle)}%`,
                left: `${50 + distance * Math.cos(angle)}%`,
                transform: 'translate(-50%, -50%)',
                width: `${size}px`,
                height: `${size}px`,
                zIndex: Math.floor(distance),
              }}
              onClick={() => setSelectedAttendee(email)}
            >
              <div 
                className="relative w-full h-full animate-float" 
                style={{ 
                  animationDelay: `${delay}s`,
                  animationDuration: '3s'
                }}
              >
                {/* Attendee orb glow - dynamic based on heart rate */}
                <div 
                  className="absolute inset-0 rounded-full mix-blend-screen"
                  style={{
                    background: `radial-gradient(circle at center, 
                      rgba(96, 165, 250, ${glowIntensity}) 0%,
                      rgba(147, 51, 234, ${glowIntensity * 0.7}) 70%,
                      rgba(147, 51, 234, 0) 100%)`,
                    boxShadow: `0 0 ${glowSize}px ${glowSize/2}px rgba(96,165,250,0.3)`
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-white/30 mix-blend-overlay" />
                
                {/* Initial letter */}
                <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-light">
                  {email[0].toUpperCase()}
                </div>
                
                {/* Enhanced tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white text-sm whitespace-nowrap">
                  <div className="font-medium">{email}</div>
                  <div className="text-xs opacity-80">
                    {avgHeartRate > 0 ? (
                      <>
                        <span className="text-cyan-300">{avgHeartRate} BPM</span>
                        <span className="text-xs opacity-60 ml-1">
                          ({Math.round(normalizedBpm * 100)}% intensity)
                        </span>
                      </>
                    ) : 'No heart rate data'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Selected attendee details panel */}
      {selectedAttendee && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md p-4" style={{ zIndex: 1000 }}>
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto border border-white/10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-black/60 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light text-white tracking-wide">{selectedAttendee}</h2>
              <button 
                onClick={() => setSelectedAttendee(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Heart Rate */}
              {auraData?.attendeeHeartRates[selectedAttendee] && (
                <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/5">
                  <h3 className="text-white/80 text-sm font-medium mb-2">Average Heart Rate</h3>
                  <p className="text-3xl font-light text-white">
                    {Math.round(
                      auraData.attendeeHeartRates[selectedAttendee].reduce((a, b) => a + b, 0) / 
                      auraData.attendeeHeartRates[selectedAttendee].length
                    )} BPM
                  </p>
                </div>
              )}

              {/* Meetings */}
              <div>
                <h3 className="text-white/80 text-sm font-medium mb-3">Recent Meetings</h3>
                <div className="space-y-3">
                  {auraData?.events
                    .filter(event => event.attendees?.some(a => a.email === selectedAttendee))
                    .map(event => (
                      <div key={event.id} className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/5">
                        <h4 className="text-white font-medium mb-1">{event.summary || 'Untitled Event'}</h4>
                        <p className="text-white/60 text-sm">
                          {new Date(event.start?.dateTime || event.start?.date || '').toLocaleString()}
                        </p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}