import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface PaymentData {
  amount: number;
  currency: string;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  upiId?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  error?: string;
}

export function usePayment() {
  const [processing, setProcessing] = useState(false);

  // Razorpay UPI Payment
  const processRazorpayPayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
    return new Promise((resolve) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Replace with your Razorpay key
        amount: paymentData.amount * 100, // Amount in paise
        currency: paymentData.currency,
        name: 'Brush n Blends',
        description: 'Art Purchase',
        order_id: paymentData.orderId,
        image: '/brushnblends-logo.png',
        prefill: {
          name: paymentData.customerInfo.name,
          email: paymentData.customerInfo.email,
          contact: paymentData.customerInfo.phone,
        },
        theme: {
          color: '#d97706'
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },
        handler: function (response: any) {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            transactionId: response.razorpay_order_id
          });
        },
        modal: {
          ondismiss: function () {
            resolve({
              success: false,
              error: 'Payment cancelled by user'
            });
          }
        }
      };

      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      script.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to load payment gateway'
        });
      };
      document.body.appendChild(script);
    });
  };

  // PhonePe UPI Payment
  const processPhonePePayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
    try {
      setProcessing(true);

      // Create PhonePe payment request
      const paymentRequest = {
        merchantId: import.meta.env.VITE_PHONEPE_MERCHANT_ID,
        merchantTransactionId: paymentData.orderId,
        merchantUserId: paymentData.customerInfo.email,
        amount: paymentData.amount * 100, // Amount in paise
        redirectUrl: `${window.location.origin}/payment-success`,
        redirectMode: 'POST',
        callbackUrl: `${window.location.origin}/api/phonepe-callback`,
        mobileNumber: paymentData.customerInfo.phone,
        paymentInstrument: {
          type: 'UPI_COLLECT',
          vpa: paymentData.upiId
        }
      };

      // In a real implementation, you would send this to your backend
      // which would create the PhonePe payment request
      console.log('PhonePe payment request:', paymentRequest);

      // For demo purposes, simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        paymentId: `phonepe_${Date.now()}`,
        transactionId: paymentData.orderId
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    } finally {
      setProcessing(false);
    }
  };

  // UPI Deep Link Payment
  const processUPIDeepLink = async (paymentData: PaymentData): Promise<PaymentResult> => {
    try {
      const upiUrl = `upi://pay?pa=brushnblends@paytm&pn=Brush n Blends&am=${paymentData.amount}&cu=INR&tn=Order ${paymentData.orderId}`;
      
      // Open UPI app
      window.location.href = upiUrl;
      
      // For demo purposes, return success after a delay
      // In real implementation, you'd verify payment status via webhook
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return {
        success: true,
        paymentId: `upi_${Date.now()}`,
        transactionId: paymentData.orderId
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to open UPI app'
      };
    }
  };

  // Paytm UPI Payment
  const processPaytmPayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
    try {
      setProcessing(true);

      // Create Paytm payment configuration
      const paytmConfig = {
        root: '',
        flow: 'DEFAULT',
        data: {
          orderId: paymentData.orderId,
          token: 'PAYTM_TOKEN', // This should come from your backend
          tokenType: 'TXN_TOKEN',
          amount: paymentData.amount.toString(),
          userDetail: {
            mobileNo: paymentData.customerInfo.phone,
            email: paymentData.customerInfo.email
          }
        },
        handler: {
          notifyMerchant: function(eventName: string, data: any) {
            if (eventName === 'APP_CLOSED') {
              return {
                success: false,
                error: 'Payment cancelled'
              };
            }
          }
        }
      };

      // Load Paytm script and process payment
      // This is a simplified version - in production, you'd need proper Paytm integration
      console.log('Paytm payment config:', paytmConfig);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        paymentId: `paytm_${Date.now()}`,
        transactionId: paymentData.orderId
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    } finally {
      setProcessing(false);
    }
  };

  // Create order in backend before payment
  const createPaymentOrder = async (amount: number): Promise<{ orderId: string; error?: string }> => {
    try {
      // In a real implementation, this would call your backend API
      // to create an order with the payment provider
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      // Store order in database
      const { error } = await supabase
        .from('payment_orders')
        .insert({
          order_id: orderId,
          amount: amount,
          currency: 'INR',
          status: 'created'
        });

      if (error) {
        return { orderId: '', error: error.message };
      }

      return { orderId };
    } catch (error) {
      return { 
        orderId: '', 
        error: error instanceof Error ? error.message : 'Failed to create order' 
      };
    }
  };

  // Verify payment status
  const verifyPayment = async (paymentId: string, orderId: string): Promise<boolean> => {
    try {
      // In a real implementation, this would verify the payment with the provider
      // and update the order status in your database
      
      const { error } = await supabase
        .from('payment_orders')
        .update({
          payment_id: paymentId,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      return !error;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  };

  return {
    processing,
    processRazorpayPayment,
    processPhonePePayment,
    processUPIDeepLink,
    processPaytmPayment,
    createPaymentOrder,
    verifyPayment
  };
}