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
        <div className="absolute w-64 h-64 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
        
        <div className="relative space-y-8">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={`
                transition-all duration-500 text-xl md:text-2xl font-light tracking-wide
                ${index === currentStep ? 'text-white scale-110' : 
                  index < currentStep ? 'text-blue-300 scale-90' : 
                  'text-blue-900 scale-75'}
                ${index > currentStep ? 'opacity-0' : 'opacity-100'}
                transform
              `}
            >
              {step.text}
            </div>
          ))}
        </div>

        <div className="mt-16 flex space-x-3">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className={`
                w-2 h-2 rounded-full transition-all duration-300 transform
                ${currentStep === dot ? 'bg-white scale-125' : 'bg-blue-500/50'}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}