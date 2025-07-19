import React, { useState, useEffect } from 'react';
import { ArrowRight, Palette, Brush, Star, Users, Award, Truck, Shield, Heart, CheckCircle, Hammer, X, Tag } from 'lucide-react';
import { useArtworks } from '../hooks/useArtworks';
import ArtworkCard from './ArtworkCard';

interface HomePageProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { artworks, loading } = useArtworks();
  const featuredArtworks = artworks.filter(artwork => artwork.featured);
  const [showCouponToast, setShowCouponToast] = useState(true);

  useEffect(() => {
    // Auto-hide toast after 10 seconds
    const timer = setTimeout(() => {
      setShowCouponToast(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Coupon Toast */}
      {showCouponToast && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg shadow-lg max-w-sm animate-slide-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Tag className="h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Special Offer!</h4>
                <p className="text-xs opacity-90">Use code <span className="font-bold">BB202510</span> for 10% off</p>
              </div>
            </div>
            <button
              onClick={() => setShowCouponToast(false)}
              className="text-white hover:text-gray-200 ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-4 h-4 bg-amber-400 rounded-full opacity-20"></div>
          <div className="absolute top-20 right-20 w-6 h-6 bg-orange-400 rounded-full opacity-15"></div>
          <div className="absolute bottom-20 left-20 w-5 h-5 bg-yellow-400 rounded-full opacity-25"></div>
          <div className="absolute bottom-10 right-10 w-3 h-3 bg-amber-500 rounded-full opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  <Star className="h-4 w-4 mr-2 fill-current" />
                  India's Premier Art Gallery
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Welcome to
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> Brush n Blends</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover exquisite handcrafted fabric paintings, oil masterpieces, and unique artisanal items that transform spaces 
                  and touch hearts. Each piece tells a unique story of Indian artistry and tradition.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('gallery')}
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Palette className="mr-2 h-5 w-5" />
                  Explore Gallery
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center px-8 py-4 border-2 border-amber-600 text-amber-600 font-semibold rounded-xl hover:bg-amber-600 hover:text-white transition-all duration-300"
                >
                  Learn Our Story
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Authentic Handcrafted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="relative group">
                    <img
                      src="https://telxrnjmmvhmmryfqxuo.supabase.co/storage/v1/object/public/images/artwork-images/1752060951211-c4h7pwp6pzn.jpg?auto=compress&cs=tinysrgb&w=800"
                      alt="Featured Artwork 1"
                      className="rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">Customer Favorite</span>
                    </div>
                    <p className="text-xs text-gray-600">Loved by 500+ art enthusiasts</p>
                  </div>
                </div>
                <div className="space-y-6 mt-8">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-lg font-bold text-gray-900">4.9/5</span>
                    </div>
                    <p className="text-xs text-gray-600">Based on 1,200+ reviews</p>
                  </div>
                  <div className="relative group">
                    <img
                      src="https://telxrnjmmvhmmryfqxuo.supabase.co/storage/v1/object/public/images/artwork-images/1752239276038-rxll0didw8m.jpg?auto=compress&cs=tinysrgb&w=800"
                      alt="Featured Artwork 2"
                      className="rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Brush n Blends</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every piece in our collection is carefully selected for its quality, uniqueness, and emotional impact. 
              We bring you the finest Indian artistry with modern convenience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brush className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Handcrafted Excellence</h3>
              <p className="text-gray-600 leading-relaxed">Each artwork is meticulously handcrafted by skilled artisans with generations of expertise and attention to every detail.</p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">We use only the finest materials and time-tested techniques to ensure lasting beauty and durability.</p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Focused</h3>
              <p className="text-gray-600 leading-relaxed">Dedicated support team and satisfaction guarantee for every purchase. Your happiness is our priority.</p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Safe Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Secure packaging and reliable delivery nationwide to protect your precious artwork during transit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artworks Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4 mr-2 fill-current" />
              Curated Collection
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Featured Artworks</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular and recently added pieces, carefully curated for art enthusiasts 
              who appreciate authentic Indian craftsmanship.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : featuredArtworks.length > 0 ? (
              featuredArtworks.slice(0, 6).map((artwork) => (
                <div key={artwork.id} className="transform hover:scale-105 transition-transform duration-300">
                  <ArtworkCard
                    artwork={artwork}
                    onViewDetails={(id) => onNavigate('artwork', id)}
                    onNavigate={onNavigate}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Artworks</h3>
                <p className="text-gray-600">Check back soon for new featured pieces!</p>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <button
              onClick={() => onNavigate('gallery')}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View Complete Collection
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Shop by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our specialized collections of fabric paintings, oil masterpieces, and unique handcrafted items, 
              each representing different artistic traditions and techniques.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative cursor-pointer" onClick={() => { onNavigate('fabric'); window.scrollTo(0,0); }}>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://telxrnjmmvhmmryfqxuo.supabase.co/storage/v1/object/public/images/artwork-images/1752063861593-4rm83xh09zm.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Fabric Paintings"
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute bottom-8 left-8 text-white">
                  <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                    <Brush className="h-4 w-4 mr-2" />
                    Traditional Craft
                  </div>
                  <h3 className="text-3xl font-bold mb-3">Fabric Paintings</h3>
                  <p className="text-gray-200 mb-6 max-w-sm">Intricate textile art featuring exquisite embroidery, beadwork, and traditional Indian motifs.</p>
                  <span className="inline-flex items-center text-amber-300 font-semibold group-hover:text-white transition-colors">
                    Explore Collection
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
            
            <div className="group relative cursor-pointer" onClick={() => onNavigate('oil')}>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1570264/pexels-photo-1570264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Oil Paintings"
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute bottom-8 left-8 text-white">
                  <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                    <Palette className="h-4 w-4 mr-2" />
                    Classic Art
                  </div>
                  <h3 className="text-3xl font-bold mb-3">Oil Paintings</h3>
                  <p className="text-gray-200 mb-6 max-w-sm">Timeless oil masterpieces with rich colors, depth, and classical painting techniques.</p>
                  <span className="inline-flex items-center text-amber-300 font-semibold group-hover:text-white transition-colors">
                    Explore Collection
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </div>
              </div>
            </div>

            <div className="group relative cursor-pointer" onClick={() => onNavigate('handcraft')}>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://telxrnjmmvhmmryfqxuo.supabase.co/storage/v1/object/public/images/artwork-images/1752064597004-cucyqllh2jn.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Handcraft Items"
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute bottom-8 left-8 text-white">
                  <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                    <Hammer className="h-4 w-4 mr-2" />
                    Artisan Crafts
                  </div>
                  <h3 className="text-3xl font-bold mb-3">Handcraft Items</h3>
                  <p className="text-gray-200 mb-6 max-w-sm">Unique sculptures, carvings, and decorative pieces crafted by skilled artisans.</p>
                  <span className="inline-flex items-center text-amber-300 font-semibold group-hover:text-white transition-colors">
                    Explore Collection
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied customers who have transformed their spaces with our art</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"The fabric painting I purchased exceeded my expectations. The intricate details and vibrant colors bring so much life to my living room."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Priya Sharma</h4>
                  <p className="text-sm text-gray-600">Mumbai</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"Excellent quality and fast delivery. The oil painting is a masterpiece that has become the centerpiece of our home."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Rajesh Kumar</h4>
                  <p className="text-sm text-gray-600">Delhi</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"The handcrafted brass sculpture is absolutely stunning. Amazing customer service and beautiful artwork throughout their collection."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Anita Patel</h4>
                  <p className="text-sm text-gray-600">Bangalore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}