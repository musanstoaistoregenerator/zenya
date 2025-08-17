// Example usage of the flexible PageHeader component

import PageHeader from './page-header';

// Example 1: Minimal header (no navigation, compact)
export function MinimalHeader() {
  return (
    <PageHeader
      variant="minimal"
      title="Simple Page"
      description="A clean, minimal header"
      size="sm"
    />
  );
}

// Example 2: Hero header (large, centered)
export function HeroHeader() {
  return (
    <PageHeader
      variant="hero"
      title="Welcome to StoreForge AI"
      subtitle="AI-Powered E-commerce"
      description="Create stunning online stores with the power of artificial intelligence"
      background="gradient"
      primaryAction={{ label: "Get Started", href: "/setup" }}
      secondaryAction={{ label: "Learn More", href: "/about", variant: "secondary" }}
      showBackButton={false}
    />
  );
}

// Example 3: Custom background with image
export function ImageHeader() {
  return (
    <PageHeader
      title="Premium Themes"
      description="Beautiful designs for your store"
      background="image"
      backgroundImage="/hero-bg.jpg"
      textAlign="left"
      titleClassName="text-white"
      descriptionClassName="text-gray-200"
    />
  );
}

// Example 4: Compact header with custom actions
export function CompactHeader() {
  return (
    <PageHeader
      variant="compact"
      title="Dashboard"
      showBackButton={false}
      rightContent={
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            </svg>
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      }
    />
  );
}

// Example 5: Custom navigation items with active state
export function CustomNavHeader() {
  return (
    <PageHeader
      title="Store Management"
      description="Manage your online store"
      navigationItems={[
        { label: 'Products', href: '/products', active: true },
        { label: 'Orders', href: '/orders' },
        { label: 'Analytics', href: '/analytics' },
        { label: 'Settings', href: '/settings' }
      ]}
      leftContent={
        <div className="text-sm text-gray-500">
          Last updated: 2 minutes ago
        </div>
      }
    />
  );
}

// Example 6: Transparent header for overlays
export function TransparentHeader() {
  return (
    <PageHeader
      background="transparent"
      title="Overlay Content"
      description="This header has a transparent background"
      titleClassName="text-white drop-shadow-lg"
      descriptionClassName="text-gray-200 drop-shadow"
      showNavigation={false}
    />
  );
}

// Example 7: Right-aligned content
export function RightAlignedHeader() {
  return (
    <PageHeader
      title="Reports & Analytics"
      description="View your store performance"
      textAlign="right"
      bottomContent={
        <div className="flex justify-end space-x-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Export Data
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Filter
          </button>
        </div>
      }
    />
  );
}

// Example 8: Mobile-hidden header
export function DesktopOnlyHeader() {
  return (
    <PageHeader
      title="Desktop Dashboard"
      description="This header is hidden on mobile devices"
      hideOnMobile={true}
      size="xl"
    />
  );
}

// Example 9: Custom brand and styling
export function CustomBrandHeader() {
  return (
    <PageHeader
      brandText="My Store"
      brandIcon={
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">MS</span>
        </div>
      }
      title="Welcome Back"
      description="Manage your store with ease"
      customBackground="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
      background="custom"
      titleClassName="text-white"
      descriptionClassName="text-purple-100"
    />
  );
}

// Example 10: Content-rich header
export function ContentRichHeader() {
  return (
    <PageHeader
      title="Store Analytics"
      subtitle="Performance Dashboard"
      description="Track your store's performance with detailed analytics"
      bottomContent={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Total Sales</h3>
            <p className="text-3xl font-bold text-green-600">$12,345</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
            <p className="text-3xl font-bold text-blue-600">156</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Customers</h3>
            <p className="text-3xl font-bold text-purple-600">89</p>
          </div>
        </div>
      }
    />
  );
}