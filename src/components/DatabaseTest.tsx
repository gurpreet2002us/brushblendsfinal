import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

export default function DatabaseTest() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testCases = [
    {
      name: 'Database Connection',
      test: async () => {
        const { data, error } = await supabase.from('artworks').select('count').limit(1);
        if (error) throw error;
        return { message: 'Successfully connected to Supabase', data: 'Connected' };
      }
    },
    {
      name: 'Artworks Table',
      test: async () => {
        const { data, error } = await supabase.from('artworks').select('*');
        if (error) throw error;
        return { message: `Found ${data.length} artworks`, data: data.length };
      }
    },
    {
      name: 'Featured Artworks',
      test: async () => {
        const { data, error } = await supabase.from('artworks').select('*').eq('featured', true);
        if (error) throw error;
        return { message: `Found ${data.length} featured artworks`, data: data.length };
      }
    },
    {
      name: 'User Profiles Table',
      test: async () => {
        const { data, error } = await supabase.from('user_profiles').select('*');
        if (error) throw error;
        return { message: `Found ${data.length} user profiles`, data: data.length };
      }
    },
    {
      name: 'Cart Table',
      test: async () => {
        const { data, error } = await supabase.from('cart').select('*');
        if (error) throw error;
        return { message: `Found ${data.length} cart items`, data: data.length };
      }
    },
    {
      name: 'Wishlist Table',
      test: async () => {
        const { data, error } = await supabase.from('wishlist').select('*');
        if (error) throw error;
        return { message: `Found ${data.length} wishlist items`, data: data.length };
      }
    },
    {
      name: 'Orders Table',
      test: async () => {
        const { data, error } = await supabase.from('orders').select('*');
        if (error) throw error;
        return { message: `Found ${data.length} orders`, data: data.length };
      }
    },
    {
      name: 'Coupons Table',
      test: async () => {
        const { data, error } = await supabase
          .from('coupons')
          .select('*');
        if (error) throw error;
        const activeCoupons = data.filter(c => c.active);
        return { 
          message: `Found ${data.length} total coupons, ${activeCoupons.length} active`, 
          data: activeCoupons.map(c => `${c.code} (${c.discount_percentage}%)`)
        };
      }
    },
    {
      name: 'Order Requests Table',
      test: async () => {
        const { data, error } = await supabase.from('order_requests').select('*');
        if (error) throw error;
        return { message: `Found ${data.length} order requests`, data: data.length };
      }
    },
    {
      name: 'Authentication Status',
      test: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return { 
          message: session ? `Authenticated as ${session.user.email}` : 'Not authenticated',
          data: session ? session.user.email : 'No user' 
        };
      }
    },
    {
      name: 'Test Coupon Validation',
      test: async () => {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', 'BB202510')
          .eq('active', true)
          .single();
        if (error) throw error;
        return { 
          message: `Coupon BB202510: ${data.discount_percentage}% off, used ${data.used_count}/${data.usage_limit || '∞'} times`,
          data: `${data.discount_percentage}% discount`
        };
      }
    },
    {
      name: 'Sample Data Check',
      test: async () => {
        const { data: artworks, error: artError } = await supabase.from('artworks').select('count');
        if (artError) throw artError;
        
        const { data: coupons, error: couponError } = await supabase.from('coupons').select('count');
        if (couponError) throw couponError;
        
        return { 
          message: `Sample data loaded successfully`,
          data: `${artworks.length || 0} artworks, ${coupons.length || 0} coupons`
        };
      }
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    for (const testCase of testCases) {
      const result: TestResult = {
        name: testCase.name,
        status: 'pending',
        message: 'Running...'
      };
      
      results.push(result);
      setTests([...results]);

      try {
        const testResult = await testCase.test();
        result.status = 'success';
        result.message = testResult.message;
        result.data = testResult.data;
      } catch (error) {
        result.status = 'error';
        result.message = error instanceof Error ? error.message : 'Unknown error';
      }

      setTests([...results]);
      await new Promise(resolve => setTimeout(resolve, 300)); // Small delay for better UX
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'border-yellow-200 bg-yellow-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Database Connection Test</h1>
                <p className="text-gray-600">Testing Supabase database connectivity and functionality</p>
              </div>
            </div>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running...' : 'Run Tests'}
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{tests.length}</div>
              <div className="text-sm text-blue-600">Total Tests</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-green-600">Passed</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            {tests.map((test, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(test.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(test.status)}
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">{test.name}</h3>
                      <p className="text-sm text-gray-600">{test.message}</p>
                    </div>
                  </div>
                  {test.data && (
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded max-w-xs truncate">
                      {typeof test.data === 'object' ? JSON.stringify(test.data) : test.data}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Environment Variables Check */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Environment Variables</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>VITE_SUPABASE_URL:</span>
                <span className={import.meta.env.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                  {import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VITE_SUPABASE_ANON_KEY:</span>
                <span className={import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                  {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Setup</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Copy the complete SQL from <code>supabase/migrations/create_complete_schema.sql</code></li>
              <li>2. Run it in your Supabase SQL Editor</li>
              <li>3. Configure your .env file with Supabase credentials</li>
              <li>4. Enable Google OAuth in Supabase Auth settings (optional)</li>
              <li>5. All tests should pass! 🎉</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}