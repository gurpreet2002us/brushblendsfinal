import React from 'react';
import { Cookie, Settings, Eye, Shield, Info, CheckCircle } from 'lucide-react';

interface CookiePolicyPageProps {
  onNavigate: (page: string) => void;
}

export default function CookiePolicyPage({ onNavigate }: CookiePolicyPageProps) {
  const cookieTypes = [
    {
      title: 'Essential Cookies',
      icon: Shield,
      description: 'These cookies are necessary for the website to function properly.',
      examples: [
        'Shopping cart functionality',
        'User authentication',
        'Security features',
        'Basic website operations'
      ],
      canDisable: false
    },
    {
      title: 'Analytics Cookies',
      icon: Eye,
      description: 'Help us understand how visitors interact with our website.',
      examples: [
        'Page views and traffic sources',
        'User behavior patterns',
        'Website performance metrics',
        'Popular content identification'
      ],
      canDisable: true
    },
    {
      title: 'Functional Cookies',
      icon: Settings,
      description: 'Enable enhanced functionality and personalization.',
      examples: [
        'Language preferences',
        'Region selection',
        'Customized user interface',
        'Accessibility settings'
      ],
      canDisable: true
    },
    {
      title: 'Marketing Cookies',
      icon: Info,
      description: 'Used to deliver relevant advertisements and track campaign effectiveness.',
      examples: [
        'Targeted advertising',
        'Social media integration',
        'Campaign performance tracking',
        'Personalized recommendations'
      ],
      canDisable: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
            <Cookie className="h-4 w-4 mr-2" />
            Cookie Information
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Learn about how we use cookies to enhance your browsing experience and provide 
            personalized services on our website.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Are Cookies?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better browsing experience by remembering your preferences 
              and understanding how you use our site.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We use cookies responsibly and transparently. This policy explains what cookies we use, 
              why we use them, and how you can control them.
            </p>
          </div>

          {/* Cookie Types */}
          <div className="space-y-8">
            {cookieTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mr-4">
                        <Icon className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{type.title}</h3>
                        <p className="text-gray-600">{type.description}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      type.canDisable 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {type.canDisable ? 'Optional' : 'Required'}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Examples:</h4>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {type.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="flex items-center">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                          <span className="text-gray-600">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cookie Management */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Managing Your Cookie Preferences</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Browser Settings</h4>
                <p className="text-gray-600 mb-4">
                  You can control cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• View and delete cookies</li>
                  <li>• Block cookies from specific sites</li>
                  <li>• Block third-party cookies</li>
                  <li>• Clear all cookies when closing browser</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Our Cookie Banner</h4>
                <p className="text-gray-600 mb-4">
                  When you first visit our site, you'll see a cookie banner where you can:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Accept all cookies</li>
                  <li>• Customize your preferences</li>
                  <li>• Reject non-essential cookies</li>
                  <li>• Learn more about each type</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Third-Party Cookies */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Third-Party Services</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              We use trusted third-party services that may set their own cookies. These include:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                <p className="text-sm text-gray-600">Website traffic analysis and user behavior insights</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Payment Processors</h4>
                <p className="text-sm text-gray-600">Secure payment processing and fraud prevention</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
                <p className="text-sm text-gray-600">Social sharing buttons and embedded content</p>
              </div>
            </div>
          </div>

          {/* Updates and Changes */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Policy Updates</h3>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              </div>
              <div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices 
                  or for other operational, legal, or regulatory reasons.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  When we make changes, we will update the "Last Updated" date at the top of this policy 
                  and notify you through our website or other appropriate means.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-orange-600 to-amber-700 rounded-2xl shadow-xl p-8 mt-12 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Questions About Cookies?</h3>
            <p className="text-orange-100 mb-6">
              If you have any questions about our use of cookies or this Cookie Policy, 
              we're here to help clarify things for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Contact Us
              </button>
              <a
                href="mailto:privacy@brushnblends.com"
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange-600 transition-all duration-200"
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