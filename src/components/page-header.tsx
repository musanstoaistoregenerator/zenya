'use client';

interface PageHeaderProps {
  // Content
  title?: string;
  description?: string;
  subtitle?: string;
  children?: React.ReactNode;
  
  // Layout & Styling
  variant?: 'default' | 'minimal' | 'hero' | 'compact' | 'centered';
  background?: 'gradient' | 'solid' | 'transparent' | 'image' | 'custom';
  backgroundImage?: string;
  customBackground?: string;
  textAlign?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  // Navigation
  showNavigation?: boolean;
  showBrand?: boolean;
  brandText?: string;
  brandIcon?: React.ReactNode;
  navigationItems?: Array<{ label: string; href: string; active?: boolean }>;
  
  // Actions
  showBackButton?: boolean;
  backUrl?: string;
  backText?: string;
  primaryAction?: { label: string; href: string; variant?: 'primary' | 'secondary' };
  secondaryAction?: { label: string; href: string; variant?: 'primary' | 'secondary' };
  
  // Customization
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  
  // Content Areas
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  
  // Responsive
  hideOnMobile?: boolean;
  mobileLayout?: 'stack' | 'compact';
}

export default function PageHeader({ 
  // Content
  title,
  description,
  subtitle,
  children,
  
  // Layout & Styling
  variant = 'default',
  background = 'gradient',
  backgroundImage,
  customBackground,
  textAlign = 'center',
  size = 'lg',
  
  // Navigation
  showNavigation = true,
  showBrand = true,
  brandText = "StoreForge AI",
  brandIcon,
  navigationItems = [
    { label: 'Themes', href: '/themes' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Support', href: '/support' }
  ],
  
  // Actions
  showBackButton = true,
  backUrl = "/dashboard",
  backText = "Back to Dashboard",
  primaryAction,
  secondaryAction,
  
  // Customization
  className = "",
  headerClassName = "",
  contentClassName = "",
  titleClassName = "",
  descriptionClassName = "",
  
  // Content Areas
  leftContent,
  rightContent,
  bottomContent,
  
  // Responsive
  hideOnMobile = false
}: PageHeaderProps) {
  
  // Background styles
  const getBackgroundStyle = () => {
    switch (background) {
      case 'gradient':
        return 'bg-gradient-to-br from-purple-50 via-white to-amber-50';
      case 'solid':
        return 'bg-white';
      case 'transparent':
        return 'bg-transparent';
      case 'image':
        return backgroundImage ? `bg-cover bg-center bg-no-repeat` : 'bg-gray-100';
      case 'custom':
        return customBackground || 'bg-gray-50';
      default:
        return 'bg-gradient-to-br from-purple-50 via-white to-amber-50';
    }
  };

  // Size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          title: 'text-2xl sm:text-3xl font-bold',
          description: 'text-base sm:text-lg',
          padding: 'py-4'
        };
      case 'md':
        return {
          title: 'text-3xl sm:text-4xl font-bold',
          description: 'text-lg sm:text-xl',
          padding: 'py-6'
        };
      case 'lg':
        return {
          title: 'text-3xl sm:text-4xl md:text-5xl font-bold',
          description: 'text-lg sm:text-xl',
          padding: 'py-8'
        };
      case 'xl':
        return {
          title: 'text-4xl sm:text-5xl md:text-6xl font-bold',
          description: 'text-xl sm:text-2xl',
          padding: 'py-12'
        };
      default:
        return {
          title: 'text-3xl sm:text-4xl md:text-5xl font-bold',
          description: 'text-lg sm:text-xl',
          padding: 'py-8'
        };
    }
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          showNavigation: false,
          showBackButton: false,
          background: 'transparent',
          size: 'sm'
        };
      case 'hero':
        return {
          size: 'xl',
          textAlign: 'center'
        };
      case 'compact':
        return {
          size: 'sm',
          padding: 'py-4'
        };
      case 'centered':
        return {
          textAlign: 'center'
        };
      default:
        return {};
    }
  };

  const sizeStyles = getSizeStyles();
  const variantOverrides = getVariantStyles();
  const finalShowNavigation = variantOverrides.showNavigation ?? showNavigation;
  const finalShowBackButton = variantOverrides.showBackButton ?? showBackButton;

  const defaultBrandIcon = (
    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  );

  if (hideOnMobile) {
    return (
      <div className="hidden sm:block">
        <PageHeaderContent />
      </div>
    );
  }

  function PageHeaderContent() {
    return (
      <div 
        className={`w-full ${getBackgroundStyle()} ${className}`}
        style={background === 'image' && backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
      >
        {/* Navigation Header */}
        {finalShowNavigation && (
          <div className="w-full">
            <header className={`relative ${headerClassName}`}>
              <div className="w-full px-4 py-3">
                <div className="flex items-center justify-between">
                  {/* Brand */}
                  {showBrand && (
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      {brandIcon || defaultBrandIcon}
                      <h1 className="text-sm sm:text-lg font-semibold text-gray-900">{brandText}</h1>
                    </div>
                  )}

                  {/* Left Content */}
                  {leftContent && (
                    <div className="flex-1 flex justify-start ml-4">
                      {leftContent}
                    </div>
                  )}

                  {/* Navigation Pills - Hidden on mobile */}
                  {navigationItems.length > 0 && (
                    <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
                      {navigationItems.map((item, index) => (
                        <a 
                          key={index}
                          href={item.href} 
                          className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-full ${
                            item.active 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                          }`}
                        >
                          {item.label}
                        </a>
                      ))}
                    </nav>
                  )}

                  {/* Actions */}
                  <div className="flex items-center">
                    {/* Primary/Secondary Actions */}
                    <div className="flex items-center space-x-2 sm:space-x-4 mr-4">
                      {secondaryAction && (
                        <a
                          href={secondaryAction.href}
                          className={`hidden sm:block px-3 py-1.5 text-sm font-medium transition-colors ${
                            secondaryAction.variant === 'primary' 
                              ? 'bg-blue-600 text-white rounded-full hover:bg-blue-700' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {secondaryAction.label}
                        </a>
                      )}
                      {primaryAction && (
                        <a
                          href={primaryAction.href}
                          className={`px-3 sm:px-6 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 shadow-lg hover:shadow-xl ${
                            primaryAction.variant === 'secondary'
                              ? 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                              : 'bg-gray-900 hover:bg-gray-800 text-white'
                          }`}
                        >
                          {primaryAction.label}
                        </a>
                      )}
                    </div>
                    
                    {/* Right Content - Always positioned at the far right */}
                    {rightContent && (
                      <div className="flex items-center">
                        {rightContent}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>
          </div>
        )}

        {/* Page Content Header */}
        <div className={`w-full ${sizeStyles.padding} ${contentClassName}`}>
          <div className={`${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'} mb-8`}>
            {subtitle && (
              <p className="text-sm sm:text-base text-blue-600 font-medium mb-2 uppercase tracking-wide">
                {subtitle}
              </p>
            )}
            {title && (
              <h1 className={`${sizeStyles.title} text-gray-900 mb-4 ${titleClassName}`}>
                {title}
              </h1>
            )}
            {description && (
              <p className={`${sizeStyles.description} text-gray-600 max-w-2xl ${textAlign === 'center' ? 'mx-auto' : ''} px-4 ${descriptionClassName}`}>
                {description}
              </p>
            )}
          </div>

          {/* Back Button */}
          {finalShowBackButton && (
            <div className={`flex ${textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'} mb-8`}>
              <a
                href={backUrl}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {backText}
              </a>
            </div>
          )}

          {/* Additional content */}
          {children}

          {/* Bottom Content */}
          {bottomContent && (
            <div className="mt-8">
              {bottomContent}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <PageHeaderContent />;
}