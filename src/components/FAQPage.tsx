import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';

interface FAQPageProps {
  onNavigate: (page: string) => void;
}

export default function FAQPage({ onNavigate }: FAQPageProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      category: 'Orders & Payment',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept UPI, credit/debit cards, net banking, and cash on delivery (COD). All payments are processed securely through our trusted payment partners.'
        },
        {
          question: 'Can I modify or cancel my order?',
          answer: 'Orders can be modified or cancelled within 2 hours of placement. After this time, the artwork may already be in preparation. Contact us immediately if you need to make changes.'
        },
        {
          question: 'Do you offer EMI options?',
          answer: 'Yes, we offer EMI options for orders above ₹5000 through select credit cards and payment partners. EMI options will be displayed during checkout if available.'
        },
        {
          question: 'Is there a minimum order value?',
          answer: 'There is no minimum order value. However, free shipping is available on orders above ₹2000. Orders below this amount will have shipping charges applied.'
        }
      ]
    },
    {
      category: 'Shipping & Delivery',
      faqs: [
        {
          question: 'How long does delivery take?',
          answer: 'Delivery typically takes 3-7 business days depending on your location. Metro cities receive faster delivery (3-5 days) while remote areas may take up to 10 days.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Currently, we only ship within India. We are working on expanding our international shipping options and will update customers when available.'
        },
        {
          question: 'How is artwork packaged for shipping?',
          answer: 'All artworks are carefully wrapped in acid-free tissue paper, protected with bubble wrap, and placed in custom-sized boxes with foam padding. Insurance is included for all shipments.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes, you will receive a tracking number via SMS and email once your order is dispatched. You can track your package in real-time using this number.'
        }
      ]
    },
    {
      category: 'Products & Quality',
      faqs: [
        {
          question: 'Are all artworks handmade?',
          answer: 'Yes, every piece in our collection is handcrafted by skilled artisans. We do not sell mass-produced or machine-made items. Each artwork is unique and comes with a certificate of authenticity.'
        },
        {
          question: 'What materials are used in fabric paintings?',
          answer: 'Our fabric paintings use high-quality cotton, silk, and linen bases with premium embroidery threads, beads, sequins, and fabric paints. All materials are colorfast and durable.'
        },
        {
          question: 'Do you offer custom artwork commissions?',
          answer: 'Yes, we love creating custom pieces! Share your vision with us, and our artists will bring it to life. Custom commissions typically take 2-4 weeks and require a 50% advance payment.'
        },
        {
          question: 'How do I know if an artwork will match my decor?',
          answer: 'We provide detailed photos and color descriptions for each artwork. You can also contact our art consultants for personalized advice on selecting pieces that complement your space.'
        }
      ]
    },
    {
      category: 'Returns & Exchanges',
      faqs: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 7-day return policy for undamaged items in original packaging. Custom commissioned pieces are non-returnable unless there is a quality issue.'
        },
        {
          question: 'Who pays for return shipping?',
          answer: 'Return shipping costs are the customer\'s responsibility unless the item is defective or we shipped the wrong item. We provide detailed return instructions and packaging guidelines.'
        },
        {
          question: 'How long does it take to process a refund?',
          answer: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.'
        },
        {
          question: 'Can I exchange an artwork for a different one?',
          answer: 'Yes, exchanges are possible within 7 days for items of equal or higher value. You\'ll need to pay any price difference and return shipping costs.'
        }
      ]
    },
    {
      category: 'Care & Maintenance',
      faqs: [
        {
          question: 'How should I clean my fabric painting?',
          answer: 'Dust gently with a soft, dry brush or use a vacuum with brush attachment on low setting. For spot cleaning, use mild soap with a damp cloth and allow to air dry completely.'
        },
        {
          question: 'How do I protect artwork from fading?',
          answer: 'Display artwork away from direct sunlight and use UV-filtering glass if framing. Consider museum-quality lighting and rotate pieces periodically to ensure even exposure.'
        },
        {
          question: 'What should I do if my artwork gets damaged?',
          answer: 'Contact us immediately with photos of the damage. We work with certified art restorers and can provide repair services. Don\'t attempt DIY repairs as this may void any warranty.'
        },
        {
          question: 'Do you provide framing services?',
          answer: 'We offer framing recommendations and can connect you with trusted local framers. For valuable pieces, we recommend acid-free materials and UV-protective glass.'
        }
      ]
    }
  ];

  const allFAQs = faqCategories.flatMap((category, categoryIndex) =>
    category.faqs.map((faq, faqIndex) => ({
      ...faq,
      categoryIndex,
      faqIndex,
      category: category.category
    }))
  );

  const filteredFAQs = searchQuery
    ? allFAQs.filter(
        faq =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFAQs;

  const toggleFAQ = (categoryIndex: number, faqIndex: number) => {
    const faqId = categoryIndex * 1000 + faqIndex;
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <HelpCircle className="h-4 w-4 mr-2" />
            Frequently Asked Questions
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">FAQ</h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Find quick answers to common questions about our artworks, orders, shipping, and more.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchQuery ? (
            /* Search Results */
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Search Results ({filteredFAQs.length} found)
              </h2>
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => {
                  const faqId = faq.categoryIndex * 1000 + faq.faqIndex;
                  const isOpen = openFAQ === faqId;
                  
                  return (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(faq.categoryIndex, faq.faqIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div>
                          <span className="text-xs text-blue-600 font-medium">{faq.category}</span>
                          <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Category View */
            <div className="space-y-12">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">{category.category}</h2>
                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => {
                      const faqId = categoryIndex * 1000 + faqIndex;
                      const isOpen = openFAQ === faqId;
                      
                      return (
                        <div key={faqIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
                          <button
                            onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                          >
                            <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-4">
                              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
            <p className="text-blue-100 mb-8">
              Can't find what you're looking for? Our customer support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </button>
              <a
                href="tel:+919837378157"
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
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