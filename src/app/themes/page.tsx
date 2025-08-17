'use client';

import { useState } from 'react';
import Footer from '../../components/footer';


// Base theme that will be repeated
const baseTheme = {
  id: 1,
  name: 'StoreForge Pro',
  category: 'Professional',
  preview: '/api/placeholder/400/300',
  colors: ['#8B5CF6', '#F59E0B', '#FFFFFF'],
  description: 'Premium AI-generated store theme with modern design',
  features: ['AI-Optimized', 'Mobile Responsive', 'Fast Loading', 'Conversion Focused'],
  price: '$4.99'
};

// Create multiple variations of the same theme
const themes = [
  { ...baseTheme, id: 1, name: 'StoreForge Pro', category: 'Professional' },
  { ...baseTheme, id: 2, name: 'StoreForge Pro', category: 'Professional' },
  { ...baseTheme, id: 3, name: 'StoreForge Pro', category: 'Professional' },
  { ...baseTheme, id: 4, name: 'StoreForge Pro', category: 'Professional' },
  { ...baseTheme, id: 5, name: 'StoreForge Pro', category: 'Professional' },
  { ...baseTheme, id: 6, name: 'StoreForge Pro', category: 'Professional' },
  { ...baseTheme, id: 7, name: 'StoreForge Pro', category: 'Professional' },
  { ...baseTheme, id: 8, name: 'StoreForge Pro', category: 'Professional' },
  { ...baseTheme, id: 9, name: 'StoreForge Pro', category: 'Professional' }
];

const categories = ['All', 'Professional'];

export default function ThemesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState<any>(null);

  const filteredThemes = selectedCategory === 'All' 
    ? themes 
    : themes.filter(theme => theme.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 pt-24">
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          

          
          {/* AI Store Generator */}
          <div className="max-w-4xl mx-auto">
            {/* Simple Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-amber-600 rounded-2xl mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent mb-4">
                AI Store Generator
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Create your perfect online store in minutes with AI. Just tell us about your business and we'll handle the rest.
              </p>
            </div>

            {/* Clean Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      placeholder="My Awesome Store"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                      <option>Fashion & Clothing</option>
                      <option>Electronics</option>
                      <option>Home & Garden</option>
                      <option>Beauty & Health</option>
                      <option>Sports & Fitness</option>
                      <option>Books & Media</option>
                      <option>Food & Beverages</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Products
                  </label>
                  <textarea
                    placeholder="Tell us what you're selling and who your customers are..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-amber-600 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate My Store
                </button>
              </form>
            </div>

            {/* Simple Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Ready in Minutes</h3>
                <p className="text-gray-600 text-sm">Your store will be live and ready to sell</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Mobile Optimized</h3>
                <p className="text-gray-600 text-sm">Looks perfect on all devices</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Professional Design</h3>
                <p className="text-gray-600 text-sm">Beautiful themes that convert</p>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-amber-600 rounded-full text-white font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                More premium themes coming soon at the same price
              </div>
            </div>
          </div>


      </div>

      {/* Theme Preview Modal */}
      {selectedTheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedTheme.name}</h3>
                <button
                  onClick={() => setSelectedTheme(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center mb-6">
                <div className="text-gray-500">Full Theme Preview</div>
              </div>
              
              <div className="flex space-x-4">
                <button className="group flex-1 relative bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Use This Theme
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
                <button
                  onClick={() => setSelectedTheme(null)}
                  className="group flex-1 relative border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Close Preview
                  </span>
                  <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}