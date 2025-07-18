import React from 'react';
import { Shield, Eye, Lock, Users, FileText, Clock } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigate: (page: string) => void;
}

export default function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  const sections = [
    {
      title: 'Information We Collect',
      icon: FileText,
      content: [
        'Personal information you provide when creating an account or making a purchase',
        'Contact details including name, email address, phone number, and shipping address',
        'Payment information (processed securely through our payment partners)',
        'Communication preferences and artwork interests',
        'Website usage data and analytics to improve our services'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: Users,
      content: [
        'Process and fulfill your orders and provide customer support',
        'Send order confirmations, shipping updates, and delivery notifications',
        'Communicate about new artworks, exhibitions, and special offers (with your consent)',
        'Improve our website functionality and user experience',
        'Comply with legal obligations and protect against fraud'
      ]
    },
    {
      title: 'Information Sharing',
      icon: Eye,
      content: [
        'We never sell your personal information to third parties',
        'Shipping partners receive necessary delivery information only',
        'Payment processors handle transaction data securely',
        'Legal authorities may receive information if required by law',
        'Service providers who help us operate our business (under strict confidentiality)'
      ]
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: [
        'SSL encryption for all data transmission',
        'Secure servers with regular security updates',
        'Limited access to personal information on a need-to-know basis',
        'Regular security audits and monitoring',
        'Immediate notification in case of any security incidents'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4 mr-2" />
            Your Privacy Matters
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We are committed to protecting your privacy and ensuring the security of your personal information. 
            This policy explains how we collect, use, and safeguard your data.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: January 2024</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Commitment to You</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At Brush n Blends, we understand that your privacy is important. This Privacy Policy describes 
              how we collect, use, disclose, and safeguard your information when you visit our website or 
              make a purchase from us.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our services, you agree to the collection and use of information in accordance with 
              this policy. We will not use or share your information with anyone except as described in this 
              Privacy Policy.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mr-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                        <span className="text-gray-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Additional Sections */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Rights</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Access your personal information</li>
                <li>• Correct inaccurate data</li>
                <li>• Request deletion of your data</li>
                <li>• Opt-out of marketing communications</li>
                <li>• Data portability</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cookies & Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                We use cookies to enhance your browsing experience, analyze website traffic, 
                and personalize content. You can control cookie settings through your browser.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mt-12 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Questions About Privacy?</h3>
            <p className="text-blue-100 mb-6">
              If you have any questions about this Privacy Policy or our data practices, 
              please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Contact Us
              </button>
              <a
                href="mailto:privacy@brushnblends.com"
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                privacy@brushnblends.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}