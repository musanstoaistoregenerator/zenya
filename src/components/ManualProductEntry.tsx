'use client';

import { useState } from 'react';

interface ProductData {
  title: string;
  price: string;
  originalPrice?: string;
  description: string;
  images: string[];
  features: string[];
  rating?: number;
  reviewCount?: number;
  category?: string;
  brand?: string;
}

interface ManualProductEntryProps {
  onSubmit: (productData: ProductData) => void;
  onCancel: () => void;
  initialData?: Partial<ProductData>;
}

export default function ManualProductEntry({ onSubmit, onCancel, initialData }: ManualProductEntryProps) {
  const [productData, setProductData] = useState<ProductData>({
    title: initialData?.title || '',
    price: initialData?.price || '',
    originalPrice: initialData?.originalPrice || '',
    description: initialData?.description || '',
    images: initialData?.images || [''],
    features: initialData?.features || [''],
    rating: initialData?.rating || undefined,
    reviewCount: initialData?.reviewCount || undefined,
    category: initialData?.category || '',
    brand: initialData?.brand || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!productData.title.trim()) {
      newErrors.title = 'Product title is required';
    }
    
    if (!productData.price.trim()) {
      newErrors.price = 'Product price is required';
    } else if (!/^\$?\d+(\.\d{2})?$/.test(productData.price.replace(/[^\d.]/g, ''))) {
      newErrors.price = 'Please enter a valid price (e.g., $29.99 or 29.99)';
    }
    
    if (!productData.description.trim()) {
      newErrors.description = 'Product description is required';
    }
    
    const validImages = productData.images.filter(img => img.trim());
    if (validImages.length === 0) {
      newErrors.images = 'At least one product image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Clean up the data before submitting
      const cleanedData: ProductData = {
        ...productData,
        images: productData.images.filter(img => img.trim()),
        features: productData.features.filter(feature => feature.trim()),
        price: productData.price.startsWith('$') ? productData.price : `$${productData.price}`
      };
      
      onSubmit(cleanedData);
    }
  };

  const addImageField = () => {
    setProductData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index: number, value: string) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addFeatureField = () => {
    setProductData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeatureField = (index: number) => {
    setProductData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setProductData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Manual Product Entry
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Enter your product details manually. All fields marked with * are required.
        </p>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Product Title *</label>
              <input
                id="title"
                type="text"
                value={productData.title}
                onChange={(e) => setProductData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter product title"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
              <input
                id="brand"
                type="text"
                value={productData.brand}
                onChange={(e) => setProductData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="Enter brand name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Current Price *</label>
              <input
                id="price"
                type="text"
                value={productData.price}
                onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="$29.99"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">Original Price</label>
              <input
                id="originalPrice"
                type="text"
                value={productData.originalPrice}
                onChange={(e) => setProductData(prev => ({ ...prev, originalPrice: e.target.value }))}
                placeholder="$49.99"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input
                id="category"
                type="text"
                value={productData.category}
                onChange={(e) => setProductData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Electronics, Fashion, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
              <input
                id="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={productData.rating || ''}
                onChange={(e) => setProductData(prev => ({ ...prev, rating: e.target.value ? parseFloat(e.target.value) : undefined }))}
                placeholder="4.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reviewCount" className="block text-sm font-medium text-gray-700">Number of Reviews</label>
              <input
                id="reviewCount"
                type="number"
                min="0"
                value={productData.reviewCount || ''}
                onChange={(e) => setProductData(prev => ({ ...prev, reviewCount: e.target.value ? parseInt(e.target.value) : undefined }))}
                placeholder="1250"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Product Description *</label>
            <textarea
              id="description"
              value={productData.description}
              onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter detailed product description..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Product Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Product Images *</label>
              <button 
                type="button" 
                onClick={addImageField} 
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 flex items-center gap-1"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Image
              </button>
            </div>
            
            <div className="space-y-2">
              {productData.images.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateImage(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {productData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
          </div>

          {/* Product Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Product Features</label>
              <button 
                type="button" 
                onClick={addFeatureField} 
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 flex items-center gap-1"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Feature
              </button>
            </div>
            
            <div className="space-y-2">
              {productData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Enter product feature or specification"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {productData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureField(index)}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onCancel} 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 font-medium"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}