import React, { useState } from 'react';
import { Package, Search, MapPin, Clock, CheckCircle, Truck, Home } from 'lucide-react';

interface TrackOrderPageProps {
  onNavigate: (page: string) => void;
}

export default function TrackOrderPage({ onNavigate }: TrackOrderPageProps) {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock tracking data
  const mockTrackingData = {
    'AG123456': {
      orderNumber: 'AG123456',
      status: 'delivered',
      orderDate: '2024-01-15',
      estimatedDelivery: '2024-01-22',
      actualDelivery: '2024-01-21',
      items: [
        { name: 'Sunset Meadow Fabric Painting', quantity: 1, price: 1850 }
      ],
      total: 1850,
      shippingAddress: {
        name: 'John Doe',
        address: '123 Art Street, Mumbai, Maharashtra 400001'
      },
      trackingSteps: [
        {
          status: 'Order Placed',
          date: '2024-01-15',
          time: '10:30 AM',
          description: 'Your order has been confirmed and is being prepared.',
          completed: true
        },
        {
          status: 'Processing',
          date: '2024-01-16',
          time: '02:15 PM',
          description: 'Artwork is being carefully packaged for shipment.',
          completed: true
        },
        {
          status: 'Shipped',
          date: '2024-01-17',
          time: '11:45 AM',
          description: 'Package has been dispatched from our facility.',
          completed: true
        },
        {
          status: 'In Transit',
          date: '2024-01-19',
          time: '09:20 AM',
          description: 'Package is on its way to your delivery address.',
          completed: true
        },
        {
          status: 'Out for Delivery',
          date: '2024-01-21',
          time: '08:00 AM',
          description: 'Package is out for delivery and will arrive today.',
          completed: true
        },
        {
          status: 'Delivered',
          date: '2024-01-21',
          time: '03:30 PM',
          description: 'Package has been successfully delivered.',
          completed: true
        }
      ]
    },
    'AG789012': {
      orderNumber: 'AG789012',
      status: 'shipped',
      orderDate: '2024-01-20',
      estimatedDelivery: '2024-01-27',
      items: [
        { name: 'Abstract Dreams Oil Painting', quantity: 1, price: 2800 }
      ],
      total: 2800,
      shippingAddress: {
        name: 'Jane Smith',
        address: '456 Gallery Road, Delhi, Delhi 110001'
      },
      trackingSteps: [
        {
          status: 'Order Placed',
          date: '2024-01-20',
          time: '02:45 PM',
          description: 'Your order has been confirmed and is being prepared.',
          completed: true
        },
        {
          status: 'Processing',
          date: '2024-01-21',
          time: '10:30 AM',
          description: 'Artwork is being carefully packaged for shipment.',
          completed: true
        },
        {
          status: 'Shipped',
          date: '2024-01-22',
          time: '04:20 PM',
          description: 'Package has been dispatched from our facility.',
          completed: true
        },
        {
          status: 'In Transit',
          date: '2024-01-24',
          time: '11:15 AM',
          description: 'Package is on its way to your delivery address.',
          completed: false
        },
        {
          status: 'Out for Delivery',
          date: '',
          time: '',
          description: 'Package will be out for delivery soon.',
          completed: false
        },
        {
          status: 'Delivered',
          date: '',
          time: '',
          description: 'Package will be delivered to your address.',
          completed: false
        }
      ]
    }
  };

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const result = mockTrackingData[orderNumber.toUpperCase() as keyof typeof mockTrackingData];
      setTrackingResult(result || null);
      setIsLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (!completed) return <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>;
    
    switch (status) {
      case 'Order Placed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Processing':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'Shipped':
        return <Truck className="w-4 h-4 text-purple-600" />;
      case 'In Transit':
        return <MapPin className="w-4 h-4 text-orange-600" />;
      case 'Out for Delivery':
        return <Truck className="w-4 h-4 text-amber-600" />;
      case 'Delivered':
        return <Home className="w-4 h-4 text-green-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
            <Package className="h-4 w-4 mr-2" />
            Order Tracking
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Track Your Order</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Enter your order number to get real-time updates on your artwork delivery.
          </p>
        </div>
      </section>

      {/* Tracking Form */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Enter Order Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Enter your order number (e.g., AG123456)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
              
              <button
                onClick={handleTrackOrder}
                disabled={isLoading || !orderNumber.trim()}
                className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Tracking...
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5 mr-2" />
                    Track Order
                  </>
                )}
              </button>
            </div>
            
            {/* Sample Order Numbers */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">Try these sample order numbers:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setOrderNumber('AG123456')}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                >
                  AG123456 (Delivered)
                </button>
                <button
                  onClick={() => setOrderNumber('AG789012')}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                >
                  AG789012 (Shipped)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Results */}
      {trackingResult && (
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Order Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order #{trackingResult.orderNumber}
                  </h2>
                  <p className="text-gray-600">
                    Placed on {new Date(trackingResult.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(trackingResult.status)}`}>
                  {trackingResult.status.charAt(0).toUpperCase() + trackingResult.status.slice(1)}
                </span>
              </div>

              {/* Order Items */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                {trackingResult.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{item.price}</p>
                  </div>
                ))}
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">₹{trackingResult.total}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                <p className="text-gray-600">{trackingResult.shippingAddress.name}</p>
                <p className="text-gray-600">{trackingResult.shippingAddress.address}</p>
              </div>

              {/* Tracking Timeline */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-6">Tracking Timeline</h3>
                <div className="space-y-6">
                  {trackingResult.trackingSteps.map((step: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(step.status, step.completed)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <h4 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step.status}
                          </h4>
                          {step.date && (
                            <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                              <Clock className="h-4 w-4 mr-1" />
                              {step.date} at {step.time}
                            </div>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Delivery */}
              {trackingResult.status !== 'delivered' && (
                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Estimated Delivery</h4>
                      <p className="text-blue-700">
                        {new Date(trackingResult.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* No Results */}
      {trackingResult === null && orderNumber && !isLoading && (
        <section className="pb-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find an order with number "{orderNumber}". Please check your order number and try again.
              </p>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Contact Support
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-4">Need Help with Your Order?</h3>
            <p className="text-purple-100 mb-8">
              Can't find your order or have questions about delivery? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Contact Support
              </button>
              <a
                href="tel:+919837378157"
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
              >
                Call: +91 98373 78157
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}