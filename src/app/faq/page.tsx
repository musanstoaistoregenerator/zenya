'use client';

import { useState } from 'react';
import Footer from '../../components/footer';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categories = [
    { id: 'general', name: 'General', icon: '❓' },
    { id: 'pricing', name: 'Pricing', icon: '💰' },
    { id: 'technical', name: 'Technical', icon: '🔧' },
    { id: 'stores', name: 'Store Creation', icon: '🏪' },
    { id: 'themes', name: 'Themes', icon: '🎨' }
  ];

  const faqs: FAQItem[] = [
    {
      question: 'What is StoreForge AI?',
      answer: 'StoreForge AI is an advanced AI-powered platform that helps you create professional e-commerce stores in minutes. Simply provide a product URL or description, and our AI will generate a complete store with optimized content, design, and functionality.',
      category: 'general'
    },
    {
      question: 'How does the AI store generation work?',
      answer: 'Our AI analyzes your product information, market trends, and best practices to create a complete store. It generates product descriptions, selects appropriate themes, optimizes for SEO, and sets up payment processing - all automatically.',
      category: 'general'
    },
    {
      question: 'What platforms do you support?',
      answer: 'We support Shopify, WooCommerce, and custom standalone stores. You can choose your preferred platform during the store generation process.',
      category: 'general'
    },
    {
      question: 'How much does StoreForge AI cost?',
      answer: 'We offer flexible pricing plans starting from free for basic features. Our Premium plan at $4.99/month includes unlimited store generation, premium themes, and advanced analytics. Enterprise plans are available for larger businesses.',
      category: 'pricing'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! You can start with our free plan to test the basic features. No credit card required. You can upgrade to premium features anytime.',
      category: 'pricing'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely! You can cancel your subscription at any time from your account settings. Your stores will remain active until the end of your billing period.',
      category: 'pricing'
    },
    {
      question: 'Do I need technical knowledge to use StoreForge AI?',
      answer: 'Not at all! StoreForge AI is designed for everyone. Our AI handles all the technical aspects, so you can focus on your business. No coding or design skills required.',
      category: 'technical'
    },
    {
      question: 'How secure are the stores created?',
      answer: 'Security is our top priority. All stores are created with SSL certificates, secure payment processing, and follow industry best practices for data protection and privacy.',
      category: 'technical'
    },
    {
      question: 'Can I customize my store after it\'s generated?',
      answer: 'Yes! While our AI creates a complete store, you have full control to customize colors, themes, content, and functionality. You can also add or remove products anytime.',
      category: 'technical'
    },
    {
      question: 'How long does it take to generate a store?',
      answer: 'Most stores are generated within 2-5 minutes. Complex stores with many products might take up to 10 minutes. You\'ll receive real-time updates during the generation process.',
      category: 'stores'
    },
    {
      question: 'Can I create multiple stores?',
      answer: 'Yes! Depending on your plan, you can create multiple stores. Free users can create 1 store, Premium users get unlimited stores.',
      category: 'stores'
    },
    {
      question: 'What if I\'m not satisfied with my generated store?',
      answer: 'You can regenerate your store with different parameters, or manually customize it. Our AI learns from your feedback to create better stores over time.',
      category: 'stores'
    },
    {
      question: 'How many themes are available?',
      answer: 'We offer a growing collection of premium themes optimized for different industries. Premium users get access to all themes, while free users can use our default theme.',
      category: 'themes'
    },
    {
      question: 'Can I upload my own theme?',
      answer: 'Currently, we focus on our curated collection of high-converting themes. However, you can extensively customize existing themes to match your brand.',
      category: 'themes'
    },
    {
      question: 'Are themes mobile-responsive?',
      answer: 'Absolutely! All our themes are fully responsive and optimized for mobile devices. Your store will look perfect on phones, tablets, and desktops.',
      category: 'themes'
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQs = faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FAFAF9'}}>
      {/* Hero Section */}
      <div className="py-20 px-6 text-center" style={{backgroundColor: '#FFFFFF'}}>
        <div className="max-w-4xl mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)'}}>
            <span className="text-3xl">❓</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about StoreForge AI and how to get the most out of our platform.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
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

            {/* FAQ Items */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      <div className={`transform transition-transform duration-200 ${
                        openItems.includes(index) ? 'rotate-180' : ''
                      }`}>
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {openItems.includes(index) && (
                      <div className="px-6 pb-6">
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-6" style={{backgroundColor: '#FFFFFF'}}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@storeforge.ai"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              📧 Email Support
            </a>
            <a
              href="/help"
              className="px-8 py-4 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold rounded-xl transition-all duration-300"
            >
              📚 Help Center
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}