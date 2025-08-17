'use client';

import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ApiStatus {
  name: string;
  status: 'checking' | 'success' | 'error' | 'not_configured';
  message: string;
  required: boolean;
}

export default function ApiTester() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    { name: 'OpenRouter', status: 'not_configured', message: 'Not tested', required: true },
    { name: 'Supabase', status: 'not_configured', message: 'Not tested', required: true },
    { name: 'Shopify', status: 'not_configured', message: 'Not tested', required: false },
    { name: 'Replicate', status: 'not_configured', message: 'Not tested', required: false },
    { name: 'Ziina', status: 'not_configured', message: 'Not tested', required: false },
  ]);

  const testApi = async (apiName: string) => {
    setApiStatuses(prev => prev.map(api => 
      api.name === apiName 
        ? { ...api, status: 'checking', message: 'Testing connection...' }
        : api
    ));

    try {
      const response = await fetch(`/api/test/${apiName.toLowerCase()}`, {
        method: 'POST',
      });
      
      const result = await response.json();
      
      setApiStatuses(prev => prev.map(api => 
        api.name === apiName 
          ? { 
              ...api, 
              status: result.success ? 'success' : 'error',
              message: result.message || (result.success ? 'Connected successfully' : 'Connection failed')
            }
          : api
      ));
    } catch (error) {
      setApiStatuses(prev => prev.map(api => 
        api.name === apiName 
          ? { 
              ...api, 
              status: 'error',
              message: 'Network error or API not configured'
            }
          : api
      ));
    }
  };

  const testAllApis = async () => {
    for (const api of apiStatuses) {
      await testApi(api.name);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getStatusIcon = (status: ApiStatus['status']) => {
    switch (status) {
      case 'checking':
        return <ClockIcon className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status: ApiStatus['status']) => {
    switch (status) {
      case 'checking':
        return 'border-yellow-200 bg-yellow-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">API Configuration Test</h2>
          <button
            onClick={testAllApis}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test All APIs
          </button>
        </div>

        <div className="space-y-4">
          {apiStatuses.map((api) => (
            <div
              key={api.name}
              className={`border rounded-lg p-4 transition-colors ${getStatusColor(api.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(api.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      {api.name}
                      {api.required && (
                        <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          Required
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{api.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => testApi(api.name)}
                  disabled={api.status === 'checking'}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Test
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions</h3>
          <p className="text-sm text-blue-800">
            1. Add your API keys to the <code className="bg-blue-100 px-1 rounded">.env.local</code> file<br/>
            2. Click "Test All APIs" to verify your configuration<br/>
            3. Required APIs (OpenRouter, Supabase) must be configured for core functionality<br/>
            4. Optional APIs enhance features but aren't required for basic operation
          </p>
        </div>
      </div>
    </div>
  );
}