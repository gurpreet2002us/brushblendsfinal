import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabase } from './useSupabase';
import { sendEmail } from '../utils/email';
//import { sendEmail, sendWhatsApp } from '../utils/notifications';

export interface OrderData {
  items: any[];
  total: number;
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingCost: number;
  gstAmount: number;
  shippingAddress: any;
  paymentMethod: string;
  customerName?: string;
  customerEmail?: string;
  paymentReferenceId?: string;
  payment_reference_id?: string;
  paymentReferenceID?: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: any[];
  total: number;
  subtotal: number;
  discount_amount: number;
  coupon_code?: string;
  shipping_cost: number;
  gst_amount: number;
  status: string;
  shipping_address: any;
  payment_method?: string;
  payment_status: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export function useOrders() {
  const { user } = useSupabase();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  async function fetchUserOrders() {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createOrder(orderData: OrderData) {
    if (!user) return { error: 'User not authenticated' };

    try {
      console.log('Creating order with data:', orderData);
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          items: orderData.items,
          total: orderData.total,
          subtotal: orderData.subtotal,
          discount_amount: orderData.discountAmount,
          coupon_code: orderData.couponCode,
          shipping_cost: orderData.shippingCost,
          gst_amount: orderData.gstAmount,
          shipping_address: orderData.shippingAddress,
          payment_method: orderData.paymentMethod,
          payment_status: 'confirmed',
          status: 'processing',
          customer_name: orderData.customerName || orderData.shippingAddress?.name,
          customer_email: orderData.customerEmail || orderData.shippingAddress?.email,
          payment_reference_id: orderData.paymentReferenceId || orderData.payment_reference_id
        })
        .select()
        .single();
      console.log('Order insert result:', data, error);
      if (error) {
        alert('Order creation failed: ' + error.message);
        throw error;
      }
      // Send WhatsApp notification (placeholder)
      await sendOrderNotifications(data, orderData.shippingAddress);
      // Email and WhatsApp notifications
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      // User email
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: 'Order Confirmation',
          text: `Thank you for your order! Your order ID is ${data.id}.`,
          html: `<p>Thank you for your order! Your order ID is <b>${data.id}</b>.</p>`,
        });
      }
      // Admin email
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: 'New Order Placed',
          text: `A new order has been placed by ${user.user_metadata?.name || user.email}. Order ID: ${data.id}`,
          html: `<p>A new order has been placed by <b>${user.user_metadata?.name || user.email}</b>. Order ID: <b>${data.id}</b></p>`,
        });
      }
      // WhatsApp to user (if phone available)
      // (sendWhatsApp removed)
      // Refresh orders list
      await fetchUserOrders();
      // Notify admin dashboard (if needed)
      window.dispatchEvent(new Event('orderCreated'));
      // Notify user and admin via backend API
      if (data && user) {
        // User notification
        await fetch('/api/sendNotification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toEmail: user.email,
            toPhone: orderData.shippingAddress?.phone,
            subject: 'Order Confirmation',
            text: `Thank you for your order! Your order ID is ${data.id}.`,
            html: `<p>Thank you for your order! Your order ID is <b>${data.id}</b>.</p>`,
            whatsappBody: `Thank you for your order! Your order ID is ${data.id}.`,
          }),
        });
        // Admin notification
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        if (adminEmail) {
          await fetch('/api/sendNotification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              toEmail: adminEmail,
              subject: 'New Order Placed',
              text: `A new order has been placed by ${user.user_metadata?.name || user.email}. Order ID: ${data.id}`,
              html: `<p>A new order has been placed by <b>${user.user_metadata?.name || user.email}</b>. Order ID: <b>${data.id}</b></p>`,
            }),
          });
        }
      }
      // Insert payment record after order is created
      const paymentReferenceId = orderData.paymentReferenceId || orderData.payment_reference_id || orderData.paymentReferenceID || null;
      if (data) {
        console.log('Inserting payment:', {
          order_id: data.id,
          customer_id: user.id,
          amount: data.total,
          reference_id: paymentReferenceId,
          status: 'success'
        });
        const { error: paymentError } = await supabase.from('payments').insert({
          order_id: data.id,
          customer_id: user.id,
          amount: data.total,
          reference_id: paymentReferenceId,
          status: 'success'
        });
        if (paymentError) {
          console.error('Payment insert error:', paymentError);
        }
      }
      return { data, error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    } finally {
      setLoading(false);
    }
  }

  async function createOrderRequest(artworkId: string, requestData: {
    name: string;
    email: string;
    phone: string;
    message?: string;
    shipping_address?: string;
  }) {
    try {
      console.log('[createOrderRequest] Submitting order:', requestData);
      setLoading(true);
      const { data, error } = await supabase
        .from('order_requests')
        .insert({
          artwork_id: artworkId,
          name: requestData.name,
          email: requestData.email,
          phone: requestData.phone,
          message: requestData.message,
          shipping_address: requestData.shipping_address
        })
        .select()
        .single();
      console.log('[createOrderRequest] Supabase response:', { data, error });
      if (error) throw error;

      // Fetch artwork title for email
      let artworkTitle = '';
      try {
        const { data: artwork } = await supabase
          .from('artworks')
          .select('title')
          .eq('id', artworkId)
          .maybeSingle();
        artworkTitle = artwork?.title || '';
      } catch {}

      // Send email to user (non-fatal)
      try {
        if (data && data.email) {
          await sendEmail({
            to: data.email,
            subject: 'Order Request Received',
            text: `Thank you for your order request for '${artworkTitle}'. We will contact you soon.`,
            html: `<p>Thank you for your order request for <b>${artworkTitle}</b>. We will contact you soon.</p>`,
          });
        }
      } catch (e) {
        console.warn('User email notification failed (non-fatal):', e);
      }
      // Send email to admin (non-fatal)
      try {
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        if (adminEmail) {
          await sendEmail({
            to: adminEmail,
            subject: 'New Order Request',
            text: `A new order request has been submitted for '${artworkTitle}' by ${data.name} (${data.email}, ${data.phone}).`,
            html: `<p>A new order request has been submitted for <b>${artworkTitle}</b> by <b>${data.name}</b> (${data.email}, ${data.phone}).</p>`,
          });
        }
      } catch (e) {
        console.warn('Admin email notification failed (non-fatal):', e);
      }

      // Send WhatsApp notification for order request (existing logic)
      await sendOrderRequestNotifications(data, artworkId);

      return { data, error: null };
    } catch (err) {
      console.error('[createOrderRequest] Error:', err);
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    } finally {
      setLoading(false);
    }
  }

  return {
    orders,
    loading,
    createOrder,
    createOrderRequest,
    refetch: fetchUserOrders
  };
}

