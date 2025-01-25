'use client';

import React, { useEffect, useState } from 'react';

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

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-black transition-opacity duration-500">
      <div className="relative flex flex-col items-center">
        {/* Dynamic background effects */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-3xl animate-pulse [animation-delay:500ms]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-pink-500/10 blur-3xl animate-pulse [animation-delay:1000ms]" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="relative space-y-8">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={`
                transition-all duration-700 text-xl md:text-2xl font-light tracking-wide
                ${index === currentStep ? 'text-white scale-125 translate-x-0' : 
                  index < currentStep ? 'text-blue-300 scale-75 -translate-x-16' : 
                  'text-blue-900 scale-75 translate-x-16'}
                ${index > currentStep ? 'opacity-0' : 'opacity-100'}
                transform hover:text-cyan-300 cursor-default
                animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:400%_100%]
              `}
            >
              {step.text}
            </div>
          ))}
        </div>

        {/* Animated progress dots */}
        <div className="mt-16 flex space-x-4">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className={`
                w-3 h-3 rounded-full transition-all duration-500 transform
                ${currentStep === dot ? 
                  'bg-white scale-150 animate-ping' : 
                  currentStep > dot ?
                  'bg-cyan-400 scale-100' :
                  'bg-blue-500/50 scale-75'
                }
                hover:bg-cyan-300 cursor-pointer
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}