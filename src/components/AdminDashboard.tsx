import React, { useState, useEffect } from 'react';
import { 
  Users, Package, ShoppingCart, TrendingUp, Plus, Edit, Trash2, 
  Save, X, Upload, Image as ImageIcon, Star, StarOff, Eye, Search,
  Filter, Grid, List, Calendar, DollarSign, Tag, Palette
} from 'lucide-react';
import { useSupabase, getUserProfileByEmail } from '../hooks/useSupabase';
import { useArtworks, createArtwork, updateArtwork, deleteArtwork } from '../hooks/useArtworks';
import { useOrders } from '../hooks/useOrders';
import { supabase } from '../lib/supabase';
import { Artwork } from '../types';
import ImageUploadModal from './ImageUploadModal';
//import { sendEmail, sendWhatsApp } from '../utils/notifications';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

interface DashboardStats {
  totalUsers: number;
  totalArtworks: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  topArtworks: any[];
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user } = useSupabase();
  const { artworks, loading: artworksLoading, refetch: refetchArtworks } = useArtworks();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalArtworks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topArtworks: []
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [orderRequests, setOrderRequests] = useState<any[]>([]);
  
  // Artwork management states
  const [showArtworkModal, setShowArtworkModal] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [artworkForm, setArtworkForm] = useState({
    title: '',
    description: '',
    price: '',
    medium: 'fabric' as 'fabric' | 'oil' | 'handcraft',
    category: '',
    style: '',
    dimensions: { width: '', height: '', unit: 'cm' as 'cm' | 'inches' },
    images: [] as string[],
    mainImageIndex: 0,
    stockCount: '',
    featured: false,
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMedium, setFilterMedium] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 1. Order Management: Add state for selected order and modal visibility
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderStatusUpdating, setOrderStatusUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  // 2. User Management: Add state for selected user and modal visibility
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userEditForm, setUserEditForm] = useState({ name: '', phone: '', is_admin: false });
  const [userUpdating, setUserUpdating] = useState(false);

  // 3. Coupon Management: Add state for selected coupon and modal visibility
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: '', discount_percentage: 0, active: true, valid_from: '', valid_until: '', usage_limit: null });
  const [couponUpdating, setCouponUpdating] = useState(false);

  // Add Payments tab state
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  // Sync selectedStatus with selectedOrder
  useEffect(() => {
    if (selectedOrder) {
      setSelectedStatus(selectedOrder.status);
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
    // Listen for orderCreated event to reload orders
    const handleOrderCreated = () => {
      loadDashboardData();
    };
    window.addEventListener('orderCreated', handleOrderCreated);
    return () => {
      window.removeEventListener('orderCreated', handleOrderCreated);
    };
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [usersRes, ordersRes, couponsRes, orderRequestsRes] = await Promise.all([
        supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('coupons').select('*').order('created_at', { ascending: false }),
        supabase.from('order_requests').select('*, artworks(title)').order('created_at', { ascending: false }),
      ]);
      setUsers(usersRes.data || []);
      setOrders(ordersRes.data || []);
      setCoupons(couponsRes.data || []);
      setOrderRequests(orderRequestsRes.data || []);

      // Now calculate stats
      const totalUsers = usersRes.data?.length || 0;
      const totalOrders = ordersRes.data?.length || 0;
      const totalRevenue = ordersRes.data?.reduce((sum, order) => sum + (order.total || 0), 0);
      setStats({
        totalUsers,
        totalArtworks: artworks.length, // from useArtworks
        totalOrders,
        totalRevenue,
        recentOrders: ordersRes.data?.slice(0, 5) || [],
        topArtworks: artworks.filter(a => a.featured).slice(0, 5),
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Loaded users:', data); // <-- Add this line

      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    }
  };

  const loadCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error loading coupons:', error);
      setCoupons([]);
    }
  };

  const loadStats = async () => {
    try {
      const totalUsers = users.length;
      const totalArtworks = artworks.length;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      setStats({
        totalUsers,
        totalArtworks,
        totalOrders,
        totalRevenue,
        recentOrders: orders.slice(0, 5),
        topArtworks: artworks.filter(a => a.featured).slice(0, 5)
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const resetArtworkForm = () => {
    setArtworkForm({
      title: '',
      description: '',
      price: '',
      medium: 'fabric',
      category: '',
      style: '',
      dimensions: { width: '', height: '', unit: 'cm' },
      images: [],
      mainImageIndex: 0,
      stockCount: '',
      featured: false,
      tags: []
    });
    setTagInput('');
    setEditingArtwork(null);
  };

  const handleEditArtwork = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setArtworkForm({
      title: artwork.title,
      description: artwork.description,
      price: artwork.price.toString(),
      medium: artwork.medium,
      category: artwork.category,
      style: artwork.style,
      dimensions: {
        width: artwork.dimensions.width.toString(),
        height: artwork.dimensions.height.toString(),
        unit: artwork.dimensions.unit
      },
      images: artwork.images,
      mainImageIndex: artwork.mainImageIndex || 0,
      stockCount: artwork.stockCount.toString(),
      featured: artwork.featured,
      tags: artwork.tags
    });
    setShowArtworkModal(true);
  };

  const handleSaveArtwork = async () => {
    try {
      if (!artworkForm.title || !artworkForm.price || !artworkForm.category) {
        alert('Please fill in all required fields');
        return;
      }

      if (artworkForm.images.length === 0) {
        alert('Please add at least one image');
        return;
      }

      const artworkData = {
        title: artworkForm.title,
        description: artworkForm.description,
        price: parseFloat(artworkForm.price),
        medium: artworkForm.medium,
        category: artworkForm.category,
        style: artworkForm.style,
        dimensions: {
          width: parseInt(artworkForm.dimensions.width) || 0,
          height: parseInt(artworkForm.dimensions.height) || 0,
          unit: artworkForm.dimensions.unit
        },
        images: artworkForm.images,
        mainImageIndex: artworkForm.mainImageIndex,
        inStock: parseInt(artworkForm.stockCount) > 0,
        stockCount: parseInt(artworkForm.stockCount) || 0,
        featured: artworkForm.featured,
        tags: artworkForm.tags
      };

      let result;
      if (editingArtwork) {
        result = await updateArtwork(editingArtwork.id, artworkData);
      } else {
        result = await createArtwork(artworkData);
      }

      if (result.error) {
        alert('Error saving artwork: ' + result.error.message);
        return;
      }

      alert('Artwork saved successfully!');
      setShowArtworkModal(false);
      resetArtworkForm();
      await refetchArtworks();
      await loadStats();
    } catch (error) {
      console.error('Error saving artwork:', error);
      alert('Error saving artwork. Please try again.');
    }
  };

  const handleDeleteArtwork = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;

    try {
      const { error } = await deleteArtwork(id);
      if (error) {
        alert('Error deleting artwork: ' + error.message);
        return;
      }

      alert('Artwork deleted successfully!');
      await refetchArtworks();
      await loadStats();
    } catch (error) {
      console.error('Error deleting artwork:', error);
      alert('Error deleting artwork. Please try again.');
    }
  };

  const handleImageSelect = (images: string[]) => {
    setArtworkForm(prev => ({
      ...prev,
      images,
      mainImageIndex: 0 // Reset to first image
    }));
  };

  const handleSetMainImage = (index: number) => {
    setArtworkForm(prev => ({
      ...prev,
      mainImageIndex: index
    }));
  };

  const handleRemoveImage = (index: number) => {
    setArtworkForm(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      const newMainIndex = prev.mainImageIndex >= index && prev.mainImageIndex > 0 
        ? prev.mainImageIndex - 1 
        : prev.mainImageIndex;
      
      return {
        ...prev,
        images: newImages,
        mainImageIndex: newMainIndex >= newImages.length ? 0 : newMainIndex
      };
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !artworkForm.tags.includes(tagInput.trim())) {
      setArtworkForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setArtworkForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Filter artworks based on search and filters
  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artwork.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artwork.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMedium = !filterMedium || artwork.medium === filterMedium;
    return matchesSearch && matchesMedium;
  });

  // Accept order request: create order and update request status
  const handleAcceptOrderRequest = async (req: any) => {
    try {
      // Debug: Log the email being used for lookup
      console.log('Looking up user by email:', req.email);
      const { data: userProfile, error: userError } = await getUserProfileByEmail(req.email);
      console.log('User profile lookup result:', userProfile, userError);
      if (userError || !userProfile) {
        alert('User not found for this email.');
        return;
      }
      // Fetch artwork details
      const { data: artwork, error: artworkError } = await supabase
        .from('artworks')
        .select('*')
        .eq('id', req.artwork_id)
        .single();
      if (artworkError || !artwork) {
        alert('Artwork not found.');
        return;
      }
      // Create order data
      const orderData = {
        user_id: userProfile.id,
        items: [{
          artwork_id: artwork.id,
          title: artwork.title,
          price: artwork.price,
          quantity: 1,
          image: artwork.images[0]
        }],
        subtotal: artwork.price,
        discount_amount: 0,
        coupon_code: null,
        shipping_cost: 0,
        gst_amount: 0,
        total: artwork.price,
        shipping_address: {
          name: req.name,
          email: req.email,
          phone: req.phone,
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India'
        },
        payment_method: 'manual',
        payment_status: 'confirmed',
        status: 'processing',
        customer_name: req.name,
        customer_email: req.email
      };
      // Insert order
      const { error: orderError } = await supabase
        .from('orders')
        .insert(orderData);
      if (orderError) {
        alert('Failed to create order: ' + orderError.message);
        return;
      }
      // Permanently delete the order request after accepting
      await supabase
        .from('order_requests')
        .delete()
        .eq('id', req.id);
      await loadDashboardData();
      await refetchArtworks();
      alert('Order accepted and created successfully!');
    } catch (err) {
      alert('Error accepting order request.');
      console.error(err);
    }
  };

  // Reject order request: update status
  const handleRejectOrderRequest = async (req: any) => {
    try {
      await supabase
        .from('order_requests')
        .delete()
        .eq('id', req.id);
      setOrderRequests(prev => prev.filter(r => r.id !== req.id));
      await loadDashboardData();
      alert('Order request rejected.');
    } catch (err) {
      alert('Error rejecting order request.');
      console.error(err);
    }
  };

  // Order Management: Eye icon click handler
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };
  // Order Management: Status change handler
  const handleOrderStatusChange = async (orderId, newStatus) => {
    setOrderStatusUpdating(true);
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    // Fetch the updated order and user info
    const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single();
    let userEmail = order?.customer_email;
    let userPhone = order?.shipping_address?.phone;
    // Fallback: try to get from user_profiles
    if (!userEmail || !userPhone) {
      const { data: userProfile } = await supabase.from('user_profiles').select('*').eq('id', order.user_id).single();
      if (!userEmail) userEmail = userProfile?.email;
      if (!userPhone) userPhone = userProfile?.phone;
    }
    // Email template
    if (userEmail) {
      await sendEmail({
        to: userEmail,
        subject: `Order ${order.id.slice(-6)} Status Update`,
        text: `Your order ${order.id.slice(-6)} status is now: ${newStatus}.`,
        html: `<p>Your order <b>${order.id.slice(-6)}</b> status is now: <b>${newStatus}</b>.</p>`,
      });
    }
    // WhatsApp template
    if (typeof userPhone === 'string' && userPhone.trim().length > 0) {
      await sendWhatsApp({
        to: userPhone,
        body: `Your order ${order.id.slice(-6)} status is now: ${newStatus}.`,
      });
    }
    await loadOrders();
    setOrderStatusUpdating(false);
    setShowOrderModal(false);
  };
  // User Management: Edit handler
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserEditForm({ name: user.name, phone: user.phone, is_admin: user.is_admin });
    setShowUserModal(true);
  };
  const handleSaveUser = async () => {
    setUserUpdating(true);
    await supabase.from('user_profiles').update(userEditForm).eq('id', selectedUser.id);
    await loadUsers();
    setUserUpdating(false);
    setShowUserModal(false);
  };
  // User Management: Delete handler
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await supabase.from('user_profiles').delete().eq('id', userId);
      await loadUsers();
    }
  };
  // Coupon Management: Add/Edit handler
  const handleEditCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setCouponForm({ ...coupon });
    setShowCouponModal(true);
  };
  const handleAddCoupon = () => {
    setSelectedCoupon(null);
    setCouponForm({ code: '', discount_percentage: 0, active: true, valid_from: '', valid_until: '', usage_limit: null });
    setShowCouponModal(true);
  };
  const handleSaveCoupon = async () => {
    setCouponUpdating(true);
    if (selectedCoupon) {
      await supabase.from('coupons').update(couponForm).eq('id', selectedCoupon.id);
    } else {
      await supabase.from('coupons').insert(couponForm);
    }
    await loadCoupons();
    setCouponUpdating(false);
    setShowCouponModal(false);
  };
  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      await supabase.from('coupons').delete().eq('id', couponId);
      await loadCoupons();
    }
  };

  // Fetch payments
  const loadPayments = async () => {
    setPaymentsLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      console.log('Payments fetched:', data, error); // Debug log
      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
      setPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  };

  // Load payments when Payments tab is active
  useEffect(() => {
    if (activeTab === 'payments') {
      loadPayments();
    }
  }, [activeTab]);

  const handleDeleteOrder = async (order: any) => {
    if (!order || !order.id) return;
    const confirmDelete = window.confirm(`Delete order #${String(order.id).slice(-6)}? This cannot be undone.`);
    if (!confirmDelete) return;
    try {
      setDeletingOrderId(order.id);
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', order.id);
      if (error) throw error;

      // Ensure state reflects DB
      await loadOrders();
      await loadStats();
      if (selectedOrder && selectedOrder.id === order.id) {
        setShowOrderModal(false);
      }
    } catch (e: any) {
      const message = e?.message || 'Failed to delete order.';
      alert(message);
      console.error('Delete order error:', e);
    } finally {
      setDeletingOrderId(null);
    }
  };

  if (loading || artworksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'artworks', label: 'Artworks', icon: Palette },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'order_requests', label: 'Order Requests', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'payments', label: 'Payments', icon: DollarSign },
  ];

  // In the AdminDashboard component, after loading users and orders, create a map of user_id to user name:
  const userIdToName = users.reduce((acc, user) => {
    acc[user.id] = user.name;
    return acc;
  }, {});

  const handleStatusDropdownChange = async (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    setUpdatingStatus(true);
    await supabase.from('orders').update({ status: newStatus }).eq('id', selectedOrder.id);
    setOrders(prev => prev.map(order => order.id === selectedOrder.id ? { ...order, status: newStatus } : order));
    setUpdatingStatus(false);
    setShowOrderModal(false);
  };

  // Find payment for each order by order.id
  const getPaymentReferenceId = (order) => {
    const payment = payments.find((p) => p.order_id === order.id);
    return payment
      ? payment.reference_id
      : order.payment_reference_id || '-';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your art gallery and business</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition" onClick={() => setActiveTab('users')} role="button" aria-label="Go to Users">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition" onClick={() => setActiveTab('artworks')} role="button" aria-label="Go to Artworks">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Artworks</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalArtworks}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition" onClick={() => setActiveTab('orders')} role="button" aria-label="Go to Orders">
                <div className="flex items-center">
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition" onClick={() => setActiveTab('payments')} role="button" aria-label="Go to Payments">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-amber-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                </div>
                <div className="p-6">
                  {stats.recentOrders.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No orders yet</p>
                  ) : (
                    <div className="space-y-4">
                      {stats.recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Order #{order.id.slice(-6)}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">₹{order.total}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Featured Artworks</h3>
                </div>
                <div className="p-6">
                  {stats.topArtworks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No featured artworks</p>
                  ) : (
                    <div className="space-y-4">
                      {stats.topArtworks.map((artwork) => (
                        <div key={artwork.id} className="flex items-center space-x-4">
                          <img
                            src={artwork.images[artwork.mainImageIndex || 0]}
                            alt={artwork.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{artwork.title}</p>
                            <p className="text-sm text-gray-600">₹{artwork.price}</p>
                          </div>
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                            Featured
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'artworks' && (
          <div className="space-y-6">
            {/* Artworks Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Artworks Management</h2>
                <p className="text-gray-600">{filteredArtworks.length} artworks total</p>
              </div>
              <button
                onClick={() => {
                  resetArtworkForm();
                  setShowArtworkModal(true);
                }}
                className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Artwork
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search artworks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={filterMedium}
                  onChange={(e) => setFilterMedium(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">All Mediums</option>
                  <option value="fabric">Fabric</option>
                  <option value="oil">Oil</option>
                  <option value="handcraft">Handcraft</option>
                </select>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Artworks Grid/List */}
            <div className="bg-white rounded-lg shadow">
              {filteredArtworks.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks found</h3>
                  <p className="text-gray-600">Get started by adding your first artwork.</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                  {filteredArtworks.map((artwork) => (
                    <div key={artwork.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={artwork.images[artwork.mainImageIndex || 0]}
                          alt={artwork.title}
                          className="w-full h-48 object-cover"
                        />
                        {artwork.featured && (
                          <div className="absolute top-2 left-2">
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            onClick={() => handleEditArtwork(artwork)}
                            className="p-1 bg-white rounded-full shadow hover:bg-gray-50"
                          >
                            <Edit className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteArtwork(artwork.id)}
                            className="p-1 bg-white rounded-full shadow hover:bg-gray-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{artwork.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{artwork.category}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">₹{artwork.price}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            artwork.stockCount > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {artwork.stockCount > 0 ? `${artwork.stockCount} in stock` : 'Out of stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredArtworks.map((artwork) => (
                    <div key={artwork.id} className="p-6 flex items-center space-x-4">
                      <img
                        src={artwork.images[artwork.mainImageIndex || 0]}
                        alt={artwork.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{artwork.title}</h3>
                          {artwork.featured && (
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{artwork.category} • {artwork.medium}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{artwork.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{artwork.price}</p>
                        <p className={`text-xs ${
                          artwork.stockCount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {artwork.stockCount > 0 ? `${artwork.stockCount} in stock` : 'Out of stock'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditArtwork(artwork)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArtwork(artwork.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600">Orders will appear here when customers make purchases.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Ref ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id.slice(-6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {userIdToName[order.user_id] || order.customer_name || order.user_id || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getPaymentReferenceId(order)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{order.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                            <button className="text-amber-600 hover:text-amber-900" onClick={() => handleViewOrder(order)} title="View">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteOrder(order)}
                              title="Delete"
                              disabled={deletingOrderId === order.id}
                            >
                              {deletingOrderId === order.id ? (
                                <span className="inline-block h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'order_requests' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Order Requests</h2>
            </div>
            <div className="p-6">
              {orderRequests.filter(req => req.status === 'pending').length === 0 ? (
                <div className="text-center py-12 text-gray-500">No order requests yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artwork</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orderRequests.filter(req => req.status === 'pending').map((req) => (
                        <tr key={req.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.artworks?.title || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.message || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.status || 'pending'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {req.status === 'pending' && (
                              <>
                                <button
                                  className="px-3 py-1 bg-green-600 text-white rounded mr-2 hover:bg-green-700"
                                  onClick={() => handleAcceptOrderRequest(req)}
                                >
                                  Accept
                                </button>
                                <button
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                  onClick={() => handleRejectOrderRequest(req)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
            </div>
            <div className="p-6">
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
                  <p className="text-gray-600">User profiles will appear here when people sign up.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name || 'No name'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.phone || 'No phone'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.is_admin ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-2" onClick={() => handleEditUser(user)}>Edit</button>
                            <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Coupons Management</h2>
            </div>
            <div className="p-6">
              {coupons.length === 0 ? (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons yet</h3>
                  <p className="text-gray-600">Create discount coupons to boost sales.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coupons.map((coupon) => (
                    <div key={coupon.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{coupon.code}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Discount: {coupon.discount_percentage}%</p>
                        <p>Used: {coupon.used_count}/{coupon.usage_limit || '∞'}</p>
                        <p>Valid until: {coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString() : 'No expiry'}</p>
                      </div>
                    </div>
                  ))}
                  <button className="bg-green-600 text-white px-3 py-1 rounded mr-2" onClick={handleAddCoupon}>Add Coupon</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
            </div>
            <div className="p-6">
              {paymentsLoading ? (
                <div className="text-center py-12 text-gray-500">Loading payments...</div>
              ) : payments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No payments found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.reference_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.order_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userIdToName[payment.customer_id] || payment.customer_id || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(payment.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Artwork Modal */}
      {showArtworkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}
                </h2>
                <button
                  onClick={() => setShowArtworkModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={artworkForm.title}
                      onChange={(e) => setArtworkForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter artwork title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={artworkForm.description}
                      onChange={(e) => setArtworkForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Describe the artwork"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                      <input
                        type="number"
                        value={artworkForm.price}
                        onChange={(e) => setArtworkForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
                      <input
                        type="number"
                        value={artworkForm.stockCount}
                        onChange={(e) => setArtworkForm(prev => ({ ...prev, stockCount: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medium *</label>
                      <select
                        value={artworkForm.medium}
                        onChange={(e) => setArtworkForm(prev => ({ ...prev, medium: e.target.value as any }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="fabric">Fabric</option>
                        <option value="oil">Oil</option>
                        <option value="handcraft">Handcraft</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <input
                        type="text"
                        value={artworkForm.category}
                        onChange={(e) => setArtworkForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="e.g., Landscape, Abstract"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                    <input
                      type="text"
                      value={artworkForm.style}
                      onChange={(e) => setArtworkForm(prev => ({ ...prev, style: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g., Contemporary, Traditional"
                    />
                  </div>

                  {/* Dimensions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        placeholder="Width"
                        value={artworkForm.dimensions.width}
                        onChange={(e) => setArtworkForm(prev => ({
                          ...prev,
                          dimensions: { ...prev.dimensions, width: e.target.value }
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Height"
                        value={artworkForm.dimensions.height}
                        onChange={(e) => setArtworkForm(prev => ({
                          ...prev,
                          dimensions: { ...prev.dimensions, height: e.target.value }
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <select
                        value={artworkForm.dimensions.unit}
                        onChange={(e) => setArtworkForm(prev => ({
                          ...prev,
                          dimensions: { ...prev.dimensions, unit: e.target.value as 'cm' | 'inches' }
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="cm">cm</option>
                        <option value="inches">inches</option>
                      </select>
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={artworkForm.featured}
                      onChange={(e) => setArtworkForm(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                      Featured artwork
                    </label>
                  </div>
                </div>

                {/* Right Column - Images and Tags */}
                <div className="space-y-4">
                  {/* Images Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {artworkForm.images.length === 0 ? (
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">No images selected</p>
                          <button
                            type="button"
                            onClick={() => setShowImageModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Select Images
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {artworkForm.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image}
                                  alt={`Artwork ${index + 1}`}
                                  className={`w-full h-24 object-cover rounded-lg border-2 ${
                                    index === artworkForm.mainImageIndex 
                                      ? 'border-amber-500' 
                                      : 'border-gray-200'
                                  }`}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => handleSetMainImage(index)}
                                      className="p-1 bg-white rounded-full hover:bg-gray-100"
                                      title="Set as main image"
                                    >
                                      {index === artworkForm.mainImageIndex ? (
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                      ) : (
                                        <StarOff className="h-4 w-4 text-gray-600" />
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImage(index)}
                                      className="p-1 bg-white rounded-full hover:bg-gray-100"
                                      title="Remove image"
                                    >
                                      <X className="h-4 w-4 text-red-600" />
                                    </button>
                                  </div>
                                </div>
                                {index === artworkForm.mainImageIndex && (
                                  <div className="absolute top-1 left-1">
                                    <span className="bg-amber-500 text-white text-xs px-1 py-0.5 rounded">
                                      Main
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowImageModal(true)}
                            className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Change Images
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Add a tag"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {artworkForm.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowArtworkModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveArtwork}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  {editingArtwork ? 'Update Artwork' : 'Create Artwork'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onSelectImages={handleImageSelect}
        selectedImages={artworkForm.images}
        multiple={true}
        title="Select Artwork Images"
      />

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order #{selectedOrder.id.slice(-6)} Details</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder)}
                    className="px-3 py-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg border border-red-200"
                    disabled={deletingOrderId === selectedOrder.id}
                    title="Delete Order"
                  >
                    {deletingOrderId === selectedOrder.id ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Close"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">Order ID:</p>
                  <p className="text-lg font-bold text-gray-900">{selectedOrder.id.slice(-6)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Customer:</p>
                  <p className="text-lg font-bold text-gray-900">{userIdToName[selectedOrder.user_id] || selectedOrder.customer_name || selectedOrder.user_id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Total:</p>
                  <p className="text-lg font-bold text-gray-900">₹{selectedOrder.total}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status:</p>
                  <select
                    value={selectedStatus}
                    onChange={handleStatusDropdownChange}
                    disabled={updatingStatus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Payment Status:</p>
                  <p className="text-lg font-bold text-gray-900">{selectedOrder.payment_status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Payment Method:</p>
                  <p className="text-lg font-bold text-gray-900">{selectedOrder.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Date:</p>
                  <p className="text-lg font-bold text-gray-900">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Shipping Address:</p>
                  {(() => {
                    const address = selectedOrder?.shipping_address || {};
                    return (
                      <p className="text-lg font-bold text-gray-900">
                        {address.name && <span>{address.name}, </span>}
                        {address.street && <span>{address.street}, </span>}
                        {address.city && <span>{address.city}, </span>}
                        {address.state && <span>{address.state}, </span>}
                        {address.zipCode && <span>{address.zipCode}, </span>}
                        {address.country && <span>{address.country}</span>}
                        {address.email && <span><br />Email: {address.email}</span>}
                        {address.phone && <span><br />Phone: {address.phone}</span>}
                      </p>
                    );
                  })()}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-lg font-semibold text-gray-900">₹{(selectedOrder.items || []).reduce((s: number, it: any) => s + (it.price * it.quantity), 0)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Discount</p>
                  <p className="text-lg font-semibold text-gray-900">₹{selectedOrder.discount_amount || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-lg font-semibold text-gray-900">₹{selectedOrder.shipping_cost || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">GST</p>
                  <p className="text-lg font-semibold text-gray-900">₹{selectedOrder.gst_amount || 0}</p>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Grand Total</p>
                  <p className="text-2xl font-bold text-gray-900">₹{selectedOrder.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={userEditForm.name ?? ''}
                    onChange={(e) => setUserEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={userEditForm.phone ?? ''}
                    onChange={(e) => setUserEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_admin"
                    checked={userEditForm.is_admin}
                    onChange={(e) => setUserEditForm(prev => ({ ...prev, is_admin: e.target.checked }))}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="is_admin" className="ml-2 text-sm text-gray-700">
                    Admin User
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  disabled={userUpdating}
                >
                  {userUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Add/Edit Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCoupon ? 'Edit Coupon' : 'Add New Coupon'}
                </h2>
                <button
                  onClick={() => setShowCouponModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input
                    type="text"
                    value={couponForm.code ?? ''}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., SUMMER2023"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage *</label>
                  <input
                    type="number"
                    value={couponForm.discount_percentage ?? ''}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={couponForm.active}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, active: e.target.checked }))}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                    Active Coupon
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={couponForm.valid_from ?? ''}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, valid_from: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={couponForm.valid_until ?? ''}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, valid_until: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={couponForm.usage_limit ?? ''}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, usage_limit: parseInt(e.target.value) || null }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0 or null for unlimited"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCouponModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCoupon}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  disabled={couponUpdating}
                >
                  {couponUpdating ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}