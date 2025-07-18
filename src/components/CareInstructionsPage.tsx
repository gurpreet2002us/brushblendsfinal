import React from 'react';
import { Shield, Droplets, Sun, Wind, AlertTriangle, CheckCircle } from 'lucide-react';

interface CareInstructionsPageProps {
  onNavigate: (page: string) => void;
}

export default function CareInstructionsPage({ onNavigate }: CareInstructionsPageProps) {
  const fabricCare = [
    {
      icon: Droplets,
      title: 'Cleaning',
      dos: [
        'Dust gently with a soft, dry brush',
        'Use a vacuum with brush attachment on low setting',
        'Spot clean with mild soap and damp cloth',
        'Allow to air dry completely'
      ],
      donts: [
        'Never immerse in water',
        'Avoid harsh chemicals or bleach',
        'Don\'t use steam cleaners',
        'Never wring or twist the fabric'
      ]
    },
    {
      icon: Sun,
      title: 'Light Protection',
      dos: [
        'Display away from direct sunlight',
        'Use UV-filtering glass if framing',
        'Rotate artwork periodically',
        'Consider museum-quality lighting'
      ],
      donts: [
        'Avoid placing near windows',
        'Don\'t use harsh spotlights',
        'Avoid fluorescent lighting',
        'Never expose to direct UV rays'
      ]
    },
    {
      icon: Wind,
      title: 'Environment',
      dos: [
        'Maintain 45-55% humidity',
        'Keep temperature between 65-75°F',
        'Ensure good air circulation',
        'Use dehumidifiers if needed'
      ],
      donts: [
        'Avoid damp or humid areas',
        'Don\'t place near heating vents',
        'Avoid basements or attics',
        'Never store in plastic bags'
      ]
    }
  ];

  const oilPaintingCare = [
    {
      icon: Droplets,
      title: 'Cleaning',
      dos: [
        'Dust with a soft, natural bristle brush',
        'Use gentle, circular motions',
        'Clean frame separately',
        'Professional cleaning every 5-10 years'
      ],
      donts: [
        'Never use water or solvents',
        'Avoid commercial cleaners',
        'Don\'t touch the paint surface',
        'Never use paper towels or tissues'
      ]
    },
    {
      icon: Shield,
      title: 'Protection',
      dos: [
        'Frame with acid-free materials',
        'Use proper backing boards',
        'Install hanging hardware correctly',
        'Check mounting regularly'
      ],
      donts: [
        'Don\'t lean against walls unframed',
        'Avoid touching the painted surface',
        'Never stack paintings face-to-face',
        'Don\'t use adhesive tapes'
      ]
    }
  ];

  const handcraftCare = [
    {
      material: 'Brass & Metal',
      care: [
        'Polish with appropriate metal cleaner',
        'Dry thoroughly after cleaning',
        'Apply protective wax coating',
        'Store in dry environment'
      ],
      avoid: [
        'Abrasive cleaners',
        'Excessive moisture',
        'Direct contact with skin oils',
        'Harsh scrubbing'
      ]
    },
    {
      material: 'Wood',
      care: [
        'Dust with microfiber cloth',
        'Use wood-specific cleaners',
        'Apply wood conditioner periodically',
        'Maintain stable humidity'
      ],
      avoid: [
        'Water damage',
        'Direct sunlight',
        'Extreme temperature changes',
        'Chemical solvents'
      ]
    },
    {
      material: 'Ceramic & Pottery',
      care: [
        'Clean with mild soap and water',
        'Dry completely before storing',
        'Handle with clean hands',
        'Display on stable surfaces'
      ],
      avoid: [
        'Sudden temperature changes',
        'Dropping or impact',
        'Harsh detergents',
        'Microwave or dishwasher'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4 mr-2" />
            Artwork Preservation
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Care Instructions</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Proper care ensures your artwork remains beautiful for generations. 
            Follow our expert guidelines to preserve and protect your investment.
          </p>
        </div>
      </section>

      {/* Fabric Painting Care */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Fabric Painting Care</h2>
            <p className="text-xl text-gray-600">
              Special care for textile artworks with embroidery and beadwork
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {fabricCare.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Do's
                      </h4>
                      <ul className="space-y-2">
                        {section.dos.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Don'ts
                      </h4>
                      <ul className="space-y-2">
                        {section.donts.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <div className="w-2 h-2 bg-red-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Oil Painting Care */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Oil Painting Care</h2>
            <p className="text-xl text-gray-600">
              Preserving the beauty and integrity of oil paintings
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {oilPaintingCare.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Best Practices
                      </h4>
                      <ul className="space-y-2">
                        {section.dos.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Avoid These
                      </h4>
                      <ul className="space-y-2">
                        {section.donts.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <div className="w-2 h-2 bg-red-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Handcraft Care */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Handcraft Item Care</h2>
            <p className="text-xl text-gray-600">
              Material-specific care for sculptures, pottery, and decorative items
            </p>
          </div>
          
          <div className="space-y-8">
            {handcraftCare.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{item.material}</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Care Instructions
                    </h4>
                    <ul className="space-y-3">
                      {item.care.map((instruction, idx) => (
                        <li key={idx} className="text-gray-600 flex items-start">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-800 mb-4 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Things to Avoid
                    </h4>
                    <ul className="space-y-3">
                      {item.avoid.map((avoidItem, idx) => (
                        <li key={idx} className="text-gray-600 flex items-start">
                          <div className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          {avoidItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Care */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Emergency Care</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">If Damage Occurs</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Stop using/displaying the item immediately</li>
                  <li>• Document damage with photos</li>
                  <li>• Contact us within 24 hours</li>
                  <li>• Don't attempt DIY repairs</li>
                  <li>• Store in a safe, dry place</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Restoration</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• We work with certified art restorers</li>
                  <li>• Free damage assessment</li>
                  <li>• Detailed restoration quotes</li>
                  <li>• Insurance claim assistance</li>
                  <li>• Quality guarantee on repairs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-4">Need Care Advice?</h3>
            <p className="text-emerald-100 mb-8">
              Our art care specialists are here to help you preserve your precious artworks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Get Expert Advice
              </button>
              <a
                href="mailto:care@brushnblends.com"
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-emerald-600 transition-all duration-200"
              >
                care@brushnblends.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}