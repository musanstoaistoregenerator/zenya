'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ColorGroup {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  description: string;
}

interface ProductData {
  title: string;
  price: string;
  originalPrice?: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  description?: string;
  features?: string[];
  // Additional optional properties for fallback support
  name?: string;
  productName?: string;
  currentPrice?: string;
  salePrice?: string;
  debug?: any;
}

export default function CustomizePage() {
  const router = useRouter();
  const [selectedColorGroup, setSelectedColorGroup] = useState('emerald');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [selectedImageIndices, setSelectedImageIndices] = useState<number[]>([0]);
  const [currentStep, setCurrentStep] = useState<'image' | 'color'>('image');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProductData = localStorage.getItem('productData');
    const generateData = localStorage.getItem('generateData');
    
    if (storedProductData) {
      try {
        const parsed = JSON.parse(storedProductData);
        const genData = generateData ? JSON.parse(generateData) : null;
        
        console.log('Raw ProductData loaded:', parsed);
        console.log('GenerateData loaded:', genData);
        
        // Log the extracted data structure
        if (parsed.data) {
          console.log('Extracted data from API:', parsed.data);
        }
        
        // Handle different data structures
        let productInfo = parsed;
        
        // If the data comes from extraction API, it's wrapped in a 'data' property
        if (parsed.data && typeof parsed.data === 'object') {
          productInfo = parsed.data;
        }
        
        // Only apply fallbacks for truly missing or invalid data
        if (productInfo) {
          // Only fallback price if explicitly "not found" or empty
          if (productInfo.price === 'Price not found' || !productInfo.price || productInfo.price.trim() === '') {
            productInfo.price = '$29.99';
          }
          
          // Only fallback title if explicitly "not found" or empty
          if (!productInfo.title || productInfo.title === 'Product title not found' || productInfo.title.trim() === '') {
            productInfo.title = 'Amazing Product';
          }
          
          // Only fallback rating if missing or invalid number
          if (productInfo.rating === undefined || productInfo.rating === null || isNaN(Number(productInfo.rating))) {
            productInfo.rating = 4.5;
          }
          
          // Only fallback reviewCount if missing or invalid number
           if (productInfo.reviewCount === undefined || productInfo.reviewCount === null || isNaN(Number(productInfo.reviewCount))) {
             productInfo.reviewCount = 127;
           }
         }
         
         console.log('📊 Final processed productInfo:', productInfo);
         
         // Log debug information if available
    if (productData?.debug) {
      console.log('🔍 Extraction Debug Info:', productData.debug);
      console.log('🏷️ H1 elements found:', productData.debug.h1Texts);
      console.log('🎯 Selectors used:', productData.debug.foundSelectors);
      console.log('📄 Meta tags:', productData.debug.metaTags);
    } else if (productInfo?.debug) {
      console.log('🔍 Extraction Debug Info:', productInfo.debug);
      console.log('🏷️ H1 elements found:', productInfo.debug.h1Texts);
      console.log('🎯 Selectors used:', productInfo.debug.foundSelectors);
      console.log('📄 Meta tags:', productInfo.debug.metaTags);
    }
        
        // Check if this is manual entry
        if (genData?.isManualEntry) {
          // For manual entry, data is already in the correct format
          setProductData(productInfo);
          if (productInfo.images && productInfo.images.length > 0) {
            setSelectedImageIndices([0]);
          }
          // Skip image selection step for manual entry since user already provided images
          setCurrentStep('color');
        } else {
          // For extracted data, use existing logic
          setProductData(productInfo);
          if (productInfo.images && productInfo.images.length > 0) {
            setSelectedImageIndices([0]);
          }
        }
      } catch (error) {
        console.error('Error parsing product data:', error);
      }
    } else {
      console.log('No product data found in localStorage');
    }
    setLoading(false);
  }, []);

  const colorGroups: ColorGroup[] = [
    {
      id: 'emerald',
      name: 'Emerald Fresh',
      primary: '#10b981',
      secondary: '#059669',
      description: 'Fresh and trustworthy'
    },
    {
      id: 'blue',
      name: 'Ocean Blue',
      primary: '#3b82f6',
      secondary: '#2563eb',
      description: 'Professional and reliable'
    },
    {
      id: 'purple',
      name: 'Royal Purple',
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      description: 'Luxury and premium'
    },
    {
      id: 'pink',
      name: 'Rose Pink',
      primary: '#ec4899',
      secondary: '#db2777',
      description: 'Feminine and elegant'
    },
    {
      id: 'orange',
      name: 'Sunset Orange',
      primary: '#f97316',
      secondary: '#ea580c',
      description: 'Energetic and bold'
    },
    {
      id: 'red',
      name: 'Cherry Red',
      primary: '#ef4444',
      secondary: '#dc2626',
      description: 'Powerful and urgent'
    },
    {
      id: 'yellow',
      name: 'Golden Yellow',
      primary: '#eab308',
      secondary: '#ca8a04',
      description: 'Optimistic and warm'
    },
    {
      id: 'teal',
      name: 'Teal Mint',
      primary: '#14b8a6',
      secondary: '#0d9488',
      description: 'Modern and clean'
    },
    {
      id: 'indigo',
      name: 'Deep Indigo',
      primary: '#6366f1',
      secondary: '#4f46e5',
      description: 'Sophisticated and tech'
    },
    {
      id: 'slate',
      name: 'Slate Gray',
      primary: '#64748b',
      secondary: '#475569',
      description: 'Minimal and elegant'
    }
  ];

  const selectedGroup = colorGroups.find(group => group.id === selectedColorGroup) || colorGroups[0];

  const handleImageContinue = () => {
    setCurrentStep('color');
  };

  const handleColorContinue = () => {
    // Save customization data
    const customizationData = {
      selectedImages: selectedImageIndices.map(index => productData?.images[index]).filter(Boolean),
        selectedImageIndices,
      colorScheme: selectedGroup,
      productData
    };
    localStorage.setItem('customizationData', JSON.stringify(customizationData));
    router.push('/generate/connect');
  };

  const handleBackToImages = () => {
    setCurrentStep('image');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your product...</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No product data found. Please go back and extract product data first.</p>
          <button 
            onClick={() => router.push('/generate')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 rounded-full px-4 py-2 mb-4">
            <span className="text-emerald-700 font-semibold">
              {currentStep === 'image' ? 'Step 2a of 3' : 'Step 2b of 3'}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {currentStep === 'image' ? 'Choose Product Image' : 'Choose Your Store Colors'}
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {currentStep === 'image' 
              ? 'Select the best image for your product from the extracted images.'
              : 'Select a color scheme that matches your brand. You can always change this later.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Mobile Preview */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                📱 Store Preview
              </h2>
              
              <div className="mx-auto w-80 bg-black rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-white rounded-[2rem] overflow-hidden h-[640px] relative">
                  {/* Phone Status Bar */}
                  <div className="bg-black h-6 rounded-t-[2rem] flex items-center justify-center">
                    <div className="w-20 h-1 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Store Content */}
                  <div className="h-full bg-white overflow-y-auto">
                    {/* Header */}
                    <div 
                      className="px-4 py-3 text-white flex items-center justify-between"
                      style={{ backgroundColor: selectedGroup.primary }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold" style={{ color: selectedGroup.primary }}>S</span>
                        </div>
                        <span className="font-semibold text-sm">Your Store</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                      </div>
                    </div>

                    {/* Banner */}
                    <div 
                      className="px-4 py-2 text-white text-center text-xs"
                      style={{ backgroundColor: selectedGroup.secondary }}
                    >
                      Free shipping on orders over $50! 🚚
                    </div>

                    {/* Product Image */}
                    <div className="px-4 py-4">
                      <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4 overflow-hidden">
                        {productData.images && productData.images[selectedImageIndices[0]] ? (
                        <img 
                          src={productData.images[selectedImageIndices[0]]} 
                            alt={productData.title}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`text-center ${productData.images && productData.images[selectedImageIndices[0]] ? 'hidden' : ''}`}>
                          <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                          <span className="text-xs text-gray-500">Product Image</span>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                        {productData?.title || productData?.name || productData?.productName || 'Amazing Product Name'}
                      </h3>
                      {/* Debug info */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="text-xs text-red-500 mb-2 p-2 bg-red-50 rounded">
                          <div>Debug Info:</div>
                          <div>ProductData exists: {productData ? 'Yes' : 'No'}</div>
                          {productData && (
                            <>
                              <div>Title: {productData.title || 'undefined'}</div>
                              <div>Price: {productData.price || 'undefined'}</div>
                              <div>Rating: {productData.rating || 'undefined'}</div>
                              <div>Images: {productData.images ? productData.images.length : 'undefined'}</div>
                              <div>All keys: {Object.keys(productData).join(', ')}</div>
                            </>
                          )}
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(Math.floor(productData?.rating || 5))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({productData?.reviewCount || 127} reviews)
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-lg font-bold" style={{ color: selectedGroup.primary }}>
                          {productData?.price || productData?.currentPrice || productData?.salePrice || '$29.99'}
                        </span>
                        {productData?.originalPrice && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              {productData.originalPrice}
                            </span>
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">SALE</span>
                          </>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button 
                        className="w-full text-white font-semibold py-3 rounded-lg mb-3"
                        style={{ backgroundColor: selectedGroup.primary }}
                      >
                        Add to Cart
                      </button>
                      
                      <button 
                        className="w-full border-2 font-semibold py-3 rounded-lg"
                        style={{ 
                          borderColor: selectedGroup.primary,
                          color: selectedGroup.primary
                        }}
                      >
                        Buy Now
                      </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="px-4 py-3 bg-gray-50">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="text-xs">
                          <div className="text-green-500 mb-1">✓</div>
                          <span className="text-gray-600">Secure</span>
                        </div>
                        <div className="text-xs">
                          <div className="text-green-500 mb-1">🚚</div>
                          <span className="text-gray-600">Fast Ship</span>
                        </div>
                        <div className="text-xs">
                          <div className="text-green-500 mb-1">↩️</div>
                          <span className="text-gray-600">Returns</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Selection or Color Selection */}
          <div className="order-1 lg:order-2">
            {currentStep === 'image' ? (
              /* Image Selection */
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  🖼️ Product Images
                </h2>
                <p className="text-gray-600 mb-6 text-sm">
                  Click to select multiple images for your store. Selected images will be used in your product gallery.
                </p>
                
                {productData.images && productData.images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {productData.images.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedImageIndices(prev => {
                            if (prev.includes(index)) {
                              // Don't allow deselecting if it's the only selected image
                              return prev.length > 1 ? prev.filter(i => i !== index) : prev;
                            } else {
                              return [...prev, index];
                            }
                          });
                        }}
                        className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 ${
                          selectedImageIndices.includes(index)
                            ? 'border-emerald-600 bg-emerald-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                          <img 
                            src={image} 
                            alt={`${productData.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                            }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Image {index + 1}
                          </span>
                          
                          {selectedImageIndices.includes(index) && (
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">No images found for this product</p>
                      <p className="text-sm text-gray-500">This can happen due to anti-bot protection or dynamic content loading.</p>
                      <p className="text-sm text-emerald-600 mt-2">💡 You can manually add product images in the next step!</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Selected Images: {selectedImageIndices.length}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-6">
                    These images will be used in your product gallery. The first selected image will be the main product image.
                  </p>
                  
                  <button
                    onClick={handleImageContinue}
                    disabled={!productData.images || productData.images.length === 0 || selectedImageIndices.length === 0}
                    className="w-full bg-emerald-600 text-white font-semibold py-4 rounded-xl hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continue to Color Selection →
                  </button>
                </div>
              </>
            ) : (
              /* Color Selection */
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    🎨 Color Schemes
                  </h2>
                  <button
                    onClick={handleBackToImages}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    ← Back to Images
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {colorGroups.map((group) => (
                    <div
                      key={group.id}
                      onClick={() => setSelectedColorGroup(group.id)}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 ${
                        selectedColorGroup === group.id
                          ? 'border-gray-900 bg-gray-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex space-x-1">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: group.primary }}
                          ></div>
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: group.secondary }}
                          ></div>
                        </div>
                        
                        {selectedColorGroup === group.id && (
                          <div className="ml-auto">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-1">{group.name}</h3>
                      <p className="text-sm text-gray-600">{group.description}</p>
                    </div>
                  ))}
                </div>

                {/* Selected Color Info */}
                <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Selected: {selectedGroup.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Primary Color</div>
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg border border-gray-200"
                          style={{ backgroundColor: selectedGroup.primary }}
                        ></div>
                        <span className="font-mono text-sm">{selectedGroup.primary}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Secondary Color</div>
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg border border-gray-200"
                          style={{ backgroundColor: selectedGroup.secondary }}
                        ></div>
                        <span className="font-mono text-sm">{selectedGroup.secondary}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6">
                    {selectedGroup.description} - Perfect for creating a professional and trustworthy store appearance.
                  </p>
                  
                  <button
                    onClick={handleColorContinue}
                    className="w-full bg-gray-900 text-white font-semibold py-4 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Continue to Shopify Connection →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}