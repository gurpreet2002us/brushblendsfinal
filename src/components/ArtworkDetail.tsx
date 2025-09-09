import React, { useState } from 'react';
import { ArrowLeft, Heart, ShoppingCart, Share2, Ruler, Calendar, Tag, Shield, Clock, Send, X, Eye, ZoomIn } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Artwork } from '../types';
import { useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useSupabase } from '../hooks/useSupabase';
import { mockArtworks } from '../data/mockData';

interface ArtworkDetailProps {
  artworkId: string;
  onNavigate: (page: string, id?: string) => void;
  artworks: Artwork[];
}

export default function ArtworkDetail({ artworkId, onNavigate, artworks }: ArtworkDetailProps) {
  const { state, addToCart, addToWishlist, removeFromWishlist } = useApp();
  const wishlist = state.wishlist.map(w => w.artworkId);
  const user = state.user;
  const { createOrderRequest } = useOrders();
  const { user: supabaseUser } = useSupabase();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Check for applied coupon in localStorage
  useEffect(() => {
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      setAppliedCoupon(JSON.parse(savedCoupon));
    }
  }, []);

  useEffect(() => {
    if (showOrderForm) setAgreedToTerms(false);
  }, [showOrderForm]);

  const artwork = artworks.find(a => a.id === artworkId) || mockArtworks.find(a => a.id === artworkId);
  
  if (!artwork) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Artwork not found</h2>
          <button
            onClick={() => onNavigate('gallery')}
            className="text-amber-600 hover:text-amber-700"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.includes(artwork.id);

  // Calculate discounted price if coupon is applied
  const originalPrice = artwork.price;
  const discountedPrice = appliedCoupon ? originalPrice * (1 - appliedCoupon.discount / 100) : originalPrice;
  
  // Set initial selected image to main image
  useEffect(() => {
    if (artwork.mainImageIndex !== undefined) {
      setSelectedImageIndex(artwork.mainImageIndex);
    }
  }, [artwork.mainImageIndex]);

  const handleAddToCart = async () => {
    if (artwork.stockCount > 0) {
      for (let i = 0; i < quantity; i++) {
        await addToCart(artwork);
      }
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }
    if (isInWishlist) {
      await removeFromWishlist(artwork.id);
    } else {
      await addToWishlist(artwork.id);
    }
  };

  const handleOrderFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOrder(true);
    try {
      const result = await createOrderRequest(artwork.id, {
        name: orderFormData.name,
        email: orderFormData.email,
        phone: orderFormData.phone,
        message: orderFormData.message
      });
      if (result && !result.error) {
        alert('Thank you for your order request! We will contact you within 24 hours to confirm your custom order.');
        setShowOrderForm(false);
        setOrderFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        alert('Error submitting order request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting order request:', error);
      alert('Error submitting order request. Please try again.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const relatedArtworks = artworks
    .filter(a => a.id !== artwork.id && (a.category === artwork.category || a.medium === artwork.medium))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('gallery')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Gallery
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
              <button
                onClick={() => setShowImageModal(true)}
                className="absolute top-4 left-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <img
                src={artwork.images[selectedImageIndex]}
                alt={artwork.title}
                className="w-full h-96 lg:h-[500px] object-cover cursor-zoom-in"
                onClick={() => setShowImageModal(true)}
              />
              {artwork.featured && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-amber-100 text-amber-800">
                    Featured
                  </span>
                </div>
              )}
              {artwork.stockCount === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-4 py-2 rounded-full text-lg font-medium">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
            
            {artwork.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {artwork.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                      selectedImageIndex === index ? 'border-amber-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${artwork.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  artwork.medium === 'fabric'
                    ? 'bg-purple-100 text-purple-800'
                    : artwork.medium === 'oil'
                    ? 'bg-blue-100 text-blue-800'
                    : artwork.medium === 'handcraft'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-pink-100 text-pink-800'
                }`}>
                  {artwork.medium === 'fabric' ? 'Fabric Painting' : artwork.medium === 'oil' ? 'Oil Painting' : artwork.medium === 'handcraft' ? 'Handcraft Item' : 'Skin Care'}
                </span>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isInWishlist
                      ? 'text-red-500 bg-red-50'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{artwork.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed">{artwork.description}</p>
            </div>

            {/* Price and Stock */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                {appliedCoupon ? (
                  <div>
                    <span className="text-2xl line-through text-gray-400">₹{originalPrice}</span>
                    <span className="text-3xl font-bold text-green-600 ml-2">₹{discountedPrice.toFixed(0)}</span>
                    <div className="text-sm text-green-600 font-medium">{appliedCoupon.discount}% OFF Applied!</div>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">₹{originalPrice}</span>
                )}
                <span className={`text-sm ${artwork.stockCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {artwork.stockCount > 0 ? `${artwork.stockCount} in stock` : 'Out of stock'}
                </span>
              </div>

              {artwork.stockCount > 0 && (
                <div className="flex items-center space-x-4 mb-6">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {Array.from({ length: Math.min(artwork.stockCount, 5) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {artwork.stockCount > 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowOrderForm(true)}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200"
                  >
                    <Clock className="h-5 w-5" />
                    <span>Available on Order</span>
                  </button>
                )}
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Artwork Details */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Artwork Details</h3>
              
              {/* Description */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 leading-relaxed">{artwork.description}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Ruler className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Dimensions</span>
                    <p className="font-medium text-gray-900">
                      {artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Category</span>
                    <p className="font-medium text-gray-900">{artwork.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Created</span>
                    <p className="font-medium text-gray-900">
                      {new Date(artwork.dateCreated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Style</span>
                    <p className="font-medium text-gray-900">{artwork.style}</p>
                  </div>
                </div>
              </div>

              {artwork.tags.length > 0 && (
                <div>
                  <span className="text-sm text-gray-500 block mb-2">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Product Information */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Medium & Technique</h4>
                  <p className="text-gray-600">
                    {artwork.medium === 'fabric' && 'Hand-painted fabric with embroidery and beadwork details. Each piece is unique and crafted with traditional techniques.'}
                    {artwork.medium === 'oil' && 'Oil on canvas using premium quality paints and brushes. Rich textures and vibrant colors that last for generations.'}
                    {artwork.medium === 'handcraft' && 'Handcrafted using traditional methods and premium materials. Each piece is unique and made by skilled artisans.'}
                    {artwork.medium === 'skin-care' && 'Natural ingredients, handcrafted in small batches. Gentle on skin and free from harsh chemicals.'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Care Instructions</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    {artwork.medium === 'fabric' && (
                      <>
                        <li>• Keep away from direct sunlight to prevent fading</li>
                        <li>• Dust gently with a soft, dry brush</li>
                        <li>• Frame with UV-protective glass for best preservation</li>
                        <li>• Avoid humid environments</li>
                      </>
                    )}
                    {artwork.medium === 'oil' && (
                      <>
                        <li>• Display away from direct sunlight and heat sources</li>
                        <li>• Clean with a soft, dry brush only</li>
                        <li>• Professional cleaning recommended every 5-10 years</li>
                        <li>• Maintain stable temperature and humidity</li>
                      </>
                    )}
                    {artwork.medium === 'handcraft' && (
                      <>
                        <li>• Handle with care to avoid damage</li>
                        <li>• Clean according to material-specific instructions</li>
                        <li>• Keep in a stable environment</li>
                        <li>• Avoid exposure to moisture and extreme temperatures</li>
                      </>
                    )}
                    {artwork.medium === 'skin-care' && (
                      <>
                        <li>• Store in a cool, dry place away from sunlight</li>
                        <li>• Perform a patch test before first use</li>
                        <li>• For external use only</li>
                        <li>• Use within 12 months of opening</li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Authenticity</h4>
                  <p className="text-gray-600 text-sm">
                    This artwork comes with a certificate of authenticity signed by the artist. 
                    Each piece is original and handcrafted in our studio in Rudrapur, Uttarakhand.
                  </p>
                </div>
              </div>
            </div>
            {/* Shipping & Returns */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Returns</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Free shipping on orders above ₹2000</li>
                <li>• Carefully packaged with protective materials</li>
                <li>• 7-day return policy for undamaged items</li>
                <li>• SMS and WhatsApp tracking updates</li>
                <li>• Insurance included for all artworks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Order Form Modal */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Order Request</h3>
                  <button
                    onClick={() => setShowOrderForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  This item is currently out of stock. Fill out the form below and we'll contact you when it becomes available or create a custom piece for you.
                </p>

                <form onSubmit={handleOrderFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={orderFormData.name}
                      onChange={(e) => setOrderFormData({...orderFormData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={orderFormData.email}
                      onChange={(e) => setOrderFormData({...orderFormData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={orderFormData.phone}
                      onChange={(e) => setOrderFormData({...orderFormData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      value={orderFormData.message}
                      onChange={(e) => setOrderFormData({...orderFormData, message: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Any specific requirements or questions..."
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={e => setAgreedToTerms(e.target.checked)}
                      required
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 mr-2"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 select-none">
                      I agree to the <button type="button" className="underline text-amber-600 hover:text-amber-800" onClick={() => (typeof onNavigate === 'function' ? onNavigate('terms') : window.location.hash = '#/terms')}>Terms & Conditions</button>
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingOrder || !agreedToTerms}
                    className="w-full flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingOrder ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Submit Order Request
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={artwork.images[selectedImageIndex]}
                alt={artwork.title}
                className="max-w-full max-h-full object-contain"
              />
              {artwork.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {artwork.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        selectedImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Related Artworks */}
        {relatedArtworks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Artworks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArtworks.map((relatedArtwork) => (
                <div
                  key={relatedArtwork.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => onNavigate('artwork', relatedArtwork.id)}
                >
                  <img
                    src={relatedArtwork.images[0]}
                    alt={relatedArtwork.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{relatedArtwork.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{relatedArtwork.category}</p>
                    <p className="text-lg font-bold text-gray-900">₹{relatedArtwork.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}