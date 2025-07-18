# Admin Login Setup Guide

## 🔐 How to Create Admin Access

### Method 1: Direct Database Update (Recommended)

1. **First, create a regular user account:**
   - Go to your app and sign up with email/password
   - Use an email like `admin@brushnblends.com`
   - Complete the signup process

2. **Make the user an admin in Supabase:**
   - Go to your Supabase Dashboard
   - Navigate to **Table Editor** → **user_profiles**
   - Find your user account
   - Edit the row and set `is_admin` to `true`
   - Save the changes

### Method 2: SQL Command

Run this SQL in your Supabase SQL Editor:

```sql
-- First, find your user ID
SELECT id, email FROM auth.users WHERE email = 'your-admin-email@example.com';

-- Then update the user profile to make them admin
UPDATE user_profiles 
SET is_admin = true 
WHERE id = 'your-user-id-here';

-- Or create admin profile if it doesn't exist
INSERT INTO user_profiles (id, name, is_admin)
VALUES ('your-user-id-here', 'Admin User', true)
ON CONFLICT (id) DO UPDATE SET is_admin = true;
```

### Method 3: Create Admin During Signup

You can also modify the signup process to automatically create an admin for specific emails:

```sql
-- Create a function to auto-assign admin role
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, is_admin)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', NEW.email),
    -- Make admin if email matches
    NEW.email IN ('admin@brushnblends.com', 'paramjeet@brushnblends.com', 'sukhwant@brushnblends.com')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🎯 Admin Features Available

Once you have admin access, you can:

### Access Admin Dashboard
- Login with your admin account
- Navigate to the admin dashboard (will appear in user menu)
- Or go directly to `/admin` page

### Admin Capabilities
- **Artwork Management**: Add, edit, delete artworks
- **Order Management**: View and update all orders
- **User Management**: View user profiles and orders
- **Coupon Management**: Create and manage discount coupons
- **Order Requests**: Handle out-of-stock order requests
- **Analytics**: View sales and user statistics

## 🔍 Testing Admin Access

### Verify Admin Status
```sql
-- Check if user is admin
SELECT u.email, p.name, p.is_admin 
FROM auth.users u
JOIN user_profiles p ON u.id = p.id
WHERE p.is_admin = true;
```

### Test Admin Features
1. Login with admin account
2. Check if "Admin Dashboard" appears in user menu
3. Navigate to admin section
4. Try creating/editing an artwork
5. View all orders and user data

## 🛡️ Security Notes

- Admin users have full access to all data
- RLS policies allow admins to bypass normal restrictions
- Keep admin credentials secure
- Consider using strong passwords for admin accounts
- Regularly audit admin user list

## 📧 Default Admin Credentials

For testing, you can create an admin with:
- **Email**: `admin@brushnblends.com`
- **Password**: `admin123` (change this!)
- **Name**: `Admin User`

## 🚨 Troubleshooting

**Admin menu not showing?**
- Check `is_admin` is `true` in user_profiles table
- Refresh the page after making database changes
- Check browser console for errors

**Can't access admin features?**
- Verify RLS policies are working
- Check user authentication status
- Ensure admin user has proper permissions

**Database errors?**
- Check if user_profiles record exists
- Verify foreign key relationships
- Test with SQL queries first

Your admin system is now ready! 🎉