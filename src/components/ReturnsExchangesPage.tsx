import React from 'react';
import { RotateCcw, CheckCircle, XCircle, Clock, Package, AlertTriangle, Phone, Mail } from 'lucide-react';

interface ReturnsExchangesPageProps {
  onNavigate: (page: string) => void;
}

export default function ReturnsExchangesPage({ onNavigate }: ReturnsExchangesPageProps) {
  const returnConditions = [
    {
      icon: CheckCircle,
      title: 'Eligible for Return',
      items: [
        'Item received damaged or defective',
        'Wrong item shipped',
        'Significant color variation from website',
        'Item not as described'
      ],
      color: 'green'
    },
    {
      icon: XCircle,
      title: 'Not Eligible for Return',
      items: [
        'Custom commissioned artworks',
        'Items damaged by customer',
        'Items without original packaging',
        'Items returned after 7 days'
      ],
      color: 'red'
    }
  ];

  const returnProcess = [
    {
      step: 1,
      title: 'Contact Us',
      description: 'Reach out within 7 days of delivery with your order number and reason for return.',
      icon: Phone
    },
    {
      step: 2,
      title: 'Return Authorization',
      description: 'We\'ll provide a return authorization number and detailed return instructions.',
      icon: CheckCircle
    },
    {
      step: 3,
      title: 'Package & Ship',
      description: 'Carefully package the item in original packaging and ship using our provided label.',
      icon: Package
    },
    {
      step: 4,
      title: 'Inspection & Refund',
      description: 'Once we receive and inspect the item, we\'ll process your refund within 5-7 business days.',
      icon: RotateCcw
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
            <RotateCcw className="h-4 w-4 mr-2" />
            Return & Exchange Policy
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Returns & Exchanges</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We want you to be completely satisfied with your purchase. Learn about our 
            return and exchange policy to ensure a smooth experience.
          </p>
        </div>
      </section>

      {/* Policy Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
            <div className="flex items-center mb-6">
              <Clock className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">7-Day Return Policy</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              We offer a 7-day return policy from the date of delivery for eligible items. 
              This gives you time to inspect your artwork and ensure it meets your expectations.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Returns must be initiated within this timeframe, and items must be in their 
              original condition with all packaging materials included.
            </p>
          </div>

          {/* Return Conditions */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {returnConditions.map((condition, index) => {
              const Icon = condition.icon;
              const colorClasses = condition.color === 'green' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600';
              
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl mr-4 ${colorClasses}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{condition.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {condition.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                          condition.color === 'green' ? 'bg-green-600' : 'bg-red-600'
                        }`}></div>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How to Return an Item</h2>
            <p className="text-xl text-gray-600">
              Follow these simple steps to return your artwork
            </p>
          </div>
          
          <div className="space-y-8">
            {returnProcess.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-purple-600">{step.step}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <Icon className="h-6 w-6 text-purple-600 mr-3" />
                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Exchange Policy */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Exchange Policy</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">When Exchanges Are Available</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Size variations within same artwork series</li>
                  <li>• Different framing options</li>
                  <li>• Color variations of same design</li>
                  <li>• Defective items replacement</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exchange Process</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Contact us within 7 days</li>
                  <li>• Check availability of desired item</li>
                  <li>• Pay any price difference</li>
                  <li>• Return original item as per process</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Information */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Refund Timeline</h3>
                  <p className="text-gray-600">
                    Refunds are processed within 5-7 business days after we receive and inspect the returned item. 
                    The refund will be credited to your original payment method.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Costs</h3>
                  <p className="text-gray-600">
                    Original shipping costs are non-refundable unless the return is due to our error. 
                    Return shipping costs are the customer's responsibility unless the item is defective.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Partial Refunds</h3>
                  <p className="text-gray-600">
                    Items returned in less than perfect condition may be subject to partial refunds. 
                    We'll contact you before processing any partial refund.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Important Notes</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Custom Artworks:</strong> Custom commissioned pieces are non-returnable unless 
                there's a quality issue or the artwork doesn\'t match the agreed specifications.
              </p>
              <p>
                <strong>Packaging:</strong> Please keep all original packaging materials until you're 
                satisfied with your purchase. Items must be returned in original packaging.
              </p>
              <p>
                <strong>Inspection:</strong> We recommend inspecting your artwork immediately upon delivery 
                and contacting us within 24 hours if there are any issues.
              </p>
              <p>
                <strong>Documentation:</strong> Take photos of any damage or issues before contacting us. 
                This helps us process your return more quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-4">Need Help with Returns?</h3>
            <p className="text-purple-100 mb-8">
              Our customer service team is ready to assist you with any return or exchange questions.
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
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
              >
                <Phone className="h-4 w-4 mr-2" />
                +91 98373 78157
              </a>
              <a
                href="mailto:returns@brushnblends.com"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
              >
                <Mail className="h-4 w-4 mr-2" />
                returns@brushnblends.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}