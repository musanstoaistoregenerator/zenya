'use client';

import { useState } from 'react';

interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  gradient: string;
}

interface ColorThemeSelectorProps {
  onThemeSelect: (theme: ColorTheme) => void;
  onSkip: () => void;
}

export default function ColorThemeSelector({ onThemeSelect, onSkip }: ColorThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const colorThemes: ColorTheme[] = [
    {
      id: 'ocean-blue',
      name: 'Ocean Blue',
      primary: '#1e40af',
      secondary: '#0f172a',
      gradient: 'from-blue-600 to-slate-900'
    },
    {
      id: 'forest-green',
      name: 'Forest Green',
      primary: '#059669',
      secondary: '#1f2937',
      gradient: 'from-emerald-600 to-gray-800'
    },
    {
      id: 'sunset-orange',
      name: 'Sunset Orange',
      primary: '#ea580c',
      secondary: '#7c2d12',
      gradient: 'from-orange-600 to-orange-900'
    },
    {
      id: 'royal-purple',
      name: 'Royal Purple',
      primary: '#7c3aed',
      secondary: '#1e1b4b',
      gradient: 'from-violet-600 to-indigo-900'
    },
    {
      id: 'rose-gold',
      name: 'Rose Gold',
      primary: '#e11d48',
      secondary: '#fbbf24',
      gradient: 'from-rose-600 to-amber-400'
    },
    {
      id: 'midnight-teal',
      name: 'Midnight Teal',
      primary: '#0d9488',
      secondary: '#0f172a',
      gradient: 'from-teal-600 to-slate-900'
    },
    {
      id: 'crimson-red',
      name: 'Crimson Red',
      primary: '#dc2626',
      secondary: '#450a0a',
      gradient: 'from-red-600 to-red-900'
    },
    {
      id: 'golden-yellow',
      name: 'Golden Yellow',
      primary: '#d97706',
      secondary: '#78350f',
      gradient: 'from-amber-600 to-amber-900'
    },
    {
      id: 'electric-cyan',
      name: 'Electric Cyan',
      primary: '#0891b2',
      secondary: '#164e63',
      gradient: 'from-cyan-600 to-cyan-900'
    },
    {
      id: 'lavender-pink',
      name: 'Lavender Pink',
      primary: '#c026d3',
      secondary: '#701a75',
      gradient: 'from-fuchsia-600 to-fuchsia-900'
    }
  ];

  const handleThemeClick = (theme: ColorTheme) => {
    setSelectedTheme(theme.id);
    setShowPreview(true);
  };

  const handleApplyTheme = () => {
    const theme = colorThemes.find(t => t.id === selectedTheme);
    if (theme) {
      onThemeSelect(theme);
    }
  };

  const handleBackToSelection = () => {
    setShowPreview(false);
    setSelectedTheme(null);
  };

  const selectedThemeData = colorThemes.find(t => t.id === selectedTheme);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {!showPreview ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  🎨 Choose Your Store Theme
                </h2>
                <p className="text-gray-600">
                  Select a color combination that matches your brand personality
                </p>
              </div>

              {/* Color Theme Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {colorThemes.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => handleThemeClick(theme)}
                    className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      selectedTheme === theme.id
                        ? 'border-blue-500 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Color Preview */}
                    <div
                      className="w-full h-20 rounded-lg mb-3 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
                      }}
                    >
                      {/* Color Circles */}
                      <div className="absolute top-2 left-2 flex space-x-1">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.primary }}
                        ></div>
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.secondary }}
                        ></div>
                      </div>
                      
                      {/* Selection Indicator */}
                      {selectedTheme === theme.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <span className="text-green-500 text-lg">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Theme Name */}
                    <h3 className="text-sm font-semibold text-gray-800 text-center">
                      {theme.name}
                    </h3>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={onSkip}
                  className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Skip for Now
                </button>
              </div>
            </>
          ) : (
            /* Preview Mode */
            selectedThemeData && (
              <>
                {/* Preview Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    🎨 Theme Preview
                  </h2>
                  <p className="text-gray-600">
                    See how <span className="font-semibold">{selectedThemeData.name}</span> will look on your store
                  </p>
                </div>

                {/* Theme Preview */}
                <div className="mb-8">
                  {/* Large Color Preview */}
                  <div
                    className="w-full h-32 rounded-xl mb-6 relative overflow-hidden shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${selectedThemeData.primary} 0%, ${selectedThemeData.secondary} 100%)`
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-2xl font-bold drop-shadow-lg">
                        {selectedThemeData.name}
                      </div>
                    </div>
                  </div>

                  {/* Color Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div
                        className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-white shadow-lg"
                        style={{ backgroundColor: selectedThemeData.primary }}
                      ></div>
                      <p className="text-sm font-semibold text-gray-700">Primary Color</p>
                      <p className="text-xs text-gray-500">{selectedThemeData.primary}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div
                        className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-white shadow-lg"
                        style={{ backgroundColor: selectedThemeData.secondary }}
                      ></div>
                      <p className="text-sm font-semibold text-gray-700">Secondary Color</p>
                      <p className="text-xs text-gray-500">{selectedThemeData.secondary}</p>
                    </div>
                  </div>

                  {/* Store Preview Mockup */}
                  <div className="bg-gray-100 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                      How it will look on your store:
                    </h3>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      {/* Mock Header */}
                      <div
                        className="h-12 rounded-lg mb-4 flex items-center px-4"
                        style={{ backgroundColor: selectedThemeData.primary }}
                      >
                        <div className="text-white font-semibold">Your Store Name</div>
                      </div>
                      {/* Mock Buttons */}
                      <div className="flex space-x-2 mb-4">
                        <div
                          className="px-4 py-2 rounded text-white text-sm"
                          style={{ backgroundColor: selectedThemeData.primary }}
                        >
                          Shop Now
                        </div>
                        <div
                          className="px-4 py-2 rounded text-white text-sm"
                          style={{ backgroundColor: selectedThemeData.secondary }}
                        >
                          Learn More
                        </div>
                      </div>
                      {/* Mock Content */}
                      <div className="text-gray-600 text-sm">
                        This is how your store elements will be styled with the selected theme colors.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleBackToSelection}
                    className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← Back to Themes
                  </button>
                  <button
                    onClick={handleApplyTheme}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-amber-600 text-white rounded-lg hover:from-purple-700 hover:to-amber-700 transition-all duration-300 font-semibold shadow-lg"
                  >
                    Apply This Theme ✨
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}