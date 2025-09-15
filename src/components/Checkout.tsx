import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Shield, Check, Smartphone, QrCode, AlertCircle, Plus, Minus, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { useCoupons } from '../hooks/useCoupons';
import { usePayment } from '../hooks/usePayment';
import UPIPaymentModal from './UPIPaymentModal';
import { useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useSupabase, getUserProfile } from '../hooks/useSupabase';


interface CheckoutProps {
  onNavigate: (page: string) => void;
}

export default function Checkout({ onNavigate }: CheckoutProps) {
  const { cart, updateCartQuantity, removeFromCart } = useCart();
  const { createOrder } = useOrders();
  const { validateCoupon } = useCoupons();
  const { createPaymentOrder } = usePayment();
  const { user } = useSupabase();

  // List of all Indian states
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi-qr');
  const [paymentReferenceId, setPaymentReferenceId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  
  const handleOpenPaymentModal = () => {
    setShowUPIModal(true);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.artwork.price * item.quantity), 0);
  const shippingCost = subtotal > 2000 ? 0 : 150;
  const gstAmount = 0; //(subtotal - couponDiscount) * 0.18;
  const total = subtotal - couponDiscount + shippingCost + gstAmount;

  const handleCouponApply = async () => {
    if (!couponCode.trim()) return;
    
    setCouponError('');
    try {
      const discountResult = await validateCoupon(couponCode);
      if (discountResult.valid && discountResult.coupon) {
        setCouponDiscount(discountResult.coupon.discount);
      } else {
        setCouponDiscount(0);
      }
    } catch (error) {
      setCouponError(error instanceof Error ? error.message : 'Invalid coupon code');
      setCouponDiscount(0);
    }
  };

  // Autofill shipping info from user profile
  useEffect(() => {
    async function autofillProfile() {
      if (user) {
        const { data, error } = await getUserProfile(user.id);
        if (!error && data) {
          setShippingInfo((prev) => ({
            ...prev,
            name: data?.name || user.user_metadata?.name || user.email?.split('@')[0] || '',
            email: user.email || '',
            phone: data?.phone || '',
            street: data?.address?.street || '',
            city: data?.address?.city || '',
            state: data?.address?.state || '',
            zipCode: data?.address?.zipCode || '',
          }));
        }
      }
    }
    autofillProfile();
    // eslint-disable-next-line
  }, [user]);

  // Validation helpers
  const validateEmail = (email: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email and phone
    const newErrors: { email?: string; phone?: string } = {};
    if (!validateEmail(shippingInfo.email)) newErrors.email = 'Invalid email address';
    if (!validatePhone(shippingInfo.phone)) newErrors.phone = 'Phone must be 10 digits';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    if (!paymentReferenceId.trim() || paymentReferenceId.length < 6) {
      alert('Please enter a valid payment reference ID (minimum 6 characters)');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const orderData = {
        items: cart.map(item => ({
          artwork_id: item.artwork.id,
          title: item.artwork.title,
          price: item.artwork.price,
          quantity: item.quantity,
          image: item.artwork.images[0]
        })),
        subtotal,
        discountAmount: couponDiscount,
        couponCode: couponCode || undefined,
        shippingCost: shippingCost,
        gstAmount: gstAmount,
        total,
        shippingAddress: shippingInfo,
        paymentMethod: paymentMethod,
        customerName: shippingInfo.name, // Add customer name for admin dashboard
        customerEmail: shippingInfo.email, // Add customer email for admin dashboard
        paymentReferenceId: paymentReferenceId, // Pass to order creation
        payment_reference_id: paymentReferenceId // For DB compatibility
      };

      await createOrder(orderData);
      alert('Order placed successfully!');
      onNavigate('dashboard');
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
// Early return if cart is empty
if (!cart || cart.length === 0) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <button
          onClick={() => onNavigate('gallery')}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => onNavigate('cart')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <textarea
                    required
                    rows={3}
                    value={shippingInfo.street}
                    onChange={(e) => setShippingInfo({...shippingInfo, street: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    required
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* UPI QR Payment Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment</h2>
              
              {/* UPI QR Code Payment */}
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-48 h-48 bg-white rounded-lg border-2 border-blue-200 flex items-center justify-center">
                    <QRCodeCanvas
  value={`upi://pay?pa=gurpreet2002us@okicici&pn=brushnblends&am=${total.toFixed(2)}&cu=INR`}
  size={192}
/>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan QR Code to Pay now</h3>
                <p className="text-2xl font-bold text-green-600 mb-4">₹{total.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code with any UPI app (PhonePe, Google Pay, Paytm, etc.)
                </p>

                {/* Or pay using a gateway */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleOpenPaymentModal}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Pay using Razorpay / PhonePe / UPI Link
                  </button>
                </div>
                
                {/* Payment Reference ID Input */}
                <div className="mt-6 max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Reference ID *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={6}
                    value={paymentReferenceId}
                    onChange={(e) => setPaymentReferenceId(e.target.value)}
                    placeholder="Enter UPI transaction reference ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the reference ID from your UPI app after payment
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.artwork.images[0]}
                      alt={item.artwork.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.artwork.title}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateCartQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 text-sm select-none">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 flex items-center text-xs"
                        >
                          <X className="w-3.5 h-3.5 mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{(item.artwork.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleCouponApply}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-600 text-xs mt-1">{couponError}</p>
                )}
                {couponDiscount > 0 && (
                  <p className="text-green-600 text-xs mt-1">
                    Coupon applied! Discount: ₹{couponDiscount.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
                </div>
                {/*<div className="flex justify-between text-sm">
                  <span>GST (18%)</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>*/}
              </div>

              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              {paymentReferenceId && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Reference ID:</strong> {paymentReferenceId}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <button
                  type="submit"
                  disabled={isProcessing || !paymentReferenceId.trim()}
                  className="w-full bg-amber-600 text-white py-4 rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `Complete Order - ₹${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showUPIModal && (
        <UPIPaymentModal
          isOpen={showUPIModal}
          onClose={() => setShowUPIModal(false)}
          onSuccess={(result: any) => {
            // Set method and reference from provider
            const ref = result.paymentId || result.transactionId || '';
            setPaymentReferenceId(ref);
            setPaymentMethod(result.method || 'gateway');
            setShowUPIModal(false);
          }}
          paymentData={{
            amount: total,
            currency: 'INR',
            orderId: `order_${Date.now()}`,
            customerInfo: {
              name: shippingInfo.name,
              email: shippingInfo.email,
              phone: shippingInfo.phone
            }
          }}
        />
      )}
    </div>
  );
}
