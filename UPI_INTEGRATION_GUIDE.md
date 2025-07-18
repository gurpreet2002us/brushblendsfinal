# UPI Payment Integration Guide

## 🚀 Overview

This guide explains how to integrate UPI payments in your Brush n Blends application using multiple payment providers.

## 📱 Supported Payment Methods

### 1. Razorpay (Recommended)
- **Features**: UPI, Cards, Net Banking, Wallets
- **Setup**: Easy integration with comprehensive documentation
- **Cost**: 2% transaction fee
- **KYC**: Required for live payments

### 2. PhonePe
- **Features**: Direct UPI integration
- **Setup**: Requires merchant account setup
- **Cost**: Lower transaction fees
- **KYC**: Business verification required

### 3. UPI Deep Links
- **Features**: Direct UPI app integration
- **Setup**: No merchant account needed
- **Cost**: Free (direct bank transfer)
- **Limitation**: Manual verification required

### 4. Manual QR Code
- **Features**: Static QR code for UPI payments
- **Setup**: Generate QR with UPI string
- **Cost**: Free
- **Limitation**: Manual confirmation needed

## 🔧 Setup Instructions

### Step 1: Environment Variables

Add these to your `.env` file:

```env
# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_test_1234567890
VITE_RAZORPAY_KEY_SECRET=your_secret_key

# PhonePe
VITE_PHONEPE_MERCHANT_ID=PGTESTPAYUAT
VITE_PHONEPE_SALT_KEY=your_salt_key

# UPI Details
VITE_UPI_ID=brushnblends@paytm
VITE_UPI_NAME=Brush n Blends
```

### Step 2: Razorpay Setup

1. **Create Razorpay Account**:
   - Go to [razorpay.com](https://razorpay.com)
   - Sign up for merchant account
   - Complete KYC verification

2. **Get API Keys**:
   - Dashboard → Settings → API Keys
   - Generate Key ID and Key Secret
   - Use test keys for development

3. **Configure Webhooks**:
   - Dashboard → Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/razorpay-webhook`
   - Select events: `payment.captured`, `payment.failed`

### Step 3: PhonePe Setup

1. **Merchant Registration**:
   - Visit [phonepe.com/business](https://www.phonepe.com/business)
   - Complete merchant onboarding
   - Get Merchant ID and Salt Key

2. **API Integration**:
   - Use PhonePe PG SDK or REST APIs
   - Implement payment request creation
   - Handle payment status callbacks

### Step 4: Database Migration

Run the payment orders migration:

```sql
-- This creates the payment_orders table for tracking payments
-- Run this in your Supabase SQL editor
```

## 💳 Implementation Details

### Payment Flow

1. **Order Creation**: User proceeds to checkout
2. **Payment Method Selection**: Choose UPI provider
3. **Payment Processing**: Redirect to payment gateway
4. **Payment Verification**: Verify payment status
5. **Order Completion**: Update order status and notify user

### Security Considerations

- **Never expose secret keys** in frontend code
- **Verify payments server-side** using webhooks
- **Implement proper error handling** for failed payments
- **Use HTTPS** for all payment-related requests
- **Store minimal payment data** in your database

### Error Handling

```typescript
// Example error handling
try {
  const result = await processPayment(paymentData);
  if (result.success) {
    // Handle success
  } else {
    // Handle failure
    showError(result.error);
  }
} catch (error) {
  // Handle network/system errors
  showError('Payment system temporarily unavailable');
}
```

## 🧪 Testing

### Test Credentials

**Razorpay Test Cards**:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Test UPI IDs**:
- success@razorpay
- failure@razorpay

### Testing Checklist

- [ ] Payment success flow
- [ ] Payment failure handling
- [ ] Network error scenarios
- [ ] User cancellation
- [ ] Webhook processing
- [ ] Order status updates
- [ ] Email notifications

## 🚀 Going Live

### Pre-launch Checklist

1. **KYC Completion**: Complete merchant verification
2. **SSL Certificate**: Ensure HTTPS on production
3. **Webhook Security**: Verify webhook signatures
4. **Error Monitoring**: Set up error tracking
5. **Payment Reconciliation**: Implement daily reconciliation
6. **Customer Support**: Set up payment issue resolution

### Production Configuration

```env
# Production environment variables
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key
VITE_PHONEPE_MERCHANT_ID=your_live_merchant_id
```

## 📊 Analytics & Monitoring

### Key Metrics to Track

- Payment success rate
- Average transaction value
- Popular payment methods
- Failed payment reasons
- Customer drop-off points

### Monitoring Tools

- Razorpay Dashboard analytics
- Custom analytics in your admin panel
- Error tracking (Sentry, LogRocket)
- Performance monitoring

## 🔄 Webhook Implementation

### Razorpay Webhook Example

```typescript
// Backend webhook handler
app.post('/api/razorpay-webhook', (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
    
  if (signature === expectedSignature) {
    // Process webhook
    const { event, payload } = req.body;
    
    if (event === 'payment.captured') {
      // Update order status
      updateOrderStatus(payload.payment.entity.order_id, 'paid');
    }
  }
  
  res.status(200).send('OK');
});
```

## 🎯 Best Practices

1. **User Experience**:
   - Clear payment method selection
   - Loading states during processing
   - Proper error messages
   - Payment confirmation screens

2. **Security**:
   - Server-side payment verification
   - Secure webhook endpoints
   - PCI DSS compliance for card payments
   - Regular security audits

3. **Performance**:
   - Optimize payment page load times
   - Implement proper caching
   - Monitor payment gateway response times
   - Have fallback payment methods

4. **Customer Support**:
   - Clear refund policies
   - Payment issue resolution process
   - Transaction history for customers
   - Support contact information

## 🆘 Troubleshooting

### Common Issues

**Payment Gateway Not Loading**:
- Check API keys are correct
- Verify network connectivity
- Check browser console for errors

**Webhook Not Receiving**:
- Verify webhook URL is accessible
- Check webhook signature verification
- Ensure proper HTTP response codes

**Payment Verification Failing**:
- Check payment ID format
- Verify order ID matching
- Review webhook payload structure

### Support Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [PhonePe Developer Portal](https://developer.phonepe.com/)
- [UPI Specification](https://www.npci.org.in/what-we-do/upi)

Your UPI payment integration is now ready! 🎉

## 📞 Support

For integration support:
- Email: tech@brushnblends.com
- Documentation: Check the code comments
- Issues: Create GitHub issues for bugs