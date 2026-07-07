/**
 * @file StartupLoader.jsx
 * @description Animated startup screen shown during initial app load and authentication check.
 * @module components/layout/StartupLoader
 */

import { useState, useEffect } from 'react';

export default function StartupLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    "Initializing Global Monitoring Network...",
    "Loading Seismic Intelligence...",
    "Connecting Earthquake Database...",
    "Preparing Analytics Engine...",
    "Loading Risk Detection Systems..."
  ];

  useEffect(() => {
    // 3.5 seconds total loading time
    const duration = 3500;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.floor((currentStep / steps) * 100), 100);
      setProgress(currentProgress);

      // Update status text based on progress
      if (currentProgress < 20) setStatusIndex(0);
      else if (currentProgress < 40) setStatusIndex(1);
      else if (currentProgress < 60) setStatusIndex(2);
      else if (currentProgress < 80) setStatusIndex(3);
      else setStatusIndex(4);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 300); // short delay at 100% before unmounting
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#040d09] flex flex-col items-center justify-center overflow-hidden animate-fade-in-fast">
      {/* Glow blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-olive-500/10 blur-[100px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-earth-400/10 blur-[80px]" />

      <div className="relative flex flex-col items-center">
        {/* Animated Earth */}
        <div className="relative mb-12">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full shadow-[0_0_80px_rgba(193,154,107,0.2),inset_-20px_-20px_40px_rgba(0,0,0,0.8)] border border-earth-700/20 animate-[spin_10s_linear_infinite]"
               style={{
                 background: 'radial-gradient(circle at 35% 35%, #3B7A57 0%, #2D6A4F 25%, #1B4332 50%, #0D2B1F 75%, #040d09 100%)',
                 boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.6), inset 10px 10px 20px rgba(255,255,255,0.1), 0 0 60px rgba(122,139,90,0.15)'
               }}>
            {/* Continents (fake) */}
            <div className="absolute top-[20%] left-[15%] w-[45%] h-[30%] bg-green-500/20 rounded-[60%_40%_70%_30%/50%_60%_40%_50%]"></div>
            <div className="absolute top-[50%] left-[50%] w-[35%] h-[25%] bg-green-500/15 rounded-[40%_60%_50%_50%/60%_40%_60%_40%]"></div>
          </div>
          {/* Ring pulses */}
          <div className="absolute inset-[-20px] rounded-full border border-earth-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          <div className="absolute inset-[-40px] rounded-full border border-olive-500/20 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-500"></div>
        </div>

        {/* Loading text and progress */}
        <div className="text-center space-y-4 max-w-sm w-full px-6 relative z-10">
          <div className="flex justify-between items-end text-earth-300 font-display font-medium tracking-wide">
            <span className="text-xs uppercase opacity-70">System Boot</span>
            <span className="text-2xl">{progress}%</span>
          </div>
          
          <div className="h-1.5 w-full bg-earth-900/50 rounded-full overflow-hidden border border-earth-800/50">
            <div 
              className="h-full bg-gradient-to-r from-olive-500 to-earth-400 rounded-full transition-all duration-75 ease-linear relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 blur-sm animate-[translateX_1s_infinite]"></div>
            </div>
          </div>

          <div className="h-6 mt-4">
            <p className="text-earth-400 text-sm animate-pulse flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-earth-400"></span>
              {statuses[statusIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}