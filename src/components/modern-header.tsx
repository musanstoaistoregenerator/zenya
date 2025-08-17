'use client'

import Link from 'next/link'

export default function ModernHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Left Header Section */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-white rounded-full border border-gray-200 shadow-sm px-4 py-2">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                StoreForge AI
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/generate"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Generate
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Plans
              </Link>
              <Link
                href="/themes"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Themes
              </Link>
              <Link
                href="/faq"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                FAQ
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Right Header Section */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white rounded-full border border-gray-200 shadow-sm px-4 py-2">
          <div className="flex items-center space-x-3">
            <Link
              href="https://shopify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Link Shopify
            </Link>
            <Link
              href="/pricing"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-amber-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-amber-700 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}