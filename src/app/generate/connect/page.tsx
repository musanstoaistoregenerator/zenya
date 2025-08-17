'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ConnectionStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}

export default function ConnectPage() {
  const router = useRouter();
  const [shopifyUrl, setShopifyUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [showSteps, setShowSteps] = useState(false);

  const connectionSteps: ConnectionStep[] = [
    {
      id: 'validate',
      title: 'Validating Store',
      description: 'Checking your Shopify store credentials...',
      icon: '🔍',
      completed: false
    },
    {
      id: 'prepare',
      title: 'Preparing Theme',
      description: 'Packaging your custom theme files...',
      icon: '📦',
      completed: false
    },
    {
      id: 'upload',
      title: 'Uploading Theme',
      description: 'Installing theme to your Shopify store...',
      icon: '⬆️',
      completed: false
    },
    {
      id: 'configure',
      title: 'Configuring Settings',
      description: 'Setting up your store preferences...',
      icon: '⚙️',
      completed: false
    }
  ];

  const [steps, setSteps] = useState(connectionSteps);

  const handleConnect = async () => {
    if (!shopifyUrl.trim()) return;
    
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setShowSteps(true);
    
    // Simulate connection process
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSteps(prevSteps => 
        prevSteps.map((step, index) => ({
          ...step,
          completed: index <= i
        }))
      );
    }
    
    setConnectionStatus('success');
    setIsConnecting(false);
    
    // Redirect to success page after a delay
    setTimeout(() => {
      router.push('/generate/success');
    }, 2000);
  };

  const isValidShopifyUrl = (url: string) => {
    return url.includes('.myshopify.com') || url.includes('shopify.com');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
            <span className="text-blue-700 font-semibold">Step 3 of 3</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Connect Your Shopify Store
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect your Shopify store to automatically install your custom theme and start selling immediately.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!showSteps ? (
            <>
              {/* Connection Form */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.5 2.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-2.5 6c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm-6 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm12 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm-6 6c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z"/>
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    🛍️ Connect to Shopify
                  </h2>
                  
                  <p className="text-gray-600">
                    Enter your Shopify store URL to automatically install your custom theme
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Shopify Store URL
                    </label>
                    
                    <div className="relative">
                      <input
                        type="url"
                        value={shopifyUrl}
                        onChange={(e) => setShopifyUrl(e.target.value)}
                        placeholder="your-store.myshopify.com"
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      />
                      
                      {shopifyUrl && isValidShopifyUrl(shopifyUrl) && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-2">
                      Example: mystore.myshopify.com or mystore.shopify.com
                    </p>
                  </div>

                  <button
                    onClick={handleConnect}
                    disabled={!shopifyUrl.trim() || !isValidShopifyUrl(shopifyUrl) || isConnecting}
                    className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect & Install Theme 🚀'}
                  </button>
                </div>
              </div>

              {/* How it Works */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  🔧 How It Works
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">🔗</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Connect</h4>
                    <p className="text-sm text-gray-600">Enter your Shopify store URL</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">📦</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Package</h4>
                    <p className="text-sm text-gray-600">We prepare your custom theme</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">⬆️</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Install</h4>
                    <p className="text-sm text-gray-600">Theme is installed automatically</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">🎉</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Launch</h4>
                    <p className="text-sm text-gray-600">Your store is ready to sell!</p>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">🔒 Secure Connection</h4>
                    <p className="text-green-700 text-sm">
                      We use Shopify's official API with secure authentication. We never store your credentials and only access what's needed to install your theme.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Connection Progress */
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {connectionStatus === 'success' ? (
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {connectionStatus === 'success' ? '🎉 Successfully Connected!' : '🔄 Connecting to Shopify'}
                </h2>
                
                <p className="text-gray-600">
                  {connectionStatus === 'success' 
                    ? 'Your theme has been installed and your store is ready!' 
                    : 'Please wait while we set up your store...'}
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-500 ${
                      step.completed 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`text-2xl ${
                      step.completed ? '' : 'animate-pulse'
                    }`}>
                      {step.completed ? '✅' : step.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        step.completed ? 'text-green-800' : 'text-gray-700'
                      }`}>
                        {step.title}
                      </h3>
                      
                      <p className={`text-sm ${
                        step.completed ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                    
                    {step.completed && (
                      <div className="text-green-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {connectionStatus === 'success' && (
                <div className="mt-8 text-center">
                  <div className="bg-green-100 border border-green-200 rounded-xl p-6">
                    <h3 className="font-bold text-green-800 mb-2">🎊 Congratulations!</h3>
                    <p className="text-green-700 mb-4">
                      Your AI-generated store is now live and ready to start making sales!
                    </p>
                    <p className="text-sm text-green-600">
                      Redirecting to your success dashboard...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}