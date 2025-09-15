import React, { useState } from 'react';
import { X, Smartphone, QrCode, CreditCard, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { usePayment, PaymentData } from '../hooks/usePayment';
import { QRCodeCanvas } from "qrcode.react";

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentResult: any) => void;
  paymentData: PaymentData;
}

export default function UPIPaymentModal({ isOpen, onClose, onSuccess, paymentData }: UPIPaymentModalProps) {
  const { processing, processRazorpayPayment, processPhonePePayment, processUPIDeepLink } = usePayment();
  const [selectedMethod, setSelectedMethod] = useState<'razorpay' | 'phonepe' | 'upi-link' | 'manual'>('razorpay');
  const [upiId, setUpiId] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async () => {
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      let result;

      switch (selectedMethod) {
        case 'razorpay':
          result = await processRazorpayPayment(paymentData);
          break;
        case 'phonepe':
          result = await processPhonePePayment({ ...paymentData, upiId });
          break;
        case 'upi-link':
          result = await processUPIDeepLink(paymentData);
          break;
        case 'manual':
          // For manual UPI, show QR and wait for confirmation
          setShowQR(true);
          return;
        default:
          throw new Error('Invalid payment method');
      }

      if (result.success) {
        setPaymentStatus('success');
        setTimeout(() => {
          onSuccess({ ...result, method: selectedMethod });
        }, 2000);
      } else {
        setPaymentStatus('failed');
        setErrorMessage(result.error || 'Payment failed');
      }
    } catch (error) {
      setPaymentStatus('failed');
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  const handleManualConfirmation = () => {
    setPaymentStatus('success');
    setTimeout(() => {
      onSuccess({
        success: true,
        paymentId: `manual_${Date.now()}`,
        transactionId: paymentData.orderId,
        method: 'manual'
      });
    }, 1000);
  };

  const generateUPIQR = () => {
    const upiString = `upi://pay?pa=brushnblends@paytm&pn=Brush n Blends&am=${paymentData.amount}&cu=INR&tn=Order ${paymentData.orderId}`;
     //In a real implementation, you'd generate an actual QR code
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">UPI Payment</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Payment Amount */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Amount to Pay</p>
              <p className="text-3xl font-bold text-gray-900">₹{paymentData.amount}</p>
              <p className="text-sm text-gray-500">Order: {paymentData.orderId}</p>
            </div>
          </div>

          {paymentStatus === 'idle' && (
            <>
              {/* Payment Method Selection */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-900">Choose Payment Method</h3>
                
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={selectedMethod === 'razorpay'}
                    onChange={(e) => setSelectedMethod(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${selectedMethod === 'razorpay' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                    {selectedMethod === 'razorpay' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <span className="font-medium text-gray-900">Razorpay</span>
                      <p className="text-xs text-gray-500">UPI, Cards, Net Banking, Wallets</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="phonepe"
                    checked={selectedMethod === 'phonepe'}
                    onChange={(e) => setSelectedMethod(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${selectedMethod === 'phonepe' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                    {selectedMethod === 'phonepe' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                  </div>
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                      <span className="font-medium text-gray-900">PhonePe</span>
                      <p className="text-xs text-gray-500">Direct UPI payment</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi-link"
                    checked={selectedMethod === 'upi-link'}
                    onChange={(e) => setSelectedMethod(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${selectedMethod === 'upi-link' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                    {selectedMethod === 'upi-link' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                  </div>
                  <div className="flex items-center">
                    <Wallet className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <span className="font-medium text-gray-900">UPI Apps</span>
                      <p className="text-xs text-gray-500">Google Pay, Paytm, BHIM</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="manual"
                    checked={selectedMethod === 'manual'}
                    onChange={(e) => setSelectedMethod(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${selectedMethod === 'manual' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                    {selectedMethod === 'manual' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                  </div>
                  <div className="flex items-center">
                    <QrCode className="h-5 w-5 text-orange-600 mr-2" />
                    <div>
                      <span className="font-medium text-gray-900">Scan QR Code</span>
                      <p className="text-xs text-gray-500">Manual UPI payment</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* UPI ID Input for PhonePe */}
              {selectedMethod === 'phonepe' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@paytm"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={processing || (selectedMethod === 'phonepe' && !upiId)}
                className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : `Pay ₹${paymentData.amount}`}
              </button>
            </>
          )}

          {/* QR Code Display */}
          {showQR && (
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-4">Scan QR Code to Pay now</h3>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4 inline-block">
              <QRCodeCanvas
        value={`upi://pay?pa=gurpreet2002us@okicici&pn=Brush n Blends&am=${paymentData.amount}&cu=INR&tn=Order ${paymentData.orderId}`}
        size={200}
        level="H"
        includeMargin
      />
                
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with any UPI app to pay ₹{paymentData.amount}
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleManualConfirmation}
                  className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  I have completed the payment
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Back to payment methods
                </button>
              </div>
            </div>
          )}

          {/* Processing State */}
          {paymentStatus === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
              <p className="text-gray-600">Please wait while we process your payment...</p>
            </div>
          )}

          {/* Success State */}
          {paymentStatus === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600">Your payment has been processed successfully.</p>
            </div>
          )}

          {/* Error State */}
          {paymentStatus === 'failed' && (
            <div className="text-center py-8">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-red-600 mb-4">{errorMessage}</p>
              <button
                onClick={() => {
                  setPaymentStatus('idle');
                  setErrorMessage('');
                }}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span>Secure payment powered by industry-standard encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
