'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BuildingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  active: boolean;
  error: boolean;
  errorMessage?: string;
}

export default function GeneratingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const buildingSteps: BuildingStep[] = [
    {
      id: 'extract',
      title: 'Extracting Product Data',
      description: 'Analyzing product URL and gathering information...',
      icon: '🔍',
      completed: false,
      active: false,
      error: false
    },
    {
      id: 'research',
      title: 'Market Research',
      description: 'Researching target audience and competitors...',
      icon: '📊',
      completed: false,
      active: false,
      error: false
    },
    {
      id: 'content',
      title: 'Generating Content',
      description: 'Creating product descriptions and marketing copy...',
      icon: '✍️',
      completed: false,
      active: false,
      error: false
    },
    {
      id: 'design',
      title: 'Designing Store Layout',
      description: 'Building responsive store design and structure...',
      icon: '🎨',
      completed: false,
      active: false,
      error: false
    },
    {
      id: 'optimize',
      title: 'Optimizing for Conversions',
      description: 'Adding trust badges and conversion elements...',
      icon: '⚡',
      completed: false,
      active: false,
      error: false
    },
    {
      id: 'finalize',
      title: 'Finalizing Your Store',
      description: 'Preparing your store for customization...',
      icon: '🚀',
      completed: false,
      active: false,
      error: false
    }
  ];

  const [steps, setSteps] = useState(buildingSteps);
  const [hasError, setHasError] = useState(false);

  // API call functions for each step
  const executeStep = async (stepId: string, stepIndex: number) => {
    try {
      // Set step as active
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        active: index === stepIndex,
        completed: index < stepIndex
      })));
      setCurrentStep(stepIndex);
      setProgress((stepIndex / steps.length) * 100);

      // Get product URL and platform from localStorage
      const generateData = JSON.parse(localStorage.getItem('generateData') || '{}');
      const productUrl = generateData.productUrl;
      const platform = generateData.platform || 'unknown';

      if (!productUrl) {
        throw new Error('Product URL not found. Please go back and enter a product URL.');
      }

      let response;
      switch (stepId) {
        case 'extract':
          // Try ScrapingBee first for enhanced extraction
          try {
            response = await fetch('/api/extract-scrapingbee', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: productUrl, platform })
            });
            
            // If ScrapingBee fails, fallback to basic extraction
            if (!response.ok) {
              console.log('ScrapingBee extraction failed, falling back to basic extraction');
              response = await fetch('/api/extract-aliexpress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: productUrl, platform })
              });
            }
          } catch (scrapingBeeError) {
            console.log('ScrapingBee extraction error, falling back to basic extraction:', scrapingBeeError);
            response = await fetch('/api/extract-aliexpress', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: productUrl, platform })
            });
          }
          break;
        case 'research':
          response = await fetch('/api/market-research', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productData: localStorage.getItem('productData') })
          });
          break;
        case 'content':
          response = await fetch('/api/generate-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              productData: localStorage.getItem('productData'),
              marketData: localStorage.getItem('marketData')
            })
          });
          break;
        case 'design':
          response = await fetch('/api/design-store', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              contentData: localStorage.getItem('contentData')
            })
          });
          break;
        case 'optimize':
          response = await fetch('/api/optimize-store', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              storeData: localStorage.getItem('storeData')
            })
          });
          break;
        case 'finalize':
          response = await fetch('/api/finalize-store', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              optimizedData: localStorage.getItem('optimizedData')
            })
          });
          break;
        default:
          throw new Error('Unknown step');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store the result for the next step
      switch (stepId) {
        case 'extract':
          // Store only the data property, not the entire response
          localStorage.setItem('productData', JSON.stringify(data.data || data));
          break;
        case 'research':
          localStorage.setItem('marketData', JSON.stringify(data));
          break;
        case 'content':
          localStorage.setItem('contentData', JSON.stringify(data));
          break;
        case 'design':
          localStorage.setItem('storeData', JSON.stringify(data));
          break;
        case 'optimize':
          localStorage.setItem('optimizedData', JSON.stringify(data));
          break;
        case 'finalize':
          localStorage.setItem('finalStoreData', JSON.stringify(data));
          break;
      }

      // Mark step as completed
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        completed: index <= stepIndex,
        active: false,
        error: false
      })));
      
      return true;
    } catch (error) {
      console.error(`Error in step ${stepId}:`, error);
      
      // Mark step as error
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        active: false,
        error: index === stepIndex,
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
      })));
      
      setHasError(true);
      return false;
    }
  };

  // Execute all steps sequentially
  useEffect(() => {
    const runAllSteps = async () => {
      for (let i = 0; i < buildingSteps.length; i++) {
        const success = await executeStep(buildingSteps[i].id, i);
        if (!success) {
          return; // Stop execution on error
        }
        
        // Small delay between steps for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // All steps completed successfully
      setProgress(100);
      setTimeout(() => {
        router.push('/generate/customize');
      }, 1000);
    };

    runAllSteps();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-700 font-semibold">AI Store Builder</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Creating Your Store
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI is working hard to build your perfect dropshipping store. This usually takes 2-3 minutes.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600">Overall Progress</span>
              <span className="text-sm font-bold text-emerald-600">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Current Step Highlight */}
            {currentStep < steps.length && !hasError && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{steps[currentStep]?.icon}</span>
                  <div>
                    <h3 className="font-semibold text-emerald-800">{steps[currentStep]?.title}</h3>
                    <p className="text-emerald-600 text-sm">{steps[currentStep]?.description}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {hasError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">❌</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800">Generation Failed</h3>
                    <p className="text-red-600 text-sm">
                      {steps.find(step => step.error)?.errorMessage || 'An error occurred during store generation'}
                    </p>
                  </div>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Building Steps Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transition-all duration-500 ${
                  step.error
                    ? 'border-2 border-red-200 bg-red-50/80'
                    : step.completed 
                    ? 'border-2 border-emerald-200 bg-emerald-50/80' 
                    : step.active 
                    ? 'border-2 border-emerald-400 bg-emerald-100/80 scale-105' 
                    : 'border border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`text-3xl transition-all duration-300 ${
                    step.active ? 'animate-bounce' : ''
                  }`}>
                    {step.error ? '❌' : step.completed ? '✅' : step.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${
                      step.error ? 'text-red-800' :
                      step.completed ? 'text-emerald-800' : 
                      step.active ? 'text-emerald-700' : 'text-gray-700'
                    }`}>
                      {step.title}
                    </h3>
                    
                    <p className={`text-sm ${
                      step.error ? 'text-red-600' :
                      step.completed ? 'text-emerald-600' : 
                      step.active ? 'text-emerald-600' : 'text-gray-500'
                    }`}>
                      {step.error ? step.errorMessage : step.description}
                    </p>
                    
                    {step.active && (
                      <div className="mt-3 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-emerald-600 font-medium">In Progress...</span>
                      </div>
                    )}
                    
                    {step.completed && (
                      <div className="mt-3 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs text-emerald-600 font-medium">Completed</span>
                      </div>
                    )}
                    
                    {step.error && (
                      <div className="mt-3 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-red-600 font-medium">Failed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Facts */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">💡 Did You Know?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">2.5x</div>
                <div className="text-sm text-gray-600">Higher conversion rates with AI-optimized stores</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-teal-600">15min</div>
                <div className="text-sm text-gray-600">Average time saved per product listing</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-600">95%</div>
                <div className="text-sm text-gray-600">Of our users see sales within 30 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}