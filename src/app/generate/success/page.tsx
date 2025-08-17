'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface StoreStats {
  productsAdded: number;
  pagesCreated: number;
  emailsGenerated: number;
  conversionOptimizations: number;
}

export default function SuccessPage() {
  const router = useRouter();
  const [storeStats] = useState<StoreStats>({
    productsAdded: 1,
    pagesCreated: 5,
    emailsGenerated: 7,
    conversionOptimizations: 12
  });

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewStore = () => {
    // In a real app, this would redirect to the actual Shopify store
    window.open('https://your-store.myshopify.com', '_blank');
  };

  const handleCreateAnother = () => {
    router.push('/generate');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <span className="text-2xl">
                {['🎉', '🎊', '✨', '🚀', '💎', '🏆'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-6 py-3 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-semibold">Store Successfully Created!</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            🎉 Congratulations!
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your AI-powered dropshipping store is now live and ready to start making sales! 
            We've installed everything you need to begin your e-commerce journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleViewStore}
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors text-lg shadow-lg"
            >
              🛍️ View Your Store
            </button>
            
            <button
              onClick={handleDashboard}
              className="bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors text-lg"
            >
              📊 Go to Dashboard
            </button>
          </div>
        </div>

        {/* Store Stats */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              📈 What We've Built For You
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{storeStats.productsAdded}</div>
                <div className="text-sm text-gray-600">Product Added</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{storeStats.pagesCreated}</div>
                <div className="text-sm text-gray-600">Pages Created</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">{storeStats.emailsGenerated}</div>
                <div className="text-sm text-gray-600">Email Sequences</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600 mb-2">{storeStats.conversionOptimizations}</div>
                <div className="text-sm text-gray-600">Optimizations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Included */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            ✨ Everything Included in Your Store
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="font-semibold text-gray-900 mb-2">Custom Design</h3>
              <p className="text-gray-600 text-sm">Beautiful, mobile-responsive theme optimized for conversions</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Generated Content</h3>
              <p className="text-gray-600 text-sm">Compelling product descriptions and marketing copy</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Marketing</h3>
              <p className="text-gray-600 text-sm">7 automated email sequences for customer engagement</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Trust Elements</h3>
              <p className="text-gray-600 text-sm">Security badges, reviews, and trust signals</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
              <p className="text-gray-600 text-sm">Perfect experience on all devices</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Loading</h3>
              <p className="text-gray-600 text-sm">Optimized for speed and SEO performance</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🚀 Next Steps to Start Selling
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h3 className="font-semibold text-green-800">Review Your Store</h3>
                  <p className="text-green-700 text-sm">Check your store design, product details, and settings</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h3 className="font-semibold text-blue-800">Set Up Payment Processing</h3>
                  <p className="text-blue-700 text-sm">Configure Shopify Payments or your preferred payment gateway</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h3 className="font-semibold text-purple-800">Launch Marketing Campaigns</h3>
                  <p className="text-purple-700 text-sm">Start driving traffic with social media ads and email marketing</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-xl">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <h3 className="font-semibold text-orange-800">Monitor & Optimize</h3>
                  <p className="text-orange-700 text-sm">Track performance and optimize for better conversions</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={handleCreateAnother}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Create Another Store 🔄
              </button>
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