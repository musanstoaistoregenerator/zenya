'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Footer from '../components/footer';

// Success Stories Component with Load More functionality
function SuccessStoriesGrid() {
  const [showAll, setShowAll] = useState(false);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, (entry.target as HTMLElement).dataset.index]));
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => {
      const observer = observerRef.current;
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('[data-animate="true"]');
    elements.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      const observer = observerRef.current;
      if (observer) {
        elements.forEach((el) => {
          observer.unobserve(el);
        });
      }
    };
  }, [showAll]);
  
  const allStories = [
    { name: 'Sarah Chen', business: 'Eco Beauty Co.', result: '$50K in first month', quote: 'StoreForge made my dream store a reality in just 5 minutes!' },
    { name: 'Mike Rodriguez', business: 'Tech Gadgets Pro', result: '10K+ customers', quote: 'The AI understood exactly what I wanted. Incredible!' },
    { name: 'Emma Thompson', business: 'Artisan Crafts', result: '300% growth', quote: 'From idea to profitable store in one afternoon.' },
    { name: 'David Kim', business: 'Fitness Gear Hub', result: '$75K revenue', quote: 'Built my entire fitness store while having my morning coffee!' },
    { name: 'Lisa Wang', business: 'Pet Paradise', result: '5K orders', quote: 'The AI created exactly what I envisioned for my pet store.' },
    { name: 'Carlos Martinez', business: 'Home Decor Plus', result: '400% ROI', quote: 'From zero to profitable in just one week!' },
    { name: 'Jennifer Lee', business: 'Fashion Forward', result: '$100K milestone', quote: 'StoreForge turned my fashion dreams into reality.' },
    { name: 'Ahmed Hassan', business: 'Tech Solutions', result: '15K customers', quote: 'The fastest way to launch a professional store.' },
    { name: 'Maria Garcia', business: 'Organic Foods', result: '$60K sales', quote: 'My organic food store was live in minutes!' },
    { name: 'James Wilson', business: 'Sports Central', result: '8K orders', quote: 'Perfect for my sports equipment business.' },
    { name: 'Anna Kowalski', business: 'Jewelry Boutique', result: '$45K revenue', quote: 'Beautiful jewelry store created effortlessly.' },
    { name: 'Ryan O\'Connor', business: 'Book Haven', result: '12K books sold', quote: 'My bookstore dream came true instantly.' },
    { name: 'Priya Patel', business: 'Spice World', result: '$35K sales', quote: 'Authentic spice store built with AI magic.' },
    { name: 'Tom Anderson', business: 'Gadget Galaxy', result: '20K customers', quote: 'Tech store setup was incredibly smooth.' },
    { name: 'Sophie Dubois', business: 'French Pastries', result: '$55K revenue', quote: 'My pastry shop online in record time.' },
    { name: 'Raj Sharma', business: 'Yoga Essentials', result: '7K orders', quote: 'Peaceful yoga store, perfectly designed.' },
    { name: 'Elena Rossi', business: 'Italian Delights', result: '$40K sales', quote: 'Authentic Italian food store made easy.' },
    { name: 'Kevin Chang', business: 'Gaming Zone', result: '25K gamers', quote: 'Ultimate gaming store built instantly.' },
    { name: 'Isabella Santos', business: 'Baby Bliss', result: '$65K revenue', quote: 'Perfect baby store for new parents.' },
    { name: 'Marcus Johnson', business: 'Car Accessories', result: '18K customers', quote: 'Auto parts store running smoothly.' },
    { name: 'Yuki Tanaka', business: 'Zen Garden', result: '$30K sales', quote: 'Minimalist garden store, beautifully crafted.' },
    { name: 'Oliver Schmidt', business: 'Beer Craft', result: '9K orders', quote: 'Craft beer store with perfect design.' },
    { name: 'Fatima Al-Zahra', business: 'Modest Fashion', result: '$70K revenue', quote: 'Elegant modest fashion store created perfectly.' },
    { name: 'Lucas Silva', business: 'Surf Shop', result: '11K surfers', quote: 'Radical surf shop, totally awesome!' },
    { name: 'Chloe Martin', business: 'Vintage Finds', result: '$48K sales', quote: 'Vintage store with authentic charm.' },
    { name: 'Hassan Ali', business: 'Middle Eastern Cuisine', result: '6K orders', quote: 'Delicious food store, perfectly presented.' },
    { name: 'Grace Kim', business: 'K-Beauty Store', result: '$85K revenue', quote: 'Korean beauty store, flawlessly designed.' },
    { name: 'Pablo Rodriguez', business: 'Latin Music', result: '14K customers', quote: 'Music store with perfect Latin vibes.' },
    { name: 'Aisha Okonkwo', business: 'African Textiles', result: '$52K sales', quote: 'Beautiful African textile store online.' },
    { name: 'Erik Larsson', business: 'Nordic Design', result: '13K orders', quote: 'Scandinavian design store, minimally perfect.' },
    { name: 'Valentina Popov', business: 'Russian Crafts', result: '$38K revenue', quote: 'Traditional crafts store, beautifully made.' },
    { name: 'Diego Fernandez', business: 'Coffee Roasters', result: '16K coffee lovers', quote: 'Coffee shop online, perfectly brewed.' },
    { name: 'Mei Lin', business: 'Tea Ceremony', result: '$42K sales', quote: 'Traditional tea store, elegantly designed.' },
    { name: 'Noah Williams', business: 'Outdoor Gear', result: '19K adventurers', quote: 'Adventure gear store, ready for anything.' },
    { name: 'Zara Ahmed', business: 'Hijab Collection', result: '$58K revenue', quote: 'Modest hijab store, beautifully crafted.' },
    { name: 'Luca Bianchi', business: 'Italian Leather', result: '8K customers', quote: 'Luxury leather goods, perfectly presented.' },
    { name: 'Sakura Yamamoto', business: 'Japanese Ceramics', result: '$33K sales', quote: 'Traditional ceramics store, artistically done.' },
    { name: 'Finn O\'Brien', business: 'Irish Wool', result: '7K orders', quote: 'Cozy wool products, warmly designed.' },
    { name: 'Camila Restrepo', business: 'Colombian Coffee', result: '$67K revenue', quote: 'Premium coffee store, perfectly roasted.' },
    { name: 'Kwame Asante', business: 'African Art', result: '12K art lovers', quote: 'Vibrant art store, culturally rich.' },
    { name: 'Ingrid Hansen', business: 'Danish Furniture', result: '$78K sales', quote: 'Modern furniture store, stylishly simple.' },
    { name: 'Dmitri Volkov', business: 'Russian Vodka', result: '9K connoisseurs', quote: 'Premium vodka store, authentically Russian.' },
    { name: 'Carmen Lopez', business: 'Spanish Flamenco', result: '$44K revenue', quote: 'Flamenco accessories, passionately designed.' },
    { name: 'Hiroshi Sato', business: 'Sushi Supplies', result: '15K chefs', quote: 'Professional sushi tools, expertly curated.' },
    { name: 'Bridget Murphy', business: 'Celtic Jewelry', result: '$51K sales', quote: 'Celtic designs, magically beautiful.' },
    { name: 'Antonio Silva', business: 'Portuguese Tiles', result: '10K decorators', quote: 'Traditional tiles, artistically perfect.' },
    { name: 'Nadia Petrov', business: 'Bulgarian Roses', result: '$36K revenue', quote: 'Rose products, naturally beautiful.' },
    { name: 'Gustav Andersson', business: 'Swedish Glass', result: '11K collectors', quote: 'Crystal clear glass art, perfectly crafted.' },
    { name: 'Francesca Romano', business: 'Italian Wines', result: '$89K sales', quote: 'Fine wines, elegantly presented.' },
    { name: 'Tariq Hassan', business: 'Moroccan Spices', result: '13K cooks', quote: 'Exotic spices, authentically sourced.' }
  ];
  
  const displayedStories = showAll ? allStories : allStories.slice(0, 6);
  
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedStories.map((story, index) => (
          <div 
            key={index} 
            data-animate="true"
            data-index={index}
            className={`p-8 rounded-3xl shadow-lg border transition-all duration-700 transform ${
              visibleItems.has(index.toString()) 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`} 
            style={{backgroundColor: '#FFFFFF', borderColor: 'rgba(139, 92, 246, 0.1)'}}
          >
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{backgroundColor: '#8B5CF6'}}>👤</div>
              <h3 className="text-xl font-bold" style={{color: '#1F2937'}}>{story.name}</h3>
              <p style={{color: '#6B7280'}}>{story.business}</p>
            </div>
            <div className="mb-6">
              <div className="text-2xl font-black" style={{color: '#10B981'}}>{story.result}</div>
            </div>
            <p className="italic" style={{color: 'rgba(31, 41, 55, 0.85)'}}>"{story.quote}"</p>
          </div>
        ))}
      </div>
      
      {!showAll && (
        <div className="text-center mt-12 relative">
          {/* Fade background effect */}
          <div className="absolute inset-0 -top-20 -bottom-20 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent rounded-3xl blur-xl opacity-60"></div>
          <div className="relative z-10">
            <button 
               onClick={() => setShowAll(true)}
               className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg relative overflow-hidden"
               style={{
                 background: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)',
                 color: '#FFFFFF'
               }}
             >
               {/* Button glow effect */}
               <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-amber-400/20 rounded-2xl blur-md"></div>
               <span className="relative z-10">Load More</span>
             </button>
          </div>
        </div>
      )}
      
      {showAll && (
        <div className="text-center mt-12">
          <button 
            onClick={() => setShowAll(false)}
            className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg border-2"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#8B5CF6',
              borderColor: '#8B5CF6'
            }}
          >
            Show Less Stories
          </button>
        </div>
      )}
    </>
  );
}

