import React from 'react';
import { Palette, Users, Award, Heart, Star, CheckCircle, Brush, Sparkles, Globe, Clock } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const stats = [
    { icon: Users, label: 'Happy Customers', value: '2,500+' },
    { icon: Palette, label: 'Artworks Created', value: '1,200+' },
    { icon: Award, label: 'Years of Excellence', value: '15+' },
    { icon: Globe, label: 'Cities Served', value: '50+' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion for Art',
      description: 'Every piece we create is infused with love and dedication to the craft of traditional Indian artistry.'
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description: 'We maintain the highest standards in materials and craftsmanship to ensure lasting beauty.'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond to exceed your expectations.'
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'While honoring tradition, we embrace modern techniques to create contemporary masterpieces.'
    }
  ];

  const team = [
    {
      name: 'Paramjeet',
      role: 'Founder',
      description: 'Fabric and Oil Painting specialist with over 20 years of experience in traditional Indian art forms.'
    },
    {
      name: 'Sukhwant',
      role: 'Co-founder',
      description: 'Oil and canvas painting expert specializing in classical and contemporary painting styles.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-4 h-4 bg-amber-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-20 right-20 w-6 h-6 bg-orange-400 rounded-full opacity-15 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-5 h-5 bg-yellow-400 rounded-full opacity-25 animate-pulse delay-500"></div>
          <div className="absolute bottom-10 right-10 w-3 h-3 bg-amber-500 rounded-full opacity-20 animate-pulse delay-1500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2 fill-current" />
              Crafting Beauty Since 2009
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> Brush n Blends</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We are passionate artisans dedicated to preserving and celebrating the rich heritage of Indian art 
              through exquisite handcrafted fabric paintings and oil masterpieces.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-amber-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                <Clock className="h-4 w-4 mr-2" />
                Our Journey
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                A Legacy of 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Artistic Excellence</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2009 by master artisans Paramjeet and Sukhwant, our gallery began as a small workshop 
                  in the heart of Rudrapur, Uttarakhand. What started as a passion project to preserve 
                  traditional Indian art forms has grown into a celebrated gallery known across the nation.
                </p>
                <p>
                  Our journey has been one of continuous learning and innovation. We've traveled across 
                  India, learning from master craftsmen, understanding regional techniques, and incorporating 
                  diverse artistic traditions into our work.
                </p>
                <p>
                  Today, we proudly serve art enthusiasts nationwide, bringing the beauty of handcrafted 
                  Indian art to homes and hearts everywhere. Each piece tells a story, carries tradition, 
                  and represents our commitment to artistic excellence.
                </p>
              </div>
              <button
                onClick={() => onNavigate('gallery')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Palette className="mr-2 h-5 w-5" />
                Explore Our Collection
              </button>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://telxrnjmmvhmmryfqxuo.supabase.co/storage/v1/object/public/images/artwork-images/1752061669851-ljh25tjnby.jpg?auto=compress&cs=tinysrgb&w=800"
                    alt="Traditional Art"
                    className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="bg-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-48 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-500">P</span>
                      </div>
                      <p className="text-gray-500 text-sm">Paramjeet</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-48 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-500">S</span>
                      </div>
                      <p className="text-gray-500 text-sm">Sukhwant</p>
                    </div>
                  </div>
                  <img
                    src="https://telxrnjmmvhmmryfqxuo.supabase.co/storage/v1/object/public/images/artwork-images/1752238361058-33e14i5jmyb.jpg?auto=compress&cs=tinysrgb&w=800"
                    alt="Artistic Process"
                    className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <Heart className="h-4 w-4 mr-2" />
              Our Values
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Drives Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values guide every brushstroke, every stitch, and every interaction with our customers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="group text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              <Users className="h-4 w-4 mr-2" />
              Meet Our Team
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">The Artists Behind the Magic</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our talented team of artisans brings decades of combined experience and passion to every creation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                  <div className="w-full h-64 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-amber-700">{member.name.charAt(0)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-amber-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-20 w-6 h-6 bg-white rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-20 left-20 w-5 h-5 bg-white rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-10 right-10 w-3 h-3 bg-white rounded-full animate-pulse delay-1500"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-8">
                <Brush className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                To preserve, celebrate, and share the rich heritage of Indian art with the world, 
                while creating beautiful pieces that bring joy, culture, and elegance to every home. 
                We believe art has the power to connect hearts, tell stories, and create lasting memories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onNavigate('gallery')}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Explore Our Art
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  Get in Touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}