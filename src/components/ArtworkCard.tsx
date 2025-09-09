import React from 'react';
import { Heart, ShoppingCart, Eye, Clock, Send, X } from 'lucide-react';
import { Artwork } from '../types';
import { useApp } from '../context/AppContext';
import { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import ReactDOM from 'react-dom';

interface ArtworkCardProps {
  artwork: Artwork;
  onViewDetails: (id: string) => void;
  onNavigate?: (page: string) => void;
  onShowAuthModal: () => void;
}

export default function ArtworkCard({ artwork, onViewDetails, onNavigate, onShowAuthModal }: ArtworkCardProps) {
  const { state, addToCart, addToWishlist, removeFromWishlist } = useApp();
  const wishlist = state.wishlist.map(w => w.artworkId);
  const user = state.user;
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const { createOrderRequest } = useOrders();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Check for applied coupon in localStorage
  useEffect(() => {
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch (e) {
        localStorage.removeItem('appliedCoupon');
      }
    }
  }, []);

  useEffect(() => {
    if (showOrderModal) setAgreedToTerms(false);
  }, [showOrderModal]);

  const isInWishlist = wishlist.includes(artwork.id);
  // Calculate discounted price if coupon is applied
  const originalPrice = artwork.price;
  const discountedPrice = appliedCoupon ? originalPrice * (1 - appliedCoupon.discount / 100) : originalPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (artwork.stockCount > 0 && !isAddingToCart) {
      setIsAddingToCart(true);
      try {
        const result = await addToCart(artwork);
        if (result.error) {
          alert(result.error);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart');
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }
    try {
      if (isInWishlist) {
        await removeFromWishlist(artwork.id);
      } else {
        await addToWishlist(artwork.id);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const handleOrderRequest = async (e: React.FormEvent) => {
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
        setShowOrderModal(false);
        setOrderFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        alert('Error submitting order request. Please try againn.');
      }
    } catch (error) {
      console.error('Error submitting order request:', error);
      alert('Failed to submit order request. Please try again.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleOutOfStockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      if (onShowAuthModal) {
        onShowAuthModal();
      } else {
        alert('Please log in to request an order.');
      }
    } else {
      setShowOrderModal(true);
    }
  };

  const getMediumBadgeColor = () => {
    switch (artwork.medium) {
      case 'fabric':
        return 'bg-purple-100 text-purple-800';
      case 'oil':
        return 'bg-blue-100 text-blue-800';
      case 'handcraft':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMediumLabel = () => {
    switch (artwork.medium) {
      case 'fabric':
        return 'Fabric';
      case 'oil':
        return 'Oil';
      case 'handcraft':
        return 'Handcraft';
      default:
        return artwork.medium;
    }
  };

  // Get the main image (use mainImageIndex if available, otherwise first image)
  const mainImageIndex = artwork.mainImageIndex || 0;
  const mainImage = artwork.images[mainImageIndex] || artwork.images[0];

  return (
    <>
      <div className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        onClick={() => onViewDetails(artwork.id)}
        role="button"
        aria-label={`View details for ${artwork.title}`}
      >
        <div className="relative overflow-hidden">
          <img
            src={mainImage}
            alt={artwork.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/1568607/pexels-photo-1568607.jpeg?auto=compress&cs=tinysrgb&w=800';
            }}
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => onViewDetails(artwork.id)}
                className="p-2 bg-white rounded-full text-gray-800 hover:bg-amber-100 hover:text-amber-600 transition-colors duration-200"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-2 bg-white rounded-full transition-colors duration-200 ${
                  isInWishlist
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-800 hover:text-red-500'
                }`}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Medium badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMediumBadgeColor()}`}>
              {getMediumLabel()}
            </span>
          </div>

          {/* Featured badge */}
          {artwork.featured && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                Featured
              </span>
            </div>
          )}

          {/* Out of stock overlay */}
          {artwork.stockCount === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
            {artwork.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {artwork.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">{artwork.category}</span>
            <span className="text-sm text-gray-500">
              {artwork.dimensions?.width || 0} × {artwork.dimensions?.height || 0} {artwork.dimensions?.unit || 'cm'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {appliedCoupon ? (
                <div>
                  <span className="text-lg line-through text-gray-400">₹{originalPrice}</span>
                  <span className="text-2xl font-bold text-green-600 ml-2">₹{discountedPrice.toFixed(0)}</span>
                  <div className="text-xs text-green-600 font-medium">{appliedCoupon.discount}% OFF Applied!</div>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">₹{originalPrice}</span>
              )}
              <span className="text-xs text-gray-500">
                {artwork.stockCount > 0 ? `${artwork.stockCount} available` : 'Out of stock'}
              </span>
            </div>
            
            {artwork.stockCount > 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex items-center space-x-2 px-3 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors duration-200 text-sm disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
              </button>
            ) : (
              <button
                onClick={handleOutOfStockClick}
                className="flex items-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200 text-sm"
              >
                <Clock className="h-4 w-4" />
                <span>Available on Order</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Order Request Modal */}
      {showOrderModal && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Order Request</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900">{artwork.title}</h4>
                <p className="text-sm text-gray-600">₹{artwork.price}</p>
              </div>
              
              <p className="text-gray-600 mb-6 text-sm">
                This item is currently out of stock. Fill out the form below and we'll contact you when it becomes available or create a custom piece for you.
              </p>

              <form onSubmit={handleOrderRequest} className="space-y-4">
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
                    rows={3}
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
                    I agree to the <button type="button" className="underline text-amber-600 hover:text-amber-800" onClick={() => (onNavigate ? onNavigate('terms') : window.location.hash = '#/terms')}>Terms & Conditions</button>
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
        </div>,
        document.body
      )}
    </>
  );
}