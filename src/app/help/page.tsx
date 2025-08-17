'use client';

import { useState } from 'react';
import Footer from '../../components/footer';

// Type definitions
interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Article {
  title: string;
  content: string;
  steps: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

type HelpContent = {
  [key: string]: Article[];
};

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState<string>('getting-started');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: Category[] = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'store-generation', name: 'Store Generation', icon: '🏪' },
    { id: 'themes', name: 'Themes & Design', icon: '🎨' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'api', name: 'API Documentation', icon: '🔧' },
    { id: 'billing', name: 'Billing & Plans', icon: '💳' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' }
  ];

  const helpContent: HelpContent = {
    'getting-started': [
      {
        title: 'Welcome to StoreForge AI',
        content: 'Learn how to get started with our AI-powered e-commerce platform and create your first store in minutes.',
        steps: [
          'Sign up for your StoreForge AI account',
          'Complete your profile setup',
          'Generate your first store using AI',
          'Customize your store design and products',
          'Launch and start selling'
        ]
      },
      {
        title: 'Account Setup',
        content: 'Set up your account properly to get the most out of StoreForge AI.',
        steps: [
          'Verify your email address',
          'Complete your business information',
          'Set up payment methods',
          'Configure notification preferences'
        ]
      }
    ],
    'store-generation': [
      {
        title: 'AI Store Generation',
        content: 'Our AI analyzes your product URL and creates a complete e-commerce store tailored to your needs.',
        steps: [
          'Enter your product URL or description',
          'Select your preferred platform (Shopify, WooCommerce, etc.)',
          'Choose your target audience and market',
          'Let AI generate your store structure',
          'Review and customize the generated content'
        ]
      },
      {
        title: 'Product Import',
        content: 'Import products from various sources and let AI optimize them for better sales.',
        steps: [
          'Paste product URLs from suppliers',
          'Upload product CSV files',
          'Connect to existing inventory systems',
          'AI optimizes titles, descriptions, and pricing',
          'Review and approve imported products'
        ]
      }
    ],
    'themes': [
      {
        title: 'Choosing the Right Theme',
        content: 'Select and customize themes that match your brand and convert visitors into customers.',
        steps: [
          'Browse our theme gallery',
          'Filter by industry and style',
          'Preview themes with your content',
          'Customize colors, fonts, and layout',
          'Apply theme to your store'
        ]
      },
      {
        title: 'Theme Customization',
        content: 'Make your store unique with our advanced customization options.',
        steps: [
          'Access the theme editor',
          'Modify colors and typography',
          'Adjust layout and spacing',
          'Add custom CSS if needed',
          'Preview changes in real-time'
        ]
      }
    ],
    'analytics': [
      {
        title: 'Understanding Your Analytics',
        content: 'Track your store performance and make data-driven decisions to grow your business.',
        steps: [
          'Access your analytics dashboard',
          'Monitor key metrics (traffic, conversions, revenue)',
          'Analyze customer behavior patterns',
          'Track product performance',
          'Generate custom reports'
        ]
      },
      {
        title: 'Setting Up Goals',
        content: 'Define and track important business goals to measure success.',
        steps: [
          'Navigate to Goals section',
          'Define conversion goals',
          'Set up revenue targets',
          'Configure goal tracking',
          'Monitor goal completion rates'
        ]
      }
    ],
    'api': [
      {
        title: 'API Authentication',
        content: 'Learn how to authenticate and make secure API calls to StoreForge AI.',
        steps: [
          'Generate your API key in Settings',
          'Include API key in request headers',
          'Use HTTPS for all API calls',
          'Handle authentication errors properly',
          'Implement rate limiting in your code'
        ]
      },
      {
        title: 'Store Management API',
        content: 'Programmatically manage your stores using our REST API.',
        steps: [
          'List all your stores',
          'Create new stores via API',
          'Update store configurations',
          'Manage products and inventory',
          'Access analytics data'
        ]
      }
    ],
    'billing': [
      {
        title: 'Understanding Plans',
        content: 'Choose the right plan for your business needs and understand billing cycles.',
        steps: [
          'Compare available plans',
          'Understand feature limitations',
          'Review billing cycles',
          'Upgrade or downgrade plans',
          'Manage payment methods'
        ]
      },
      {
        title: 'Payment Issues',
        content: 'Resolve common payment and billing issues quickly.',
        steps: [
          'Check payment method validity',
          'Review failed payment notifications',
          'Update billing information',
          'Contact support for disputes',
          'Download invoices and receipts'
        ]
      }
    ],
    'troubleshooting': [
      {
        title: 'Common Issues',
        content: 'Quick solutions to the most common problems users encounter.',
        steps: [
          'Store generation taking too long',
          'Theme not applying correctly',
          'Products not importing',
          'Analytics not updating',
          'API calls failing'
        ]
      },
      {
        title: 'Performance Optimization',
        content: 'Optimize your store for better performance and user experience.',
        steps: [
          'Optimize image sizes and formats',
          'Enable caching and compression',
          'Minimize third-party scripts',
          'Use CDN for static assets',
          'Monitor Core Web Vitals'
        ]
      }
    ]
  };

  const faqs: FAQ[] = [
    {
      question: 'How long does it take to generate a store?',
      answer: 'Most stores are generated within 2-5 minutes, depending on the complexity and number of products.'
    },
    {
      question: 'Can I use my own domain?',
      answer: 'Yes, you can connect your custom domain to any store created with StoreForge AI.'
    },
    {
      question: 'Is there a limit to the number of products?',
      answer: 'Product limits depend on your plan. Free plans include up to 100 products, while premium plans offer unlimited products.'
    },
    {
      question: 'Can I export my store data?',
      answer: 'Yes, you can export your store data, products, and analytics at any time from your dashboard.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all premium plans. Contact support for refund requests.'
    }
  ];

  const filteredContent = helpContent[activeCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers, guides, and resources to help you succeed with StoreForge AI
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, guides, or FAQs..."
                className="w-full px-6 py-4 pl-12 border border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 sticky top-32">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-purple-500 to-amber-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium text-sm">{category.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Help Articles */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {categories.find(cat => cat.id === activeCategory)?.name}
                </h2>
                
                <div className="space-y-8">
                  {filteredContent.map((article: Article, index: number) => (
                    <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{article.title}</h3>
                      <p className="text-gray-600 mb-4">{article.content}</p>
                      
                      <div className="bg-gray-50/50 rounded-xl p-6">
                        <h4 className="font-medium text-gray-900 mb-3">Step-by-step guide:</h4>
                        <ol className="space-y-2">
                          {article.steps.map((step: string, stepIndex: number) => (
                            <li key={stepIndex} className="flex items-start space-x-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {stepIndex + 1}
                              </span>
                              <span className="text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl cursor-pointer hover:bg-gray-100/50 transition-colors">
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="p-4 pt-2">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Still need help?</h3>
                  <p className="text-gray-600 mb-6">
                    Can't find what you're looking for? Our support team is here to help you succeed.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-amber-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      Contact Support
                    </button>
                    <button className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                      Schedule a Call
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}