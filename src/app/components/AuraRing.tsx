'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingSequence from './LoadingSequence';

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
    <div className="relative w-full h-screen max-h-[800px] max-w-[800px] mx-auto">
      {/* Central glowing orb - your aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64">
        <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-xl" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500 animate-pulse shadow-[0_0_60px_20px_rgba(96,165,250,0.4)]" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-300/40 via-transparent to-cyan-300/40 animate-pulse [animation-delay:-.5s]" />
      </div>

      {/* Surrounding attendee orbs */}
      {attendeeArray.map((email, index) => {
        const heartRates = auraData?.attendeeHeartRates[email] || [];
        const avgHeartRate = heartRates.length > 0
          ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length)
          : 0;

        // Get min and max BPM values across all attendees
        const allHeartRates = Object.values(auraData?.attendeeHeartRates || {})
          .flatMap(rates => rates.length > 0 
            ? [Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)]
            : []);
        
        const minBpm = Math.min(...allHeartRates);
        const maxBpm = Math.max(...allHeartRates);
        const bpmRange = maxBpm - minBpm || 1; // Prevent division by zero
        
        // Calculate normalized distance (20-60 range for better fit)
        const normalizedBpm = (avgHeartRate - minBpm) / bpmRange; // 0 to 1
        const distance = 20 + (normalizedBpm * 40); // Maps to 20-60 range
        
        const totalAttendees = attendeeArray.length;
        const angle = (index * 2 * Math.PI) / totalAttendees;
        const delay = (index % 8) * 0.15;
        const size = 32;
        
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
              {/* Aura glow */}
              <div 
                className="absolute inset-0 rounded-full shadow-[0_0_10px_3px_rgba(96,165,250,0.3)]"
                style={{
                  backgroundColor: `rgb(${Math.min(255, avgHeartRate)}, 100, 255)`,
                }}
              />
              {/* Initial letter */}
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                {email[0].toUpperCase()}
              </div>
              
              {/* Tooltip */}
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white/10 backdrop-blur-md rounded text-white text-xs whitespace-nowrap">
                {email}
                <br />
                {avgHeartRate > 0 ? `${avgHeartRate} BPM` : 'No heart rate data'}
              </div>
            </div>
          </div>
        );
      })}

      {/* Selected attendee details panel */}
      {selectedAttendee && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-indigo-900/95 to-black/95 backdrop-blur-sm p-4" style={{ zIndex: 1000 }}>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">{selectedAttendee}</h2>
              <button 
                onClick={() => setSelectedAttendee(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Heart Rate */}
              {auraData?.attendeeHeartRates[selectedAttendee] && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white/80 text-sm mb-2">Average Heart Rate</h3>
                  <p className="text-2xl font-semibold text-white">
                    {Math.round(
                      auraData.attendeeHeartRates[selectedAttendee].reduce((a, b) => a + b, 0) / 
                      auraData.attendeeHeartRates[selectedAttendee].length
                    )} BPM
                  </p>
                </div>
              )}

              {/* Meetings */}
              <div>
                <h3 className="text-white/80 text-sm mb-2">Recent Meetings</h3>
                <div className="space-y-2">
                  {auraData?.events
                    .filter(event => event.attendees?.some(a => a.email === selectedAttendee))
                    .map(event => (
                      <div key={event.id} className="bg-white/5 rounded-lg p-4">
                        <h4 className="text-white font-medium">{event.summary || 'Untitled Event'}</h4>
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