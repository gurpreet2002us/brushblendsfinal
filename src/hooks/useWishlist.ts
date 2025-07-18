import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabase } from './useSupabase';

export function useWishlist() {
  const { user } = useSupabase();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      // Load guest wishlist from localStorage
      loadGuestWishlist();
    }
  }, [user]);

  const loadGuestWishlist = () => {
    try {
      const guestWishlist = localStorage.getItem('guest_wishlist');
      if (guestWishlist) {
        setWishlist(JSON.parse(guestWishlist));
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error('Error loading guest wishlist:', error);
      setWishlist([]);
    }
  };

  const saveGuestWishlist = (wishlistItems: string[]) => {
    try {
      localStorage.setItem('guest_wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving guest wishlist:', error);
    }
  };

  async function fetchWishlist() {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlist')
        .select('artwork_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const dbWishlist = data.map(item => item.artwork_id);
      
      // Merge with guest wishlist if exists
      const guestWishlist = localStorage.getItem('guest_wishlist');
      if (guestWishlist) {
        try {
          const guestItems = JSON.parse(guestWishlist);
          const mergedWishlist = [...new Set([...dbWishlist, ...guestItems])];
          
          // Add guest items to database
          for (const artworkId of guestItems) {
            if (!dbWishlist.includes(artworkId)) {
              await addToWishlist(artworkId, false); // Don't update state yet
            }
          }
          
          // Clear guest wishlist
          localStorage.removeItem('guest_wishlist');
          
          // Fetch updated wishlist
          const { data: updatedData } = await supabase
            .from('wishlist')
            .select('artwork_id')
            .eq('user_id', user.id);
          
          setWishlist(updatedData?.map(item => item.artwork_id) || []);
        } catch (e) {
          console.error('Error merging guest wishlist:', e);
          setWishlist(dbWishlist);
        }
      } else {
        setWishlist(dbWishlist);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addToWishlist(artworkId: string, updateState: boolean = true) {
    if (user) {
      // User is logged in, save to database
      try {
        const { error } = await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            artwork_id: artworkId
          });

        if (error && error.code !== '23505') { // Ignore duplicate key errors
          throw error;
        }

        if (updateState) {
          setWishlist(prev => [...prev, artworkId]);
        }
        return { error: null };
      } catch (err) {
        console.error('Error adding to wishlist:', err);
        return { error: err instanceof Error ? err.message : 'An error occurred' };
      }
    } else {
      // User is not logged in, save to localStorage
      try {
        const currentWishlist = [...wishlist];
        if (!currentWishlist.includes(artworkId)) {
          currentWishlist.push(artworkId);
          setWishlist(currentWishlist);
          saveGuestWishlist(currentWishlist);
        }
        return { error: null };
      } catch (err) {
        return { error: 'Failed to add to wishlist' };
      }
    }
  }

  async function removeFromWishlist(artworkId: string) {
    if (user) {
      // User is logged in, remove from database
      try {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('artwork_id', artworkId);

        if (error) throw error;

        setWishlist(prev => prev.filter(id => id !== artworkId));
        return { error: null };
      } catch (err) {
        return { error: err instanceof Error ? err.message : 'An error occurred' };
      }
    } else {
      // User is not logged in, remove from localStorage
      try {
        const currentWishlist = wishlist.filter(id => id !== artworkId);
        setWishlist(currentWishlist);
        saveGuestWishlist(currentWishlist);
        return { error: null };
      } catch (err) {
        return { error: 'Failed to remove from wishlist' };
      }
    }
  }

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    refetch: user ? fetchWishlist : loadGuestWishlist
  };
}