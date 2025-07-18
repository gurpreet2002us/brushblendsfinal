import React from 'react';
import { Truck, Package, Clock, MapPin, Shield, CheckCircle, AlertCircle, Phone } from 'lucide-react';

interface ShippingInfoPageProps {
  onNavigate: (page: string) => void;
}

export default function ShippingInfoPage({ onNavigate }: ShippingInfoPageProps) {
  const shippingZones = [
    {
      zone: 'Metro Cities',
      cities: 'Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad',
      time: '3-5 business days',
      cost: 'Free above ₹2000, ₹100 below'
    },
    {
      zone: 'Tier 1 Cities',
      cities: 'Pune, Ahmedabad, Jaipur, Lucknow, Kanpur, Nagpur',
      time: '4-6 business days',
      cost: 'Free above ₹2000, ₹120 below'
    },
    {
      zone: 'Tier 2 Cities',
      cities: 'Indore, Bhopal, Patna, Vadodara, Coimbatore',
      time: '5-7 business days',
      cost: 'Free above ₹2000, ₹150 below'
    },
    {
      zone: 'Remote Areas',
      cities: 'Hill stations, remote towns, and rural areas',
      time: '7-10 business days',
      cost: 'Free above ₹3000, ₹200 below'
    }
  ];

  const packagingFeatures = [
    {
      icon: Shield,
      title: 'Protective Packaging',
      description: 'Multiple layers of bubble wrap and foam padding'
    },
    {
      icon: Package,
      title: 'Sturdy Boxes',
      description: 'High-quality corrugated boxes designed for artwork'
    },
    {
      icon: CheckCircle,
      title: 'Insurance Included',
      description: 'All shipments are insured against damage or loss'
    },
    {
      icon: Truck,
      title: 'Reliable Partners',
      description: 'Trusted courier services with tracking capabilities'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            <Truck className="h-4 w-4 mr-2" />
            Delivery Information
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Shipping Information</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We ensure your precious artworks reach you safely with our careful packaging 
            and reliable shipping partners across India.
          </p>
        </div>
      </section>

      {/* Shipping Zones */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Delivery Zones & Timeline</h2>
            <p className="text-xl text-gray-600">
              We deliver across India with varying timelines based on your location
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingZones.map((zone, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">{zone.zone}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{zone.cities}</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{zone.time}</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">{zone.cost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packaging Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Safe & Secure Packaging</h2>
            <p className="text-xl text-gray-600">
              Your artwork's safety is our top priority during transit
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packagingFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shipping Process */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How We Ship Your Order</h2>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Processing</h3>
                <p className="text-gray-600">
                  Once your order is confirmed, we carefully prepare your artwork for shipping. 
                  This typically takes 1-2 business days.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Careful Packaging</h3>
                <p className="text-gray-600">
                  Each artwork is wrapped in acid-free tissue paper, protected with bubble wrap, 
                  and placed in a custom-sized box with foam padding.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Dispatch & Tracking</h3>
                <p className="text-gray-600">
                  Your order is dispatched with a tracking number sent via SMS and email. 
                  You can track your package in real-time.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe Delivery</h3>
                <p className="text-gray-600">
                  Our delivery partner ensures safe handling and delivers to your doorstep. 
                  Signature confirmation is required for valuable items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Important Shipping Notes</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Requirements</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Someone must be available to receive the package</li>
                  <li>• Valid ID required for high-value items</li>
                  <li>• Inspect package before signing delivery receipt</li>
                  <li>• Report any damage immediately</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Circumstances</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Weather delays may affect delivery times</li>
                  <li>• Festival seasons may cause slight delays</li>
                  <li>• Remote areas may require additional time</li>
                  <li>• Custom artworks ship within 2-3 weeks</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Need Help with Shipping?</h3>
            <p className="text-green-100 mb-6">
              Our customer service team is here to help with any shipping questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Contact Support
              </button>
              <a
                href="tel:+919837378157"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-all duration-200"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Us: +91 98373 78157
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}