// Animation Hook
function useScrollAnimation() {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, (entry.target as HTMLElement).dataset.section]));
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observerRef.current = observer;

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return visibleSections;
}

export default function Home() {
  const visibleSections = useScrollAnimation();
  
  return (
    <div className="min-h-screen" style={{backgroundColor: '#FAFAF9'}}>
      <div className="w-full">
        {/* Hero Section */}
        <div 
          className={`py-24 px-6 relative overflow-hidden transition-all duration-1000 transform ${
            visibleSections.has('hero') ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
          style={{backgroundColor: '#FFFFFF'}}
          data-section="hero"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, #8B5CF6 2px, transparent 2px), radial-gradient(circle at 75% 75%, #F59E0B 2px, transparent 2px)', backgroundSize: '60px 60px'}}></div>
          </div>
          
          {/* Clean Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-24 h-24 rounded-full opacity-10 animate-pulse" style={{background: 'linear-gradient(45deg, #8B5CF6, #A78BFA)'}}></div>
            <div className="absolute bottom-32 right-32 w-20 h-20 rounded-full opacity-15 animate-pulse" style={{background: 'linear-gradient(45deg, #F59E0B, #FCD34D)', animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-12 animate-pulse" style={{background: 'linear-gradient(45deg, #10B981, #34D399)', animationDelay: '1s'}}></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Content */}
              <div className="text-left">
                <div className={`inline-flex items-center px-6 py-3 rounded-full mb-8 backdrop-blur-sm transition-all duration-1000 delay-200 transform ${
                  visibleSections.has('hero') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`} style={{backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
                  <span className="w-3 h-3 rounded-full mr-3 animate-pulse" style={{backgroundColor: '#10B981'}}></span>
                  <span className="font-semibold text-sm tracking-wide" style={{color: '#1F2937'}}>AI-POWERED E-COMMERCE</span>
                </div>
                
                <h1 className={`text-6xl md:text-7xl font-black mb-8 leading-tight transition-all duration-1000 delay-400 transform ${
                  visibleSections.has('hero') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`} style={{color: '#1F2937'}}>
                  Build Your
                  <span className="block bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                    Perfect Store
                  </span>
                  <span className="block text-4xl md:text-5xl font-normal mt-4" style={{color: '#6B7280'}}>
                    in Minutes
                  </span>
                </h1>
                
                <p className={`text-xl md:text-2xl mb-12 leading-relaxed transition-all duration-1000 delay-600 transform ${
                  visibleSections.has('hero') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`} style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                  Revolutionary AI technology that creates stunning, 
                  <span className="font-semibold" style={{color: '#8B5CF6'}}> conversion-ready stores </span>
                  tailored to your vision.
                </p>

                <div className={`flex flex-col sm:flex-row gap-6 mb-16 transition-all duration-1000 delay-800 transform ${
                  visibleSections.has('hero') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  <Link 
                    href="/generate"
                    className="group relative px-12 py-6 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-white"
                    style={{backgroundColor: '#8B5CF6'}}
                  >
                    <span className="relative z-10">🚀 Start Building</span>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{backgroundColor: '#A78BFA'}}></div>
                  </Link>
                  
                  <Link 
                    href="/demo"
                    className="px-12 py-6 rounded-xl font-bold text-xl border-2 transition-all duration-300 transform hover:scale-105"
                    style={{borderColor: '#8B5CF6', color: '#8B5CF6', backgroundColor: 'transparent'}}
                  >
                    🎬 Watch Demo
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className={`grid grid-cols-3 gap-8 transition-all duration-1000 delay-1000 transform ${
                  visibleSections.has('hero') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  <div className="text-center">
                    <div className="text-3xl font-black mb-2" style={{color: '#1F2937'}}>2min</div>
                    <div className="text-sm" style={{color: '#6B7280'}}>Average Setup</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black mb-2" style={{color: '#1F2937'}}>100+</div>
                    <div className="text-sm" style={{color: '#6B7280'}}>Templates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black mb-2" style={{color: '#1F2937'}}>24/7</div>
                    <div className="text-sm" style={{color: '#6B7280'}}>Support</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="relative">
                <div className="relative p-8 rounded-3xl shadow-2xl" style={{backgroundColor: '#FFFFFF'}}>
                  <div className="aspect-video rounded-2xl flex items-center justify-center" style={{backgroundColor: '#FAFAF9'}}>
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl" style={{backgroundColor: '#8B5CF6'}}>
                        🏪
                      </div>
                      <h3 className="text-2xl font-bold mb-4" style={{color: '#1F2937'}}>Your Store Preview</h3>
                      <p style={{color: '#6B7280'}}>See your vision come to life</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div 
          className={`py-24 px-6 transition-all duration-1000 transform ${
            visibleSections.has('pricing') ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
          style={{backgroundColor: '#FAFAF9'}}
          data-section="pricing"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className={`inline-flex items-center px-6 py-3 rounded-full mb-8 transition-all duration-1000 delay-200 transform ${
                visibleSections.has('pricing') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
                <span className="w-3 h-3 rounded-full mr-3 animate-pulse" style={{backgroundColor: '#F59E0B'}}></span>
                <span className="font-semibold text-sm tracking-wide" style={{color: '#1F2937'}}>SIMPLE PRICING</span>
              </div>
              
              <h2 className={`text-5xl md:text-6xl font-black mb-8 transition-all duration-1000 delay-400 transform ${
                visibleSections.has('pricing') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{color: '#1F2937'}}>
                one time pay for
                <span className="block bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                  $4.99
                </span>
              </h2>
            </div>

            {/* Single Payment Card */}
            <div className="relative">
              <div className="p-12 rounded-3xl shadow-xl border" style={{backgroundColor: '#FFFFFF', borderColor: 'rgba(139, 92, 246, 0.2)'}}>
                <div className="text-center mb-8">
                  <div className="text-6xl font-black mb-4" style={{color: '#8B5CF6'}}>$4.99</div>
                  <div className="text-xl" style={{color: '#6B7280'}}>One-time payment • Lifetime access</div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{backgroundColor: '#10B981'}}>✓</span>
                      <span style={{color: '#1F2937'}}>AI Store Generation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{backgroundColor: '#10B981'}}>✓</span>
                      <span style={{color: '#1F2937'}}>100+ Premium Templates</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{backgroundColor: '#10B981'}}>✓</span>
                      <span style={{color: '#1F2937'}}>Mobile Optimization</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{backgroundColor: '#10B981'}}>✓</span>
                      <span style={{color: '#1F2937'}}>Payment Integration</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{backgroundColor: '#10B981'}}>✓</span>
                      <span style={{color: '#1F2937'}}>SEO Optimization</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{backgroundColor: '#10B981'}}>✓</span>
                      <span style={{color: '#1F2937'}}>24/7 Support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{backgroundColor: '#10B981'}}>✓</span>
                      <span style={{color: '#1F2937'}}>Unlimited Updates</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{backgroundColor: '#10B981'}}>✓</span>
                      <span style={{color: '#1F2937'}}>30-Day Money Back</span>
                    </div>
                  </div>
                </div>

                <div className={`text-center transition-all duration-1000 delay-800 transform ${
                  visibleSections.has('pricing') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  <Link 
                    href="/generate"
                    className="inline-block px-16 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg text-white"
                    style={{backgroundColor: '#8B5CF6'}}
                  >
                    Get Instant Access Now
                  </Link>
                  <p className="mt-6 text-sm" style={{color: '#6B7280'}}>🔒 Secure payment • No monthly fees • Cancel anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories Section */}
        <div 
          className={`py-24 px-6 transition-all duration-1000 transform ${
            visibleSections.has('success-stories') ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
          style={{backgroundColor: '#FFFFFF'}}
          data-section="success-stories"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className={`inline-flex items-center px-6 py-3 rounded-full mb-8 transition-all duration-1000 delay-200 transform ${
                visibleSections.has('success-stories') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
                <span className="w-3 h-3 rounded-full mr-3 animate-pulse" style={{backgroundColor: '#10B981'}}></span>
                <span className="font-semibold text-sm tracking-wide" style={{color: '#1F2937'}}>SUCCESS STORIES</span>
              </div>
              
              <h2 className={`text-5xl md:text-6xl font-black mb-8 transition-all duration-1000 delay-400 transform ${
                visibleSections.has('success-stories') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{color: '#1F2937'}}>
                Success Stories
                <span className="block bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                  That Inspire
                </span>
              </h2>
              
              <p className={`text-xl leading-relaxed transition-all duration-1000 delay-600 transform ${
                visibleSections.has('success-stories') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                See how entrepreneurs are building successful businesses with our platform
              </p>
            </div>

            <SuccessStoriesGrid />
          </div>
        </div>

        {/* Features Section */}
        <div 
          className={`py-24 px-6 transition-all duration-1000 transform ${
            visibleSections.has('features') ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
          style={{backgroundColor: '#FAFAF9'}}
          data-section="features"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className={`inline-flex items-center px-6 py-3 rounded-full mb-8 transition-all duration-1000 delay-200 transform ${
                visibleSections.has('features') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
                <span className="w-3 h-3 rounded-full mr-3 animate-pulse" style={{backgroundColor: '#F59E0B'}}></span>
                <span className="font-semibold text-sm tracking-wide" style={{color: '#1F2937'}}>POWERFUL FEATURES</span>
              </div>
              
              <h2 className={`text-5xl md:text-6xl font-black mb-8 transition-all duration-1000 delay-400 transform ${
                visibleSections.has('features') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{color: '#1F2937'}}>
                Everything You Need
                <span className="block bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                  Built Right In
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '🤖',
                  title: 'AI Store Builder',
                  description: 'Advanced AI creates your entire store from a simple description'
                },
                {
                  icon: '🎨',
                  title: 'Smart Design System',
                  description: 'Beautiful, conversion-optimized designs that adapt to your brand'
                },
                {
                  icon: '📱',
                  title: 'Mobile First',
                  description: 'Every store is perfectly optimized for mobile devices'
                },
                {
                  icon: '💳',
                  title: 'Payment Ready',
                  description: 'Stripe, PayPal, and Square integrations work out of the box'
                },
                {
                  icon: '🚀',
                  title: 'Lightning Fast',
                  description: 'Optimized for speed with 99.9% uptime guarantee'
                },
                {
                  icon: '📊',
                  title: 'Analytics Dashboard',
                  description: 'Track sales, visitors, and performance in real-time'
                }
              ].map((feature, index) => (
                <div key={index} className="p-8 rounded-3xl shadow-lg" style={{backgroundColor: '#FFFFFF'}}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6" style={{backgroundColor: 'rgba(139, 92, 246, 0.1)'}}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4" style={{color: '#1F2937'}}>{feature.title}</h3>
                  <p style={{color: 'rgba(31, 41, 55, 0.85)'}}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div 
          className={`py-24 px-6 transition-all duration-1000 transform ${
            visibleSections.has('how-it-works') ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
          style={{backgroundColor: '#FFFFFF'}}
          data-section="how-it-works"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className={`inline-flex items-center px-6 py-3 rounded-full mb-8 transition-all duration-1000 delay-200 transform ${
                visibleSections.has('how-it-works') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
                <span className="w-3 h-3 rounded-full mr-3 animate-pulse" style={{backgroundColor: '#10B981'}}></span>
                <span className="font-semibold text-sm tracking-wide" style={{color: '#1F2937'}}>HOW IT WORKS</span>
              </div>
              
              <h2 className={`text-5xl md:text-6xl font-black mb-8 transition-all duration-1000 delay-400 transform ${
                visibleSections.has('how-it-works') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{color: '#1F2937'}}>
                From Idea to Store
                <span className="block bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                  in 3 Simple Steps
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  step: '01',
                  title: 'Describe Your Vision',
                  description: 'Tell our AI what kind of store you want to build. Be as detailed or as simple as you like.',
                  icon: '💭'
                },
                {
                  step: '02',
                  title: 'AI Creates Your Store',
                  description: 'Our advanced AI generates your complete store with products, design, and content in minutes.',
                  icon: '⚡'
                },
                {
                  step: '03',
                  title: 'Launch & Start Selling',
                  description: 'Customize, connect payments, and go live. Your store is ready to accept orders immediately.',
                  icon: '🚀'
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl" style={{backgroundColor: '#8B5CF6'}}>
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white" style={{backgroundColor: '#F59E0B'}}>
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{color: '#1F2937'}}>{step.title}</h3>
                  <p className="text-lg" style={{color: 'rgba(31, 41, 55, 0.85)'}}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div 
          className={`py-24 px-6 transition-all duration-1000 transform ${
            visibleSections.has('comparison') ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
          style={{backgroundColor: '#FAFAF9'}}
          data-section="comparison"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className={`inline-flex items-center px-6 py-3 rounded-full mb-8 transition-all duration-1000 delay-200 transform ${
                visibleSections.has('comparison') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
                <span className="w-3 h-3 rounded-full mr-3 animate-pulse" style={{backgroundColor: '#F59E0B'}}></span>
                <span className="font-semibold text-sm tracking-wide" style={{color: '#1F2937'}}>COMPARISON</span>
              </div>
              
              <h2 className={`text-5xl md:text-6xl font-black mb-8 transition-all duration-1000 delay-400 transform ${
                visibleSections.has('comparison') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{color: '#1F2937'}}>
                Why Choose
                <span className="block bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                  StoreForge AI?
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl" style={{backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '2px solid rgba(239, 68, 68, 0.2)'}}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-4" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)'}}>
                    😤
                  </div>
                  <h3 className="text-xl font-bold" style={{color: '#1F2937'}}>Traditional Builders</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#EF4444', color: '#FFFFFF'}}>✗</span>
                    Weeks to build
                  </li>
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#EF4444', color: '#FFFFFF'}}>✗</span>
                    Expensive monthly fees
                  </li>
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#EF4444', color: '#FFFFFF'}}>✗</span>
                    Complex setup
                  </li>
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#EF4444', color: '#FFFFFF'}}>✗</span>
                    Limited customization
                  </li>
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#EF4444', color: '#FFFFFF'}}>✗</span>
                    No AI assistance
                  </li>
                </ul>
              </div>

              <div className="p-8 rounded-3xl" style={{backgroundColor: 'rgba(139, 92, 246, 0.05)', border: '2px solid #8B5CF6'}}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-4" style={{backgroundColor: '#8B5CF6'}}>
                    🚀
                  </div>
                  <h3 className="text-xl font-bold" style={{color: '#1F2937'}}>StoreForge AI</h3>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mt-2" style={{backgroundColor: '#10B981', color: '#FFFFFF'}}>BEST CHOICE</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#10B981', color: '#FFFFFF'}}>✓</span>
                    2 minutes to build
                  </li>
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#10B981', color: '#FFFFFF'}}>✓</span>
                    One-time $4.99 payment
                  </li>
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#10B981', color: '#FFFFFF'}}>✓</span>
                    AI-powered simplicity
                  </li>
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#10B981', color: '#FFFFFF'}}>✓</span>
                    Unlimited customization
                  </li>
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#10B981', color: '#FFFFFF'}}>✓</span>
                    Advanced AI features
                  </li>
                </ul>
              </div>

              <div className="p-8 rounded-3xl" style={{backgroundColor: 'rgba(107, 114, 128, 0.05)', border: '2px solid rgba(107, 114, 128, 0.2)'}}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-4" style={{backgroundColor: 'rgba(107, 114, 128, 0.1)'}}>
                    😐
                  </div>
                  <h3 className="text-xl font-bold" style={{color: '#1F2937'}}>Hiring Developers</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#EF4444', color: '#FFFFFF'}}>✗</span>
                    Months to complete
                  </li>
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#EF4444', color: '#FFFFFF'}}>✗</span>
                    $10,000+ investment
                  </li>
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#EF4444', color: '#FFFFFF'}}>✗</span>
                    Communication barriers
                  </li>
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#EF4444', color: '#FFFFFF'}}>✗</span>
                    Ongoing maintenance
                  </li>
                  <li className="flex items-center" style={{color: 'rgba(31, 41, 55, 0.85)'}}>
                    <span className="w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs" style={{backgroundColor: '#EF4444', color: '#FFFFFF'}}>✗</span>
                    Technical complexity
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div 
          className={`py-24 px-6 transition-all duration-1000 transform ${
            visibleSections.has('faq') ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
          style={{backgroundColor: '#FAFAF9'}}
          data-section="faq"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className={`inline-flex items-center px-6 py-3 rounded-full mb-8 transition-all duration-1000 delay-200 transform ${
                visibleSections.has('faq') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
                <span className="w-3 h-3 rounded-full mr-3 animate-pulse" style={{backgroundColor: '#F59E0B'}}></span>
                <span className="font-semibold text-sm tracking-wide" style={{color: '#1F2937'}}>QUICK ANSWERS</span>
              </div>
              
              <h2 className={`text-5xl md:text-6xl font-black mb-8 transition-all duration-1000 delay-400 transform ${
                visibleSections.has('faq') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{color: '#1F2937'}}>
                Quick Answers
                <span className="block bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                  Hub
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  question: 'How fast is setup?',
                  answer: 'Most stores are ready in 3-5 minutes. Complex customizations take 10-15 minutes max.'
                },
                {
                  question: 'Do I need technical skills?',
                  answer: 'Zero coding required. If you can browse the web, you can build a store.'
                },
                {
                  question: 'Can I customize everything?',
                  answer: 'Absolutely! Colors, layouts, content, branding - everything is customizable.'
                },
                {
                  question: 'What about payments?',
                  answer: 'Stripe, PayPal, and Square are integrated. Customers pay, you get paid.'
                },
                {
                  question: 'Is it mobile-friendly?',
                  answer: 'Every store is automatically optimized for mobile devices.'
                },
                {
                  question: 'What if I need help?',
                  answer: '24/7 chat support, community access, and weekly feature updates.'
                }
              ].map((faq, index) => (
                <div key={index} className="p-8 rounded-3xl shadow-lg" style={{backgroundColor: '#FFFFFF'}}>
                  <h3 className="text-xl font-bold mb-4" style={{color: '#1F2937'}}>{faq.question}</h3>
                  <p style={{color: 'rgba(31, 41, 55, 0.85)'}}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div 
          className={`py-24 px-6 transition-all duration-1000 transform ${
            visibleSections.has('final-cta') ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
          style={{backgroundColor: '#FFFFFF'}}
          data-section="final-cta"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-flex items-center px-6 py-3 rounded-full mb-8 transition-all duration-1000 delay-200 transform ${
              visibleSections.has('final-cta') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
              <span className="w-3 h-3 rounded-full mr-3 animate-pulse" style={{backgroundColor: '#10B981'}}></span>
              <span className="font-semibold text-sm tracking-wide" style={{color: '#1F2937'}}>READY TO START</span>
            </div>
            
            <h2 className={`text-5xl md:text-6xl font-black mb-8 transition-all duration-1000 delay-400 transform ${
              visibleSections.has('final-cta') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{color: '#1F2937'}}>
              Start Building
              <span className="block bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                Today
              </span>
            </h2>
            
            <p className={`text-2xl mb-12 leading-relaxed transition-all duration-1000 delay-600 transform ${
              visibleSections.has('final-cta') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{color: 'rgba(31, 41, 55, 0.85)'}}>
              Stop planning. Stop researching. Stop waiting.
              <span className="block mt-4 font-bold" style={{color: '#8B5CF6'}}>
                Your perfect store is just minutes away.
              </span>
            </p>

            <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-12 transition-all duration-1000 delay-800 transform ${
              visibleSections.has('final-cta') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <Link 
                href="/generate"
                className="px-16 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg text-white"
                style={{backgroundColor: '#8B5CF6'}}
              >
                🚀 Launch My Store
              </Link>
              
              <Link 
                href="/demo"
                className="px-16 py-6 rounded-2xl font-bold text-2xl border-2 transition-all duration-300 transform hover:scale-105"
                style={{borderColor: '#8B5CF6', color: '#8B5CF6', backgroundColor: 'transparent'}}
              >
                🎬 See Demo First
              </Link>
            </div>

            <div className="p-8 rounded-3xl" style={{backgroundColor: '#FAFAF9'}}>
              <p className="text-xl font-bold" style={{color: '#1F2937'}}>
                Join thousands of entrepreneurs who chose to 
                <span style={{color: '#8B5CF6'}}> start today.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
