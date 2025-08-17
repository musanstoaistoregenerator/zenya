'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../components/footer';
import ManualProductEntry from '../../components/ManualProductEntry';

export default function GeneratePage() {
  const router = useRouter();
  const [productUrl, setProductUrl] = useState('');
  const [platform, setPlatform] = useState('shopify');
  const [credentials, setCredentials] = useState({
    apiKey: '',
    password: '',
    storeUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showUrlGuide, setShowUrlGuide] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

  const handleGenerate = async () => {
    if (!productUrl.trim()) {
      alert('Please enter a product URL or description');
      return;
    }

    // Store the product URL and platform in localStorage for the loading page
    localStorage.setItem('generateData', JSON.stringify({
      productUrl: productUrl.trim(),
      platform: platform,
    }));

    // Redirect to loading page
    router.push('/generate/loading');
  };

  const handleManualProductSubmit = (productData: any) => {
    // Store the manual product data directly
    localStorage.setItem('productData', JSON.stringify(productData));
    localStorage.setItem('generateData', JSON.stringify({
      productUrl: 'manual-entry',
      platform: platform,
      isManualEntry: true
    }));

    // Skip extraction and go directly to customize
    router.push('/generate/customize');
  };

  const handleManualEntryCancel = () => {
    setShowManualEntry(false);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 pt-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-300/10 to-emerald-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-800 bg-clip-text text-transparent mb-4">
            Generate Your AI Store ✨
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Transform any AliExpress, Amazon, or e-commerce product into a complete store with AI-powered design and content generation
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-12 opacity-70">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-800">AI-Powered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-800">AliExpress Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-800">5-Star Rated</span>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-emerald-200/30 p-8">
          <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }} className="space-y-8">
            
            {/* Product URL Input */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="productUrl" className="block text-sm font-semibold text-gray-800">
                  🛍️ Product URL or Description
                </label>
                <button
                  type="button"
                  onClick={() => setShowUrlGuide(true)}
                  className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Where to find URLs?</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="productUrl"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="Paste any e-commerce product URL here (Note: Some sites may have limited data extraction due to anti-bot protection)..."
                  className="w-full px-4 py-4 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">💡 Enhanced extraction with ScrapingBee - bypasses anti-bot protection for better success rates</p>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                🚀 Choose Platform
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPlatform('shopify')}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    platform === 'shopify'
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 shadow-lg'
                      : 'border-white/30 bg-white/30 text-gray-700 hover:border-emerald-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">Shopify</div>
                    <div className="text-sm opacity-75 mt-1">Professional e-commerce</div>
                  </div>
                </button>
                
                <div className="p-4 rounded-2xl border-2 border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed">
                  <div className="text-center">
                    <div className="text-lg font-semibold">WooCommerce</div>
                    <div className="text-sm mt-1">Coming Soon</div>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl border-2 border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed">
                  <div className="text-center">
                    <div className="text-lg font-semibold">Custom</div>
                    <div className="text-sm mt-1">Contact Us</div>
                  </div>
                </div>
              </div>
            </div>





            {/* Generate Button */}
            <button
              type="submit"
              disabled={isLoading || !productUrl}
              className="w-full py-4 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg hover:scale-105 active:scale-95 transform"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating Your Store...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate AI Store</span>
                </div>
              )}
            </button>

            {/* Manual Entry Option */}
            <div className="text-center">
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500 bg-white">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              
              <button
                type="button"
                onClick={() => setShowManualEntry(true)}
                className="w-full py-3 px-6 border-2 border-emerald-200 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 hover:scale-105 active:scale-95 transform"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Enter Product Details Manually</span>
                </div>
              </button>
              
              <p className="text-xs text-gray-500 mt-2">
                💡 Perfect when automatic extraction fails or you want full control over product details
              </p>
            </div>

            {/* Loading Animation */}
            {isLoading && (
              <div className="text-center space-y-4">
                <div className="flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <p className="text-gray-600">
                  AI is analyzing your product and creating your store...
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">URL Extraction</h3>
            <p className="text-gray-600">Automatically extract product details, images, and specs from any e-commerce URL.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Content Generation</h3>
            <p className="text-gray-600">Smart product descriptions, SEO content, and marketing copy generated automatically.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Complete store ready in minutes with professional design and optimized performance.</p>
          </div>
        </div>
      </div>

      {/* URL Guide Popup */}
      {showUrlGuide && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🔍 Where to Find Product URLs</h2>
                <button
                  onClick={() => setShowUrlGuide(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Platform Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* AliExpress */}
                <div className="border border-orange-200 rounded-xl p-4 bg-orange-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Ali</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">AliExpress</h3>
                      <p className="text-sm text-orange-600">Best for dropshipping</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">Copy product URL from any AliExpress product page. Great wholesale prices for high profit margins.</p>
                </div>

                {/* Amazon */}
                <div className="border border-yellow-200 rounded-xl p-4 bg-yellow-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">AMZ</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Amazon</h3>
                      <p className="text-sm text-yellow-600">Proven products</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">Use Amazon product URLs to find validated products with customer reviews and demand.</p>
                </div>

                {/* eBay */}
                <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">eBay</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">eBay</h3>
                      <p className="text-sm text-blue-600">Unique finds</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">Discover unique products and trending items from eBay listings.</p>
                </div>

                {/* Other Stores */}
                <div className="border border-purple-200 rounded-xl p-4 bg-purple-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Other Stores</h3>
                      <p className="text-sm text-purple-600">Any e-commerce site</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">Works with Shopify stores, WooCommerce sites, and most e-commerce platforms.</p>
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-emerald-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  💡 Pro Tips
                </h3>
                <ul className="space-y-2 text-sm text-emerald-700">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span><strong>Don't use the same URL twice</strong> - If you find the same product on multiple platforms, choose the one with the best price and reviews</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span><strong>AliExpress is best for dropshipping</strong> - Lower wholesale prices mean higher profit margins</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span><strong>Check product reviews</strong> - Products with good reviews convert better</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span><strong>Look for trending products</strong> - Items with high demand and low competition work best</span>
                  </li>
                </ul>
              </div>

              {/* How to Copy URL */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">📋 How to Copy Product URL</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                    <span>Go to any product page on AliExpress, Amazon, eBay, etc.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                    <span>Copy the URL from your browser's address bar</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                    <span>Paste it in the input field above and click Generate!</span>
                  </li>
                </ol>
              </div>

              {/* Close Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowUrlGuide(false)}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Got it! Let's Generate 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Manual Product Entry Modal */}
      {showManualEntry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ManualProductEntry
              onSubmit={handleManualProductSubmit}
              onCancel={handleManualEntryCancel}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}