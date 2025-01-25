'use client';

import React, { useEffect, useState } from 'react';
import GlowingOrb from './GlowingOrb';

interface LoadingStep {
  text: string;
  duration: number;
}

const loadingSteps: LoadingStep[] = [
  { text: "Retrieving Oura Ring data...", duration: 2000 },
  { text: "Syncing calendar events...", duration: 2000 },
  { text: "Analyzing connections...", duration: 2000 }
];

export default function LoadingSequence({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [orbPosition, setOrbPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const progressSequence = () => {
      if (currentStep < loadingSteps.length) {
        timeout = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, loadingSteps[currentStep].duration);
      } else {
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }, 1000);
      }
    };

    progressSequence();
    return () => clearTimeout(timeout);
  }, [currentStep, onComplete]);

  // Animate orb position
  useEffect(() => {
    const animateOrb = () => {
      const angle = (Date.now() / 3000) % (2 * Math.PI); // Complete circle every 3 seconds
      const radius = 50; // Radius of movement in pixels
      
      setOrbPosition({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      });

      requestAnimationFrame(animateOrb);
    };

    const animation = requestAnimationFrame(animateOrb);
    return () => cancelAnimationFrame(animation);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      {/* Gooey effect base */}
      <div className="absolute inset-0 bg-black filter blur-[200px] opacity-90" />
      
      {/* Lava lamp background effect */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="relative w-screen h-screen">
          {/* Layer 1 - Deep background blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full mix-blend-screen opacity-40 animate-blob-1" 
               style={{ filter: 'blur(150px)', transformOrigin: 'center center' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full mix-blend-screen opacity-40 animate-blob-2 [animation-delay:-15s]"
               style={{ filter: 'blur(180px)', transformOrigin: 'center center' }} />
          
          {/* Layer 2 - Mid-level blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/30 to-blue-600/30 rounded-full mix-blend-screen opacity-50 animate-blob-3 [animation-delay:-7s]"
               style={{ filter: 'blur(130px)', transformOrigin: 'center center' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-r from-pink-400/30 to-purple-600/30 rounded-full mix-blend-screen opacity-50 animate-blob-4 [animation-delay:-20s]"
               style={{ filter: 'blur(140px)', transformOrigin: 'center center' }} />
          
          {/* Layer 3 - Accent blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/40 to-cyan-600/40 rounded-full mix-blend-screen opacity-60 animate-blob-2 [animation-delay:-10s]"
               style={{ filter: 'blur(100px)', transformOrigin: 'center center' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-400/40 to-pink-600/40 rounded-full mix-blend-screen opacity-60 animate-blob-3 [animation-delay:-18s]"
               style={{ filter: 'blur(90px)', transformOrigin: 'center center' }} />
          
          {/* Layer 4 - Small highlight blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-cyan-300/50 to-blue-500/50 rounded-full mix-blend-screen opacity-70 animate-blob-4 [animation-delay:-5s]"
               style={{ filter: 'blur(70px)', transformOrigin: 'center center' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-r from-pink-300/50 to-purple-500/50 rounded-full mix-blend-screen opacity-70 animate-blob-1 [animation-delay:-12s]"
               style={{ filter: 'blur(60px)', transformOrigin: 'center center' }} />
        </div>
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated glowing orb */}


        {/* Loading steps */}
        <div className="space-y-8">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={`
                transition-all duration-700 text-2xl md:text-3xl font-light
                ${index === currentStep ? 'text-white scale-110 translate-x-0' : 
                  index < currentStep ? 'text-blue-300/80 scale-90 -translate-x-8' : 
                  'text-blue-900 scale-90 translate-x-8'}
                ${index > currentStep ? 'opacity-0' : 'opacity-100'}
                transform
                ${index === currentStep ? 'animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:400%_100%]' : ''}
              `}
            >
              {step.text}
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="mt-16 flex space-x-4">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className={`
                w-3 h-3 rounded-full transition-all duration-500
                ${currentStep === dot ? 
                  'bg-white scale-125 animate-pulse' : 
                  currentStep > dot ?
                  'bg-blue-400/80 scale-100' :
                  'bg-blue-900/50 scale-75'}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}