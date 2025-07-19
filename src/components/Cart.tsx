import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useSupabase } from '../hooks/useSupabase';
import { useCoupons } from '../hooks/useCoupons';

interface CartProps {
  onNavigate: (page: string) => void;
}

export default function Cart({ onNavigate }: CartProps) {
  const { state, updateCartQuantity, removeFromCart } = useApp();
  const cart = state.cart;
  const { user } = useSupabase();
  const { validateCoupon } = useCoupons();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);

  // Load applied coupon from localStorage
  useEffect(() => {
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      setAppliedCoupon(JSON.parse(savedCoupon));
    }
  }, []);

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeFromCart(id);
    } else {
      await updateCartQuantity(id, newQuantity);
    }
  };

  const removeItem = async (id: string) => {
    await removeFromCart(id);
  };

  const applyCoupon = async () => {
    setCouponError('');
    
    const result = await validateCoupon(couponCode);
    
    if (result.valid && result.coupon) {
      const couponData = { code: result.coupon.code, discount: result.coupon.discount };
      setAppliedCoupon(couponData);
      localStorage.setItem('appliedCoupon', JSON.stringify(couponData));
      setCouponCode('');
    } else {
      if (result.error === 'login_required') {
        setCouponError('Please log in to apply a coupon.');
      } else if (result.error) {
        setCouponError(result.error);
      }
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('appliedCoupon');
  };

  const subtotal = cart.reduce((total, item) => total + (item.artwork.price * item.quantity), 0);
  const couponDiscount = appliedCoupon ? subtotal * (appliedCoupon.discount / 100) : 0;
  const discountedSubtotal = subtotal - couponDiscount;
  const shipping = discountedSubtotal > 2000 ? 0 : 150; // Free shipping above ₹2000
  const gst = 0; //discountedSubtotal * 0.18; // 18% GST
  const total = discountedSubtotal + shipping + gst;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-lg text-gray-600 mb-8">
              Discover beautiful artworks and add them to your cart to get started.
            </p>
            <button
              onClick={() => onNavigate('gallery')}
              className="inline-flex items-center px-8 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors duration-200"
            >
              Browse Gallery
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.artwork.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.artwork.images[0]}
                      alt={item.artwork.title}
                      className="w-full sm:w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.artwork.title}
                        </h3>
                        <p className="text-sm text-gray-600">{item.artwork.category}</p>
                        <p className="text-sm text-gray-500">
                          {item.artwork.dimensions.width} × {item.artwork.dimensions.height} {item.artwork.dimensions.unit}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                          item.artwork.medium === 'fabric'
                            ? 'bg-purple-100 text-purple-800'
                            : item.artwork.medium === 'oil'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.artwork.medium === 'fabric' ? 'Fabric' : item.artwork.medium === 'oil' ? 'Oil' : 'Handcraft'}
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(item.artwork.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.artwork.id, item.quantity - 1)}
                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-medium text-gray-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.artwork.id, item.quantity + 1)}
                          disabled={item.quantity >= item.artwork.stockCount}
                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{(item.artwork.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">
                            ₹{item.artwork.price} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Coupon Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Apply Coupon Code</h3>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">{appliedCoupon.code}</span>
                      <span className="text-xs text-green-600 ml-2">({appliedCoupon.discount}% OFF)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors duration-200"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <div className="text-red-600 text-xs mt-2">{couponError}</div>
                    )}
                    <p className="text-xs text-gray-500">Try: BB202510 for 10% off</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Coupon Discount ({appliedCoupon.discount}%)</span>
                    <span className="font-medium text-green-600">-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-green-600">
                    🎉 You qualify for free shipping!
                  </p>
                )}
                {/*<div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium text-gray-900">₹{gst.toFixed(2)}</span>
                </div>*/}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                disabled={!user}
                className="w-full bg-amber-600 text-white font-semibold py-3 rounded-lg hover:bg-amber-700 transition-colors duration-200 mb-4"
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
              
              {!user && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 text-center">
                    Please <button onClick={() => onNavigate('login')} className="underline font-medium">login</button> to proceed with checkout
                  </p>
                </div>
              )}
              
              <button
                onClick={() => onNavigate('gallery')}
                className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Continue Shopping
              </button>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <span>🔒 Secure Checkout</span>
                  <span>📦 Safe Delivery</span>
                </div>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Free shipping on orders above ₹2000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
