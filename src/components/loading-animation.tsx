'use client';

import { useEffect, useState, useRef, useMemo } from 'react';

interface LoadingAnimationProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

export default function LoadingAnimation({ isVisible, onAnimationComplete }: LoadingAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<'zoom' | 'fullscreen' | 'complete'>('zoom');
  const [loadingText, setLoadingText] = useState('🔍 Analyzing your product...');
  const [progress, setProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [smoothMousePosition, setSmoothMousePosition] = useState({ x: 50, y: 50 });
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number}>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadingMessages = useMemo(() => [
    '🔍 Analyzing your product...',
    '📊 Researching market trends...',
    '🏗️ Building store foundation...',
    '✍️ Creating product descriptions...',
    '🎨 Designing store layout...',
    '⚡ Optimizing for conversions...',
    '🚀 Finalizing your store...'
  ], []);

  const features = [
    { icon: '🤖', title: 'AI-Powered Analysis', desc: 'Smart product insights' },
    { icon: '📱', title: 'Mobile-First Design', desc: 'Responsive layouts' },
    { icon: '💳', title: 'Payment Integration', desc: 'Secure transactions' },
    { icon: '🔍', title: 'SEO Optimization', desc: 'Better visibility' },
    { icon: '📈', title: 'Analytics Ready', desc: 'Track performance' },
    { icon: '⚡', title: 'Fast Loading', desc: 'Optimized speed' }
  ];

  useEffect(() => {
    if (!isVisible) return;

    // Real mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    // Very smooth mouse interpolation (60fps)
     const smoothInterval = setInterval(() => {
       setSmoothMousePosition(prev => ({
         x: prev.x + (mousePosition.x - prev.x) * 0.03, // Much slower, very smooth interpolation
         y: prev.y + (mousePosition.y - prev.y) * 0.03
       }));
     }, 16);

    // Start with zoom animation
    const zoomTimer = setTimeout(() => {
      setAnimationPhase('fullscreen');
    }, 300);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onAnimationComplete?.(), 1000);
          return 100;
        }
        return prev + 0.5; // Slower progress
      });
    }, 120);

    // Cycle through loading messages
    let messageIndex = 0;
    const messageTimer = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 3000);

    // Initialize particles with much slower movement
     const initialParticles = Array.from({ length: 15 }, (_, i) => ({
       id: i,
       x: Math.random() * 100,
       y: Math.random() * 100,
       vx: (Math.random() - 0.5) * 0.02, // Much slower horizontal movement
       vy: (Math.random() - 0.5) * 0.02  // Much slower vertical movement
     }));
     setParticles(initialParticles);

     // Animate particles much slower
     const particleInterval = setInterval(() => {
       setParticles(prev => prev.map(particle => ({
         ...particle,
         x: (particle.x + particle.vx + 100) % 100,
         y: (particle.y + particle.vy + 100) % 100
       })));
     }, 200); // Much slower update interval

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(zoomTimer);
      clearInterval(messageTimer);
      clearInterval(progressInterval);
      clearInterval(smoothInterval);
      clearInterval(particleInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible, mousePosition, loadingMessages, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 ${
        animationPhase === 'zoom' 
          ? 'scale-0 opacity-0' 
          : 'zoom-in-animation'
      }`}
    >
      {/* White Background with animated pattern */}
      <div className="absolute inset-0 bg-white overflow-hidden">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="animatedGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#6366f1" strokeWidth="0.5"/>
                <circle cx="0" cy="0" r="0.5" fill="#6366f1" opacity="0.2">
                   <animate attributeName="opacity" values="0.2;0.4;0.2" dur="8s" repeatCount="indefinite"/>
                 </circle>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#animatedGrid)" />
          </svg>
        </div>

        {/* Floating particles */}
         {particles.map(particle => (
           <div
             key={particle.id}
             className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-40"
             style={{
               left: `${particle.x}%`,
               top: `${particle.y}%`,
               transform: 'translate(-50%, -50%)',
               transition: 'all 0.3s ease-out'
             }}
           />
         ))}

        {/* Mouse-following elements */}
         <div 
           className="absolute transition-all duration-1000 ease-out pointer-events-none"
           style={{
             left: `${smoothMousePosition.x}%`,
             top: `${smoothMousePosition.y}%`,
             transform: 'translate(-50%, -50%)'
           }}
         >
          {/* Large glow effect */}
          <div className="absolute w-32 h-32 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full opacity-30 blur-xl -translate-x-1/2 -translate-y-1/2"></div>
          
          {/* Medium glow */}
          <div className="absolute w-16 h-16 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-50 blur-lg -translate-x-1/2 -translate-y-1/2"></div>
          
          {/* Small center dot */}
          <div className="absolute w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        </div>

        {/* Building Construction Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Building Blocks */}
           {[...Array(8)].map((_, i) => (
             <div
               key={i}
               className="absolute bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg shadow-lg animate-build-up"
               style={{
                 width: `${40 + Math.random() * 60}px`,
                 height: `${30 + Math.random() * 50}px`,
                 left: `${10 + i * 10}%`,
                 bottom: `${5 + Math.random() * 30}%`,
                 animationDelay: `${i * 0.8}s`,
                 animationDuration: `${4 + Math.random() * 3}s`,
                 transform: `rotate(${Math.random() * 10 - 5}deg)`
               }}
             />
           ))}

          {/* Construction Cranes */}
          <div className="absolute top-10 right-20 animate-crane-swing" style={{ animationDuration: '8s' }}>
            <svg width="100" height="160" viewBox="0 0 100 160" className="text-indigo-300">
              <line x1="15" y1="150" x2="15" y2="15" stroke="currentColor" strokeWidth="3"/>
              <line x1="15" y1="25" x2="85" y2="25" stroke="currentColor" strokeWidth="2"/>
              <line x1="75" y1="25" x2="75" y2="40" stroke="currentColor" strokeWidth="2"/>
              <rect x="70" y="40" width="10" height="12" fill="currentColor"/>
              <circle cx="15" cy="150" r="8" fill="currentColor" opacity="0.3"/>
            </svg>
          </div>

          {/* More Construction Cranes */}
          <div className="absolute top-20 left-20 animate-crane-swing" style={{ animationDelay: '2s', animationDuration: '10s' }}>
            <svg width="80" height="120" viewBox="0 0 80 120" className="text-purple-300">
              <line x1="12" y1="110" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="20" x2="65" y2="20" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="58" y1="20" x2="58" y2="32" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="54" y="32" width="8" height="10" fill="currentColor"/>
            </svg>
          </div>

          {/* Floating Tools with better animation */}
           {[...Array(6)].map((_, i) => (
             <div
               key={i}
               className="absolute animate-float-tool"
               style={{
                 left: `${15 + i * 15}%`,
                 top: `${25 + Math.random() * 50}%`,
                 animationDelay: `${i * 1}s`,
                 animationDuration: `${8 + Math.random() * 4}s`
               }}
             >
              {i % 4 === 0 && (
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-indigo-400">
                  <path fill="currentColor" d="M22,21H2V19H22V21M3.5,18H12.5C13.33,18 14,17.33 14,16.5C14,15.67 13.33,15 12.5,15H3.5C2.67,15 2,15.67 2,16.5C2,17.33 2.67,18 3.5,18M22,16.5C22,17.33 21.33,18 20.5,18S19,17.33 19,16.5C19,15.67 19.67,15 20.5,15S22,15.67 22,16.5M15.5,14H18.5C19.33,14 20,13.33 20,12.5C20,11.67 19.33,11 18.5,11H15.5C14.67,11 14,11.67 14,12.5C14,13.33 14.67,14 15.5,14M8.5,14C9.33,14 10,13.33 10,12.5C10,11.67 9.33,11 8.5,11S7,11.67 7,12.5C7,13.33 7.67,14 8.5,14M12,10H15V7H12V10Z"/>
                </svg>
              )}
              {i % 4 === 1 && (
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-purple-400">
                  <path fill="currentColor" d="M13,3V7H18V3H13M13,21H18V17H13V21M11,21V17L6,17V21H11M11,15H18V9H11V15M6,15H9V9H6V15M4,7V3H9V7H4M2,1V23H20V1H2Z"/>
                </svg>
              )}
              {i % 4 === 2 && (
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-blue-400">
                  <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                </svg>
              )}
              {i % 4 === 3 && (
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-green-400">
                  <path fill="currentColor" d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1H5C3.89,1 3,1.89 3,3V21A2,2 0 0,0 5,23H19A2,2 0 0,0 21,21V9M19,9H14V4H19V9Z"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8 animate-bounce-slow">
            <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                StoreForge AI
              </span>
            </h1>
          </div>

          {/* Loading Content */}
          <div className="space-y-8">
            {/* Main Loading Text */}
            <div className="animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-4">
                Building Your AI-Powered Store
              </h2>
              <p className="text-xl text-gray-600 transition-all duration-500">
                {loadingText}
              </p>
            </div>

            {/* Enhanced Progress Indicators */}
            <div className="space-y-8">
              {/* Animated Progress Bar */}
              <div className="w-full max-w-lg mx-auto">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300 ease-out shadow-sm"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Building Blocks Animation */}
              <div className="flex justify-center space-x-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 bg-gradient-to-br from-indigo-400 to-purple-500 rounded animate-build-blocks shadow-sm"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12 animate-fade-in-up" style={{ animationDelay: '1s' }}>
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${1 + index * 0.1}s` }}
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="text-gray-800 font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-xs">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Fun facts */}
            <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '2s' }}>
              <p className="text-gray-500 text-sm">
                💡 Did you know? Our AI analyzes over 50 data points to create your perfect store!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes build-up {
          0% { 
            transform: translateY(50px) scale(0.9) rotate(-5deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-5px) scale(1.02) rotate(2deg);
            opacity: 0.8;
          }
          100% { 
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes crane-swing {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        
        @keyframes float-tool {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1);
            opacity: 0.7;
          }
          33% { 
            transform: translateY(-10px) rotate(3deg) scale(1.05);
            opacity: 1;
          }
          66% { 
            transform: translateY(-5px) rotate(-2deg) scale(0.98);
            opacity: 0.9;
          }
        }
        
        @keyframes build-blocks {
          0%, 100% { 
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-12px) scale(1.1) rotate(5deg);
            opacity: 1;
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-build-up { animation: build-up 2.5s ease-out forwards; }
        .animate-crane-swing { animation: crane-swing 6s ease-in-out infinite; }
        .animate-float-tool { animation: float-tool 4s ease-in-out infinite; }
        .animate-build-blocks { animation: build-blocks 1.8s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
      `}</style>
    </div>
  );
}