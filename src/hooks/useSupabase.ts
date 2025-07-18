import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        // Clear any stale session data
        supabase.auth.signOut();
      }
      setUser(session?.user ?? null);
      setLoading(false);
      // Ensure user profile exists for current session
      if (session?.user) {
        ensureUserProfile(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Handle token refresh errors
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.warn('Token refresh failed, signing out user');
          setUser(null);
          setLoading(false);
          return;
        }
        // Handle signed out event
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
          return;
        }
        setUser(session?.user ?? null);
        setLoading(false);
        // Ensure user profile exists for new session
        if (session?.user) {
          ensureUserProfile(session.user);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

function normalizeEmail(email: string | null | undefined): string | null {
  return email ? email.trim().toLowerCase() : null;
}

async function createUserProfile(user: User) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: normalizeEmail(user.email) // Always save normalized email
      });
    
    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error('Error creating user profile:', error);
    }
  } catch (err) {
    console.error('Error in createUserProfile:', err);
  }
}

async function ensureUserProfile(user: User) {
  try {
    // Check if profile exists
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    if (!data) {
      // Create profile if missing
      await createUserProfile(user);
    }
  } catch (err) {
    // Ignore errors
  }
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}`
    }
  });
  return { data, error };
}

export async function signInWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}`
    }
  });
  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        full_name: name
      }
    }
  });
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
}

export async function updateUserProfile(userId: string, updates: any, email?: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({ 
      id: userId,
      ...updates,
      ...(email ? { email: normalizeEmail(email) } : {}),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
}

export async function getUserProfileByEmail(email: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', normalizeEmail(email))
    .single();
  return { data, error };
}