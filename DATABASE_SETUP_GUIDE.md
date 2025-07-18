# Brush n Blends Database Setup Guide

## 🚀 Quick Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Wait for the project to be ready

### 2. Get Your Credentials
1. Go to Project Settings → API
2. Copy your Project URL
3. Copy your anon/public key

### 3. Configure Environment Variables
Create a `.env` file in your project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Database Migration
1. Go to your Supabase dashboard
2. Click on "SQL Editor"
3. Copy and paste the entire content from `supabase/migrations/create_complete_schema.sql`
4. Click "Run" to execute the migration

### 5. Configure Authentication
1. Go to Authentication → Settings
2. Enable Google OAuth (optional):
   - Add your domain to "Site URL"
   - Configure Google OAuth in "Auth Providers"
3. Disable email confirmation (for testing):
   - Go to Authentication → Settings
   - Turn off "Enable email confirmations"

### 6. Test Your Setup
1. Start your development server: `npm run dev`
2. Navigate to the "DB Test" page in the header
3. All tests should pass ✅

## 📊 Database Schema Overview

### Tables Created:
- **artworks** - Store all artwork information
- **user_profiles** - Extended user data
- **orders** - Customer orders
- **cart** - Shopping cart items
- **wishlist** - User wishlist
- **coupons** - Discount coupons
- **order_requests** - Out-of-stock order requests

### Sample Data Included:
- 12 sample artworks (fabric, oil, handcraft)
- 3 sample coupons (BB202510, WELCOME15, NEWYEAR25)
- Proper RLS policies for security

## 🔧 Testing Database Connection

### Method 1: Use Built-in Test Page
- Navigate to `/database-test` in your app
- Run all connectivity tests
- Check for any errors

### Method 2: Manual Testing
```javascript
// Test in browser console
import { supabase } from './src/lib/supabase';

// Test connection
const { data, error } = await supabase.from('artworks').select('*').limit(1);
console.log('Connection test:', { data, error });

// Test authentication
const { data: session } = await supabase.auth.getSession();
console.log('Auth test:', session);
```

### Method 3: Check Supabase Dashboard
1. Go to Table Editor in Supabase
2. Verify all tables are created
3. Check sample data is inserted
4. Test RLS policies

## 🛠️ Troubleshooting

### Common Issues:

**1. Environment Variables Not Loading**
- Restart your dev server after adding .env
- Check file is named exactly `.env` (not .env.txt)
- Verify variables start with `VITE_`

**2. Migration Fails**
- Run migration in smaller chunks
- Check for syntax errors
- Ensure you have proper permissions

**3. Authentication Not Working**
- Check Site URL in Supabase Auth settings
- Verify OAuth providers are configured
- Disable email confirmation for testing

**4. RLS Policies Blocking Access**
- Check user is authenticated
- Verify user has proper permissions
- Test with admin user

### Getting Help:
- Check Supabase logs in dashboard
- Use browser dev tools console
- Test individual queries in SQL editor

## 🎯 Features Enabled

✅ **Coupon System**: BB202510 gives 10% off
✅ **Database Integration**: All data persisted in Supabase
✅ **Authentication**: Google & email login
✅ **Cart & Wishlist**: Real-time sync with database
✅ **Order System**: Complete order flow with notifications
✅ **Out-of-Stock Orders**: Request form system
✅ **Admin Features**: User management and order tracking
✅ **Security**: Row Level Security (RLS) enabled

## 📱 WhatsApp Integration (Next Steps)

The order system includes placeholder WhatsApp notifications. To enable:
1. Sign up for WhatsApp Business API
2. Get API credentials
3. Replace console.log calls with actual API calls
4. Configure webhook endpoints

Your database is now ready for production! 🎉