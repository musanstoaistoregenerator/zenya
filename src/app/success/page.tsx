'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

import Footer from '../../components/footer';

interface PaymentInfo {
  paymentId?: string;
  amount?: number;
  currency?: string;
  customerEmail?: string;
  timestamp?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get payment ID from URL params or localStorage
        const paymentId = searchParams.get('payment_id') || searchParams.get('id');
        const status = searchParams.get('status');
        
        // Get stored payment info
        const storedPayment = localStorage.getItem('storeforge_payment');
        if (storedPayment) {
          const parsed = JSON.parse(storedPayment);
          setPaymentInfo(parsed);
        }

        if (status) {
          // Status provided in URL
          switch (status.toLowerCase()) {
            case 'completed':
            case 'success':
              setPaymentStatus('success');
              // Clear stored payment info on success
              localStorage.removeItem('storeforge_payment');
              break;
            case 'failed':
            case 'error':
              setPaymentStatus('failed');
              break;
            case 'pending':
            case 'processing':
              setPaymentStatus('pending');
              break;
            default:
              setPaymentStatus('success'); // Default to success for existing flow
          }
        } else {
          // No status in URL, assume success for existing flow
          setPaymentStatus('success');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('success'); // Default to success to maintain existing behavior
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return (
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
        );
      case 'failed':
        return (
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <XCircleIcon className="h-10 w-10 text-red-600" />
          </div>
        );
      case 'pending':
        return (
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 mb-6">
            <ClockIcon className="h-10 w-10 text-yellow-600" />
          </div>
        );
      default:
        return (
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        );
    }
  };

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Payment Pending';
      default:
        return 'Processing Payment...';
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Thank you for your purchase! You now have access to premium themes and features.';
      case 'failed':
        return error || 'Your payment could not be processed. Please try again or contact support.';
      case 'pending':
        return 'Your payment is being processed. You will receive a confirmation email shortly.';
      default:
        return 'Please wait while we process your payment...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-8 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          {/* Status Icon */}
          {getStatusIcon()}
          
          {/* Status Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {getStatusTitle()}
          </h1>
          
          {/* Status Message */}
          <p className="text-lg text-gray-600 mb-6">
            {getStatusMessage()}
          </p>

          {/* Payment Details */}
          {paymentInfo && paymentStatus === 'success' && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {paymentInfo.amount && (
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: paymentInfo.currency || 'USD'
                      }).format(paymentInfo.amount)}
                    </span>
                  </div>
                )}
                {paymentInfo.customerEmail && (
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium">{paymentInfo.customerEmail}</span>
                  </div>
                )}
                {paymentInfo.timestamp && (
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {new Date(paymentInfo.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}



          {/* What's Next - Only show for successful payments */}
          {paymentStatus === 'success' && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">What's Next?</h2>
              <ul className="space-y-3 text-left">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Access premium themes in your dashboard</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Create beautiful AI-generated stores</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Enjoy lifetime updates and new themes</span>
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {paymentStatus === 'success' && (
              <>
                <a
                  href="/themes"
                  className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 block text-center"
                >
                  Browse Premium Themes
                </a>
                
                <a
                  href="/dashboard"
                  className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300 block text-center"
                >
                  Go to Dashboard
                </a>
              </>
            )}
            
            {paymentStatus === 'failed' && (
              <>
                <a
                  href="/checkout"
                  className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 block text-center"
                >
                  Try Again
                </a>
                
                <a
                  href="/contact"
                  className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300 block text-center"
                >
                  Contact Support
                </a>
              </>
            )}
            
            {paymentStatus === 'pending' && (
              <a
                href="/dashboard"
                className="w-full border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300 block text-center"
              >
                Go to Dashboard
              </a>
            )}
            
            {paymentStatus === 'loading' && (
              <div className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-6 rounded-lg block text-center">
                Processing...
              </div>
            )}
            
            <a
              href="/"
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-300 block text-center"
            >
              ← Back to Home
            </a>
          </div>

          {/* Support */}
          <div className="mt-8 text-sm text-gray-500">
            <p>Need help? <a href="/contact" className="text-purple-600 hover:text-purple-700">Contact Support</a></p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-lg">Loading...</div></div>}>
      <SuccessContent />
    </Suspense>
  );
}