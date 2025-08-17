'use client';

import { useState } from 'react';
import Footer from '../../components/footer';

export default function AnalyticsPage() {
  const [selectedStore, setSelectedStore] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');

  const stores = [
    { id: 'all', name: 'All Stores' },
    { id: '1', name: 'TechGadget Pro' },
    { id: '2', name: 'Fashion Forward' },
    { id: '3', name: 'Home Essentials' },
  ];

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$24,580',
      change: '+12.5%',
      trend: 'up',
      icon: '💰'
    },
    {
      title: 'Total Orders',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: '📦'
    },
    {
      title: 'Conversion Rate',
      value: '3.4%',
      change: '+0.8%',
      trend: 'up',
      icon: '📈'
    },
    {
      title: 'Avg. Order Value',
      value: '$89.50',
      change: '-2.1%',
      trend: 'down',
      icon: '💳'
    }
  ];

  const topProducts = [
    { name: 'Wireless Earbuds Pro', sales: 156, revenue: '$4,680' },
    { name: 'Smart Watch Series X', sales: 89, revenue: '$3,560' },
    { name: 'Bluetooth Speaker', sales: 67, revenue: '$2,010' },
    { name: 'Phone Case Premium', sales: 45, revenue: '$1,350' },
  ];

  const recentActivity = [
    { type: 'sale', message: 'New order #1247 - $89.99', time: '2 minutes ago' },
    { type: 'visitor', message: '15 new visitors on TechGadget Pro', time: '5 minutes ago' },
    { type: 'optimization', message: 'AI optimized product descriptions', time: '1 hour ago' },
    { type: 'sale', message: 'New order #1246 - $156.50', time: '2 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50/30 to-purple-50/30 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Track your store performance and optimize for better results
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className="text-2xl">{metric.icon}</div>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last period</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
              <div className="h-64 bg-gradient-to-br from-purple-50 to-amber-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-600">Interactive chart coming soon</p>
                  <p className="text-sm text-gray-500">Revenue trends and analytics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Traffic Sources */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              {[
                { source: 'Organic Search', percentage: 45, visitors: '2,340' },
                { source: 'Direct', percentage: 30, visitors: '1,560' },
                { source: 'Social Media', percentage: 15, visitors: '780' },
                { source: 'Referral', percentage: 10, visitors: '520' },
              ].map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{source.source}</span>
                      <span className="text-sm text-gray-500">{source.visitors} visitors</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50/50 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'sale' ? 'bg-green-500' :
                      activity.type === 'visitor' ? 'bg-purple-500' :
                      'bg-amber-500'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-purple-500/10 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-amber-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Insights & Recommendations</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">🎯 Optimization Opportunity</h4>
                <p className="text-sm text-gray-600">
                  Your "Wireless Earbuds Pro" has a 15% higher conversion rate. Consider featuring it more prominently.
                </p>
              </div>
              <div className="bg-white/50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">📈 Growth Trend</h4>
                <p className="text-sm text-gray-600">
                  Mobile traffic increased 23% this week. Optimize your mobile checkout experience.
                </p>
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