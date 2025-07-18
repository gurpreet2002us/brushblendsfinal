import React from 'react';
import { Ruler, Info, Package, Eye } from 'lucide-react';

interface SizeGuidePageProps {
  onNavigate: (page: string) => void;
}

export default function SizeGuidePage({ onNavigate }: SizeGuidePageProps) {
  const artworkSizes = [
    {
      category: 'Small Artworks',
      dimensions: '20-35 cm',
      description: 'Perfect for intimate spaces, side tables, or small wall areas',
      examples: ['Miniature paintings', 'Small fabric art', 'Decorative pieces'],
      spaces: ['Bedrooms', 'Bathrooms', 'Office desks', 'Hallways']
    },
    {
      category: 'Medium Artworks',
      dimensions: '35-60 cm',
      description: 'Ideal for living rooms, dining areas, and main wall displays',
      examples: ['Standard paintings', 'Medium fabric art', 'Wall hangings'],
      spaces: ['Living rooms', 'Dining rooms', 'Bedrooms', 'Study rooms']
    },
    {
      category: 'Large Artworks',
      dimensions: '60-100 cm',
      description: 'Statement pieces for spacious walls and focal points',
      examples: ['Large oil paintings', 'Feature wall art', 'Gallery pieces'],
      spaces: ['Main walls', 'Above sofas', 'Stairways', 'Reception areas']
    },
    {
      category: 'Extra Large',
      dimensions: '100+ cm',
      description: 'Grand statement pieces for large spaces and commercial areas',
      examples: ['Panoramic paintings', 'Multi-panel art', 'Custom murals'],
      spaces: ['Hotels', 'Offices', 'Large homes', 'Exhibition spaces']
    }
  ];

  const handcraftSizes = [
    {
      item: 'Sculptures',
      small: '10-20 cm',
      medium: '20-40 cm',
      large: '40+ cm',
      placement: 'Shelves, tables, floor displays'
    },
    {
      item: 'Vases & Pottery',
      small: '15-25 cm',
      medium: '25-45 cm',
      large: '45+ cm',
      placement: 'Tables, mantels, floor corners'
    },
    {
      item: 'Wall Hangings',
      small: '20-30 cm',
      medium: '30-50 cm',
      large: '50+ cm',
      placement: 'Accent walls, above furniture'
    },
    {
      item: 'Decorative Items',
      small: '5-15 cm',
      medium: '15-30 cm',
      large: '30+ cm',
      placement: 'Shelves, display cases, tables'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
            <Ruler className="h-4 w-4 mr-2" />
            Artwork Dimensions Guide
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Size Guide</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Find the perfect artwork size for your space. Our comprehensive guide helps you 
            choose the right dimensions for any room or setting.
          </p>
        </div>
      </section>

      {/* Artwork Size Guide */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Artwork Size Categories</h2>
            <p className="text-xl text-gray-600">
              Understanding artwork dimensions to make the perfect choice for your space
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {artworkSizes.map((size, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                    <Ruler className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{size.category}</h3>
                    <p className="text-indigo-600 font-semibold">{size.dimensions}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{size.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {size.examples.map((example, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Best for:</h4>
                    <div className="flex flex-wrap gap-2">
                      {size.spaces.map((space, idx) => (
                        <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                          {space}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Handcraft Items Size Guide */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Handcraft Items Size Guide</h2>
            <p className="text-xl text-gray-600">
              Dimensions for sculptures, pottery, and decorative handcraft items
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item Type</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Small</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Medium</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Large</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Best Placement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {handcraftSizes.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.item}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{item.small}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{item.medium}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{item.large}</td>
                      <td className="px-6 py-4 text-gray-600">{item.placement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Measurement Tips */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Measurement Tips</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <Eye className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Visual Guidelines</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li>• Artwork should be 2/3 the width of furniture below it</li>
                <li>• Hang artwork 57-60 inches from floor to center</li>
                <li>• Leave 6-8 inches between artwork and furniture</li>
                <li>• Group small pieces 2-3 inches apart</li>
                <li>• Consider ceiling height for proportion</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <Package className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Space Planning</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li>• Measure your wall space before purchasing</li>
                <li>• Consider room lighting and viewing angles</li>
                <li>• Account for door swings and traffic flow</li>
                <li>• Think about furniture placement changes</li>
                <li>• Use paper templates to visualize size</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-4">Need Help Choosing the Right Size?</h3>
            <p className="text-indigo-100 mb-8">
              Our art consultants can help you select the perfect artwork size for your space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Get Expert Advice
              </button>
              <button
                onClick={() => onNavigate('gallery')}
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition-all duration-200"
              >
                Browse Gallery
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}