async function sendOrderNotifications(order: any, shippingAddress: any) {
  // Customer WhatsApp message
  const customerMessage = `🎨 Order Confirmed! 
Order ID: ${order.id}
Total: ₹${order.total}
We'll send you tracking details soon.
Thank you for choosing Brush n Blends! 🙏`;

  // Admin WhatsApp message
  const adminMessage = `🔔 New Order Received!
Order ID: ${order.id}
Customer: ${shippingAddress.name} 
Phone: ${shippingAddress.phone}
Total: ₹${order.total}
Items: ${order.items.length} item(s)`;

  // In a real implementation, you would integrate with WhatsApp Business API
  console.log('Customer notification:', customerMessage);
  console.log('Admin notification:', adminMessage);
  
  // For demo purposes, we'll show alerts
  // In production, replace with actual WhatsApp API calls
}

async function sendOrderRequestNotifications(orderRequest: any, artworkId: string) {
  // Get artwork details
  const { data: artwork } = await supabase
    .from('artworks')
    .select('title')
    .eq('id', artworkId)
    .single();

  const customerMessage = `🎨 Order Request Received!
Artwork: ${artwork?.title}
We'll contact you within 24 hours.
Thank you for your interest! 🙏`;

  const adminMessage = `🔔 New Order Request!
Artwork: ${artwork?.title}
Customer: ${orderRequest.name}
Phone: ${orderRequest.phone}
Email: ${orderRequest.email}`;

  console.log('Customer notification:', customerMessage);
  console.log('Admin notification:', adminMessage);
}
