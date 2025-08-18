'use client';

import { useState, useEffect, useRef } from 'react';
import Footer from './footer';
import LoadingAnimation from './loading-animation';
import ColorThemeSelector from './color-theme-selector';


interface GenerationResult {
  success: boolean;
  generatedStore?: any;
  deployment?: any;
  summary?: any;
  error?: string;
}

export default function Dashboard() {
  const [productUrl, setProductUrl] = useState('');
  const [platform, setPlatform] = useState('shopify');
  const [credentials, setCredentials] = useState({
    shopDomain: '',
    accessToken: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const generateButtonRef = useRef<HTMLButtonElement>(null);

  const handleThemeSelect = (theme: any) => {
    setSelectedTheme(theme);
    setShowColorSelector(false);
    
    // Apply theme to the page
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
    
    // Show success message
    alert(`🎨 Theme "${theme.name}" applied successfully! Your store will use these colors.`);
  };

  const handleSkipTheme = () => {
    setShowColorSelector(false);
  };

  const handleGenerate = async () => {
    if (!productUrl.trim()) {
      alert('Please enter a product URL');
      return;
    }

    // Capture button position before starting animation
    let buttonPosition = { x: 50, y: 50 }; // Default center
    if (generateButtonRef.current) {
      const rect = generateButtonRef.current.getBoundingClientRect();
      buttonPosition = {
        x: (rect.left + rect.width / 2) / window.innerWidth * 100,
        y: (rect.top + rect.height / 2) / window.innerHeight * 100
      };
      
      // Add pulse effect to button
      generateButtonRef.current.classList.add('button-pulse');
      setTimeout(() => {
        generateButtonRef.current?.classList.remove('button-pulse');
      }, 300);
    }

    // Trigger loading animation with zoom effect
    setTimeout(() => {
      setShowLoadingAnimation(true);
      // Set CSS custom properties for animation origin
      document.documentElement.style.setProperty('--button-x', `${buttonPosition.x}%`);
      document.documentElement.style.setProperty('--button-y', `${buttonPosition.y}%`);
    }, 150);
    
    setIsGenerating(true);
    setResult(null);

    // Small delay to allow animation to start
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      const response = await fetch('/api/generate-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productUrl: productUrl.trim(),
          platform,
          credentials: platform === 'shopify' && credentials.shopDomain && credentials.accessToken 
            ? credentials 
            : undefined
        }),
      });

      const data = await response.json();
      setResult(data);
      
      // Show color selector if generation was successful
      if (data.success) {
        setTimeout(() => {
          setShowColorSelector(true);
        }, 1000);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate store'
      });
    } finally {
      setIsGenerating(false);
      setShowLoadingAnimation(false);
    }
  };

  return (
    <>
      <LoadingAnimation 
        isVisible={showLoadingAnimation}
        onAnimationComplete={() => setShowLoadingAnimation(false)}
      />
      
      {/* Color Theme Selector */}
      {showColorSelector && (
        <ColorThemeSelector 
          onThemeSelect={handleThemeSelect}
          onSkip={handleSkipTheme}
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
        </div>


        <div className="w-full py-8 relative z-10">
          {/* Trust Indicators - Enhanced 3D Style */}
          <div className="w-full px-4 sm:px-6 lg:px-8 mb-8">
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-center">
                  <div className="flex items-center space-x-3 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">10,000+</div>
                      <div className="text-sm text-gray-600 font-medium">Stores Created</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">98%</div>
                      <div className="text-sm text-gray-600 font-medium">Success Rate</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">$2.5M+</div>
                      <div className="text-sm text-gray-600 font-medium">Revenue Generated</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Main Generator Form - Enhanced 3D Design */}
        <div className="w-full px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-12 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
                    Generate Your AI Store
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Enter any product URL and watch our AI create a complete, optimized e-commerce store in minutes
                  </p>
                </div>

                {/* Product URL Input - Enhanced */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    Product URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      placeholder="https://example.com/product-page"
                      className="w-full px-6 py-4 text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                      disabled={isGenerating}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 mt-3 text-base">
                    Enter any product URL - we'll analyze it and build a complete store around it
                  </p>
                </div>

                {/* Platform Selection - Enhanced */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    Choose Platform
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <button
                      onClick={() => setPlatform('shopify')}
                      className={`group relative p-6 border-2 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 ${
                        platform === 'shopify'
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl'
                          : 'border-gray-200 bg-white/60 hover:border-blue-300 hover:shadow-lg'
                      }`}
                      disabled={isGenerating}
                    >
                      <div className="flex items-center mb-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                          platform === 'shopify' 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                            : 'bg-gray-100 group-hover:bg-blue-100'
                        }`}>
                          <svg className={`w-6 h-6 ${platform === 'shopify' ? 'text-white' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-gray-800">Shopify</div>
                          <div className="text-sm text-gray-500">Deploy to Shopify store</div>
                        </div>
                      </div>
                      {platform === 'shopify' && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setPlatform('woocommerce')}
                      className={`group relative p-6 border-2 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 ${
                        platform === 'woocommerce'
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl'
                          : 'border-gray-200 bg-white/60 hover:border-purple-300 hover:shadow-lg'
                      }`}
                      disabled={isGenerating}
                    >
                      <div className="flex items-center mb-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                          platform === 'woocommerce' 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                            : 'bg-gray-100 group-hover:bg-purple-100'
                        }`}>
                          <svg className={`w-6 h-6 ${platform === 'woocommerce' ? 'text-white' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-gray-800">WooCommerce</div>
                          <div className="text-sm text-gray-500">Coming Soon</div>
                        </div>
                      </div>
                      {platform === 'woocommerce' && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Shopify Credentials - Enhanced */}
                {platform === 'shopify' && (
                  <div className="mb-8 p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-blue-800">
                          Shopify Credentials (Optional)
                        </h3>
                        <p className="text-sm text-blue-600">
                          Auto-deploy to your store or generate content only
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-2">
                          Shop Domain
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={credentials.shopDomain}
                            onChange={(e) => setCredentials(prev => ({ ...prev, shopDomain: e.target.value }))}
                            placeholder="your-shop.myshopify.com"
                            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm"
                            disabled={isGenerating}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-2">
                          Access Token
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            value={credentials.accessToken}
                            onChange={(e) => setCredentials(prev => ({ ...prev, accessToken: e.target.value }))}
                            placeholder="shpat_..."
                            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm"
                            disabled={isGenerating}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate Button - Enhanced */}
                <div className="text-center">
                  <button
                    ref={generateButtonRef}
                    onClick={handleGenerate}
                    disabled={isGenerating || !productUrl.trim()}
                    className="group relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                    style={{
                      transformOrigin: 'center center'
                    }}
                  >
                    {/* Button Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 flex items-center justify-center">
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          <span>Generating Your Store...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Generate AI Store
                        </>
                      )}
                    </div>
                  </button>
                  
                  <p className="text-gray-500 mt-4 text-sm">
                    ✨ AI will analyze your product and create a complete store in minutes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {result.success ? (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800">
                      Store Generated Successfully!
                    </h3>
                  </div>

                  {result.summary && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="text-sm text-indigo-600 font-medium">Product</div>
                        <div className="text-lg font-semibold text-indigo-800">
                          {result.summary.productName}
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600 font-medium">Success Score</div>
                        <div className="text-lg font-semibold text-green-800">
                          {result.summary.successScore}/100
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-purple-600 font-medium">Recommended Price</div>
                        <div className="text-lg font-semibold text-purple-800">
                          ${result.summary.recommendedPrice}
                        </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-sm text-orange-600 font-medium">Market Size</div>
                        <div className="text-lg font-semibold text-orange-800">
                          {result.summary.marketSize}
                        </div>
                      </div>
                    </div>
                  )}

                  {result.deployment?.success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-green-800 mb-2">
                        🚀 Successfully Deployed to {platform === 'shopify' ? 'Shopify' : 'WooCommerce'}
                      </h4>
                      <p className="text-green-700">
                        Your store is live at: 
                        <a 
                          href={result.deployment.storeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 font-medium underline hover:no-underline"
                        >
                          {result.deployment.storeUrl}
                        </a>
                      </p>
                    </div>
                  )}

                  {/* Selected Theme Display */}
                  {selectedTheme && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-purple-800 mb-1">
                            🎨 Selected Theme: {selectedTheme.name}
                          </h4>
                          <p className="text-purple-600 text-sm">
                            Your store will use this beautiful color combination
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <div 
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: selectedTheme.primary }}
                            title="Primary Color"
                          ></div>
                          <div 
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: selectedTheme.secondary }}
                            title="Secondary Color"
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Generated Content Includes:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>✅ Complete product analysis and market research</li>
                      <li>✅ Optimized product descriptions and store content</li>
                      <li>✅ {result.summary?.emailSequences || 0} email marketing sequences</li>
                      <li>✅ {result.summary?.imagesGenerated || 0} AI-generated product images</li>
                      <li>✅ SEO-optimized pages (About, FAQ, Policies)</li>
                      <li>✅ Pricing optimization and competition analysis</li>
                      {selectedTheme && <li>✅ Custom {selectedTheme.name} theme applied</li>}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Generation Failed
                  </h3>
                  <p className="text-gray-600">
                    {result.error || 'An unknown error occurred'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dashboard Stats Section - Enhanced 3D */}
        <div className="w-full px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
                Your Performance Dashboard
              </h2>
              <p className="text-gray-600">Track your store generation success and growth</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stores Created Card */}
              <div className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">12</p>
                      <p className="text-sm font-medium text-gray-600">Stores Created</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <p className="text-sm text-green-600 font-medium">+3 this month</p>
                  </div>
                </div>
              </div>

              {/* Total Revenue Card */}
              <div className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-400/20 to-transparent rounded-full blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">$24,580</p>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <p className="text-sm text-green-600 font-medium">+12% this month</p>
                  </div>
                </div>
              </div>

              {/* Active Stores Card */}
              <div className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-full blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">8</p>
                      <p className="text-sm font-medium text-gray-600">Active Stores</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <p className="text-sm text-blue-600 font-medium">67% conversion rate</p>
                  </div>
                </div>
              </div>

              {/* Themes Used Card */}
              <div className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-400/20 to-transparent rounded-full blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">15</p>
                      <p className="text-sm font-medium text-gray-600">Themes Used</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <p className="text-sm text-orange-600 font-medium">5 favorites</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="w-full px-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <a href="/themes" className="flex flex-col items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Browse Themes</span>
              </a>

              <a href="/dashboard" className="flex flex-col items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Generate Store</span>
              </a>

              <a href="/pricing" className="flex flex-col items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Upgrade Plan</span>
              </a>

              <a href="/support" className="flex flex-col items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Get Support</span>
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="w-full px-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Activity</h3>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-800">View All</a>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Store "TechGadgets Pro" deployed successfully</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Applied "Modern Minimal" theme to FitnessGear store</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Upgraded to Premium plan</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Generated store for "Smart Home Devices"</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - Responsive */}
        <div className="w-full py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Everything You Need to Build a Successful Store
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
              Our AI-powered platform handles every aspect of your e-commerce business, from product analysis to marketing automation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">AI Product Analysis</h3>
              <p className="text-sm sm:text-base text-gray-600">Advanced AI analyzes any product URL to extract key features, benefits, and market positioning for optimal store creation.</p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Instant Deployment</h3>
              <p className="text-sm sm:text-base text-gray-600">Deploy your complete store to Shopify or WooCommerce in minutes, not weeks. No technical knowledge required.</p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Content Generation</h3>
              <p className="text-sm sm:text-base text-gray-600">AI creates compelling product descriptions, marketing copy, email sequences, and all essential store pages.</p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">AI Image Generation</h3>
              <p className="text-sm sm:text-base text-gray-600">Generate professional product images, lifestyle photos, and marketing visuals tailored to your brand.</p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Market Analysis</h3>
              <p className="text-sm sm:text-base text-gray-600">Get detailed market insights, competitor analysis, and pricing recommendations to maximize your success.</p>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Email Marketing</h3>
              <p className="text-sm sm:text-base text-gray-600">Automated email sequences for customer acquisition, retention, and sales optimization built into every store.</p>
            </div>
          </div>
        </div>

        {/* Stats Section - Responsive */}
        <div className="bg-gradient-to-r from-purple-600 to-amber-600 py-8 sm:py-12 lg:py-16">
          <div className="w-full">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-2">
                Trusted by Thousands of Entrepreneurs
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-blue-100 px-4">
                Join the growing community of successful store owners
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">10,000+</div>
                <div className="text-xs sm:text-sm lg:text-base text-blue-100">Stores Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">$2.5M+</div>
                <div className="text-xs sm:text-sm lg:text-base text-blue-100">Revenue Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">98%</div>
                <div className="text-xs sm:text-sm lg:text-base text-blue-100">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">24/7</div>
                <div className="text-xs sm:text-sm lg:text-base text-blue-100">AI Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section - Responsive */}
        <div className="w-full py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              How It Works
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
              From product URL to profitable store in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Enter Product URL</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">Simply paste any product URL from Amazon, AliExpress, or any e-commerce site.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">Our AI analyzes the product, market, and creates optimized content and marketing materials.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Launch Store</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">Deploy your complete, professional store to Shopify or WooCommerce instantly.</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section - Responsive */}
        <div className="bg-gray-50 py-8 sm:py-12 lg:py-16">
          <div className="w-full">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                What Our Users Say
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
                Real stories from real entrepreneurs
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <span className="text-white font-bold text-sm sm:text-base">SM</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">Sarah Mitchell</div>
                    <div className="text-gray-600 text-xs sm:text-sm">E-commerce Entrepreneur</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  "StoreForge helped me launch my first store in just 2 hours. I made my first sale within 24 hours and hit $10k in revenue within the first month!"
                </p>
                <div className="flex text-yellow-400 text-sm sm:text-base">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <span className="text-white font-bold text-sm sm:text-base">MJ</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">Mike Johnson</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Digital Marketer</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  "The AI-generated content is incredible. It created better product descriptions than I could write myself, and the email sequences are converting at 25%!"
                </p>
                <div className="flex text-yellow-400 text-sm sm:text-base">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg sm:col-span-2 lg:col-span-1">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <span className="text-white font-bold text-sm sm:text-base">LC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">Lisa Chen</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Small Business Owner</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  "I've tried other store builders, but nothing comes close to StoreForge. The market analysis alone saved me thousands in advertising costs."
                </p>
                <div className="flex text-yellow-400 text-sm sm:text-base">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section - Responsive */}
        <div className="w-full py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-200">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">$29<span className="text-sm sm:text-base lg:text-lg text-gray-600">/month</span></div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Perfect for testing and small stores</p>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">5 stores per month</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">Basic AI analysis</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">Email support</span>
                </li>
              </ul>
              <button className="w-full bg-gray-900 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base">
                Get Started
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 sm:p-6 lg:p-8 shadow-xl text-white relative sm:col-span-2 lg:col-span-1">
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-yellow-400 text-gray-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                POPULAR
              </div>
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Professional</h3>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">$79<span className="text-sm sm:text-base lg:text-lg opacity-80">/month</span></div>
                <p className="text-sm sm:text-base opacity-90 mb-4 sm:mb-6">Best for growing businesses</p>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">25 stores per month</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">Advanced AI analysis</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">Priority support</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">Custom themes</span>
                </li>
              </ul>
              <button className="w-full bg-white text-blue-600 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base">
                Start Free Trial
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-200 sm:col-span-2 lg:col-span-1">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">$199<span className="text-sm sm:text-base lg:text-lg text-gray-600">/month</span></div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">For agencies and large teams</p>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">Unlimited stores</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">White-label solution</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">Dedicated support</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">API access</span>
                </li>
              </ul>
              <button className="w-full bg-gray-900 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base">
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section - Responsive */}
        <div className="bg-gray-50 py-8 sm:py-12 lg:py-16">
          <div className="w-full">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                Frequently Asked Questions
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
                Everything you need to know about StoreForge
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  How quickly can I launch my store?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Most stores are generated and ready for deployment within 2-5 minutes. The actual deployment to your platform (Shopify/WooCommerce) takes an additional 1-2 minutes.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Do I need technical skills to use StoreForge?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Not at all! StoreForge is designed for entrepreneurs without technical backgrounds. Simply paste a product URL and our AI handles everything else.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  What platforms do you support?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Currently, we support Shopify with full automation. WooCommerce support is coming soon. We also provide downloadable content for any platform.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Can I customize the generated content?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Absolutely! All generated content is fully editable. You can modify descriptions, images, pricing, and any other elements to match your brand.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Is there a money-back guarantee?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Yes! We offer a 30-day money-back guarantee. If you're not satisfied with StoreForge, we'll refund your subscription in full.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Responsive */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 sm:py-12 lg:py-16">
          <div className="w-full text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-2">
              Ready to Build Your Dream Store?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-purple-100 mb-6 sm:mb-8 px-4">
              Join thousands of entrepreneurs who've launched successful stores with StoreForge
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white hover:text-purple-600 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        <Footer />
        </div>
      </div>
    </>
  );
}