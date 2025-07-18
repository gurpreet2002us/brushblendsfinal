import React from 'react';
import { FileText, Scale, ShoppingCart, Truck, RotateCcw, AlertTriangle } from 'lucide-react';

interface TermsOfServicePageProps {
  onNavigate: (page: string) => void;
}

export default function TermsOfServicePage({ onNavigate }: TermsOfServicePageProps) {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: Scale,
      content: 'By accessing and using the Brush n Blends website, you accept and agree to be bound by the terms and provision of this agreement. These terms apply to all visitors, users, and others who access or use the service.'
    },
    {
      title: 'Products and Services',
      icon: ShoppingCart,
      content: 'We offer handcrafted fabric paintings, oil paintings, and artisanal items. All product descriptions, images, and specifications are provided for informational purposes. We reserve the right to modify or discontinue products without notice.'
    },
    {
      title: 'Ordering and Payment',
      icon: FileText,
      content: 'Orders are subject to acceptance and availability. We accept various payment methods including UPI, cards, net banking, and cash on delivery. All prices are in Indian Rupees and include applicable taxes unless otherwise stated.'
    },
    {
      title: 'Shipping and Delivery',
      icon: Truck,
      content: 'We ship across India with free shipping on orders above ₹2000. Delivery times are estimates and may vary. Risk of loss and title for items pass to you upon delivery to the shipping address you provide.'
    },
    {
      title: 'Returns and Exchanges',
      icon: RotateCcw,
      content: 'We offer a 7-day return policy for undamaged items in original packaging. Custom commissioned pieces are non-returnable unless there is a quality issue. Return shipping costs are the responsibility of the customer unless the item is defective.'
    },
    {
      title: 'Intellectual Property',
      icon: AlertTriangle,
      content: 'All content on this website, including images, text, designs, and artwork, is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            <FileText className="h-4 w-4 mr-2" />
            Legal Information
          </div>
          <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Please read these terms carefully before using our services. These terms govern your use of 
            our website and the purchase of our artworks.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Agreement Overview</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              These Terms of Service ("Terms") govern your use of the Brush n Blends website and services. 
              By using our website or purchasing our products, you agree to these terms in full.
            </p>
            <p className="text-gray-600 leading-relaxed">
              If you disagree with any part of these terms, then you may not access the service. 
              We reserve the right to update these terms at any time, and your continued use constitutes 
              acceptance of any changes.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mr-4">
                      <Icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              );
            })}
          </div>

          {/* Additional Terms */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">User Responsibilities</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Provide accurate information</li>
                <li>• Use the website lawfully</li>
                <li>• Respect intellectual property</li>
                <li>• Maintain account security</li>
                <li>• Report any issues promptly</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Limitation of Liability</h3>
              <p className="text-gray-600 leading-relaxed">
                Our liability is limited to the maximum extent permitted by law. 
                We are not liable for indirect, incidental, or consequential damages.
              </p>
            </div>
          </div>

          {/* Warranty and Quality */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Quality Guarantee</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Our Promise</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Authentic handcrafted artworks</li>
                  <li>• Quality materials and techniques</li>
                  <li>• Careful packaging and shipping</li>
                  <li>• Certificate of authenticity</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Warranty Coverage</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Manufacturing defects</li>
                  <li>• Damage during shipping</li>
                  <li>• Color variations from display</li>
                  <li>• Authenticity guarantee</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 mt-12 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Questions About These Terms?</h3>
            <p className="text-gray-300 mb-6">
              If you have any questions about these Terms of Service, please contact us. 
              We're here to help clarify any concerns you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Contact Us
              </button>
              <a
                href="mailto:legal@brushnblends.com"
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
              >
                legal@brushnblends.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}