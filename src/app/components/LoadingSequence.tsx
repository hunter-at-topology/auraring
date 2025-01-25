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
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      {/* Gooey effect base */}
      <div className="absolute inset-0 bg-black filter blur-[100px] opacity-70" />
      
      {/* Animated blobs */}
      <div className="absolute inset-0 flex items-center justify-center animate-blob-spin">
        <div className="relative w-[800px] h-[800px]">
          {/* Main blobs */}
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-screen opacity-70 animate-blob" 
               style={{ transform: 'translate(-50%, -50%)', filter: 'blur(30px)' }} />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-screen opacity-70 animate-blob [animation-delay:-2s]"
               style={{ transform: 'translate(-60%, -40%)', filter: 'blur(30px)' }} />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-pink-400 to-blue-500 rounded-full mix-blend-screen opacity-70 animate-blob [animation-delay:-4s]"
               style={{ transform: 'translate(-40%, -60%)', filter: 'blur(30px)' }} />
          
          {/* Secondary blobs */}
          <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-screen opacity-50 animate-blob [animation-delay:-1s]"
               style={{ transform: 'translate(-45%, -55%)', filter: 'blur(25px)' }} />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-purple-300 to-pink-400 rounded-full mix-blend-screen opacity-50 animate-blob [animation-delay:-3s]"
               style={{ transform: 'translate(-55%, -45%)', filter: 'blur(25px)' }} />
        </div>
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Loading steps */}
        <div className="space-y-8 mb-16">
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
        <div className="flex space-x-4">
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