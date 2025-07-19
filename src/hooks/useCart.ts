import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabase } from './useSupabase';
import { Artwork } from '../types';

export interface CartItem {
  id: string;
  artwork: Artwork;
  quantity: number;
}

// Guest cart storage key
const GUEST_CART_KEY = 'guest_cart';
const CART_COUNT_KEY = 'cart_count';

export function useCart() {
  const { user } = useSupabase();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Update cart count and save to localStorage for immediate header updates
  const updateCartCount = useCallback((newCart: CartItem[]) => {
    const count = newCart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
    localStorage.setItem(CART_COUNT_KEY, count.toString());
  }, []);

  // Load cart count from localStorage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem(CART_COUNT_KEY);
    if (savedCount) {
      setCartCount(parseInt(savedCount) || 0);
    }
  }, []);

  // Listen for cart count changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_COUNT_KEY && e.newValue !== null) {
        setCartCount(parseInt(e.newValue) || 0);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (user) {
      // User is logged in, fetch from database and merge guest cart
      mergeGuestCartAndFetch();
    } else {
      // User is not logged in, load from localStorage
      loadGuestCart();
    }
  }, [user]);

  // Load guest cart from localStorage
  const loadGuestCart = () => {
    try {
      const guestCart = localStorage.getItem(GUEST_CART_KEY);
      if (guestCart) {
        const parsedCart = JSON.parse(guestCart);
        setCart(parsedCart);
        updateCartCount(parsedCart);
      } else {
        setCart([]);
        updateCartCount([]);
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
      setCart([]);
      updateCartCount([]);
    }
  };

  // Save guest cart to localStorage
  const saveGuestCart = (cartItems: CartItem[]) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
      updateCartCount(cartItems);
      setCart([...cartItems]); // Force update for all hook instances
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  // Merge guest cart with user cart when user logs in
  const mergeGuestCartAndFetch = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // First, get guest cart
      const guestCart = localStorage.getItem(GUEST_CART_KEY);
      let guestCartItems: CartItem[] = [];
      
      if (guestCart) {
        try {
          guestCartItems = JSON.parse(guestCart);
        } catch (e) {
          console.error('Error parsing guest cart:', e);
        }
      }

      // Fetch user's existing cart from database
      await fetchCart();

      // Merge guest cart items into user cart
      if (guestCartItems.length > 0) {
        // Get current user cart to check for existing items
        const { data: existingCartItems } = await supabase
          .from('cart')
          .select('artwork_id, quantity')
          .eq('user_id', user.id);

        const existingArtworkIds = new Set(existingCartItems?.map(item => item.artwork_id) || []);

        for (const guestItem of guestCartItems) {
          try {
            // First, verify that the artwork exists in the database
            const { data: artworkExists, error: artworkCheckError } = await supabase
              .from('artworks')
              .select('id')
              .eq('id', guestItem.artwork.id)
              .single();

            if (artworkCheckError || !artworkExists) {
              console.warn(`Artwork ${guestItem.artwork.id} not found in database, skipping cart merge for this item`);
              continue; // Skip this item and continue with the next one
            }

            if (existingArtworkIds.has(guestItem.artwork.id)) {
              // Item already exists, update quantity by adding guest quantity
              const existingItem = existingCartItems?.find(item => item.artwork_id === guestItem.artwork.id);
              if (existingItem) {
                const { error } = await supabase
                  .from('cart')
                  .update({ quantity: existingItem.quantity + guestItem.quantity })
                  .eq('user_id', user.id)
                  .eq('artwork_id', guestItem.artwork.id);
                
                if (error) {
                  console.error('Error updating cart item during merge:', error);
                }
              }
            } else {
              // Item doesn't exist, insert new item
              const { error: insertError } = await supabase
                .from('cart')
                .insert({
                  user_id: user.id,
                  artwork_id: guestItem.artwork.id,
                  quantity: guestItem.quantity
                });
              
              if (insertError) {
                // Check if it's a duplicate key error (race condition)
                if (insertError.code === '23505') {
                  console.warn('Race condition detected during cart merge, attempting to update existing item');
                  
                  // Re-fetch the current quantity for this specific item
                  const { data: currentItem, error: fetchError } = await supabase
                    .from('cart')
                    .select('quantity')
                    .eq('user_id', user.id)
                    .eq('artwork_id', guestItem.artwork.id)
                    .single();
                  
                  if (!fetchError && currentItem) {
                    // Update the existing item by adding the guest quantity
                    const { error: updateError } = await supabase
                      .from('cart')
                      .update({ quantity: currentItem.quantity + guestItem.quantity })
                      .eq('user_id', user.id)
                      .eq('artwork_id', guestItem.artwork.id);
                    
                    if (updateError) {
                      console.error('Error updating cart item after race condition:', updateError);
                    }
                  }
                } else {
                  console.error('Error inserting cart item during merge:', insertError);
                }
              }
            }
          } catch (error) {
            console.error('Error merging cart item:', error);
            // Continue with other items even if one fails
          }
        }
        
        // Clear guest cart after merging
        localStorage.removeItem(GUEST_CART_KEY);
        
        // Fetch updated cart
        await fetchCart();
      }
    } catch (error) {
      console.error('Error merging guest cart:', error);
    } finally {
      setLoading(false);
    }
  };

  async function fetchCart() {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart')
        .select(`
          id,
          quantity,
          artwork_id,
          artworks (
            id,
            title,
            description,
            price,
            medium,
            category,
            style,
            dimensions,
            images,
            in_stock,
            stock_count,
            featured,
            tags,
            date_created
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems = (data || [])
        .filter((item: any) => item.artworks) // Filter out items with null artworks
        .map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          artwork: {
            id: item.artworks.id,
            title: item.artworks.title,
            description: item.artworks.description,
            price: item.artworks.price,
            medium: item.artworks.medium,
            category: item.artworks.category,
            style: item.artworks.style,
            dimensions: item.artworks.dimensions,
            images: item.artworks.images,
            inStock: item.artworks.in_stock,
            stockCount: item.artworks.stock_count,
            featured: item.artworks.featured,
            tags: item.artworks.tags,
            dateCreated: item.artworks.date_created
          }
        }));

      setCart(cartItems);
      updateCartCount(cartItems); // Update cart count after successful fetch
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(artwork: Artwork, quantity: number = 1, updateState: boolean = true) {
    if (user) {
      // User is logged in, save to database
      try {
        // Use upsert to handle both insert and update cases
        const { error: upsertError } = await supabase
          .from('cart')
          .upsert({
            user_id: user.id,
            artwork_id: artwork.id,
            quantity
          }, {
            onConflict: 'user_id,artwork_id',
            ignoreDuplicates: false
          });

        if (upsertError) throw upsertError;

        if (updateState) {
          await fetchCart();
        }
        return { error: null };
      } catch (err) {
        console.error('Error adding to cart:', err);
        return { error: err instanceof Error ? err.message : 'Failed to add item to cart' };
      }
    } else {
      // User is not logged in, save to localStorage
      try {
        const currentCart = [...cart];
        const existingItemIndex = currentCart.findIndex(item => item.artwork.id === artwork.id);

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          currentCart[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `guest_${Date.now()}_${artwork.id}`,
            artwork,
            quantity
          };
          currentCart.push(newItem);
        }

        setCart(currentCart);
        saveGuestCart(currentCart);
        return { error: null };
      } catch (err) {
        console.error('Error adding to guest cart:', err);
        return { error: 'Failed to add item to cart' };
      }
    }
  }

  async function updateCartQuantity(cartItemId: string, quantity: number) {
    if (user) {
      // User is logged in, update in database
      try {
        if (quantity <= 0) {
          return await removeFromCart(cartItemId);
        }

        const { error } = await supabase
          .from('cart')
          .update({ quantity })
          .eq('id', cartItemId)
          .eq('user_id', user.id);

        if (error) throw error;

        await fetchCart();
        return { error: null };
      } catch (err) {
        return { error: err instanceof Error ? err.message : 'An error occurred' };
      }
    } else {
      // User is not logged in, update in localStorage
      try {
        const currentCart = [...cart];
        const itemIndex = currentCart.findIndex(item => item.id === cartItemId);

        if (itemIndex >= 0) {
          if (quantity <= 0) {
            currentCart.splice(itemIndex, 1);
          } else {
            currentCart[itemIndex].quantity = quantity;
          }
          
          setCart(currentCart);
          saveGuestCart(currentCart);
        }
        return { error: null };
      } catch (err) {
        return { error: 'Failed to update cart' };
      }
    }
  }

  async function removeFromCart(cartItemId: string) {
    if (user) {
      // User is logged in, remove from database
      try {
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('id', cartItemId)
          .eq('user_id', user.id);

        if (error) throw error;

        await fetchCart();
        return { error: null };
      } catch (err) {
        return { error: err instanceof Error ? err.message : 'An error occurred' };
      }
    } else {
      // User is not logged in, remove from localStorage
      try {
        const currentCart = cart.filter(item => item.id !== cartItemId);
        setCart(currentCart);
        saveGuestCart(currentCart);
        return { error: null };
      } catch (err) {
        return { error: 'Failed to remove item from cart' };
      }
    }
  }

  async function clearCart() {
    if (user) {
      // User is logged in, clear database cart
      try {
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;

        setCart([]);
        updateCartCount([]); // Clear cart count on database clear
        return { error: null };
      } catch (err) {
        return { error: err instanceof Error ? err.message : 'An error occurred' };
      }
    } else {
      // User is not logged in, clear localStorage cart
      try {
        setCart([]);
        localStorage.removeItem(GUEST_CART_KEY);
        updateCartCount([]); // Clear cart count on localStorage clear
        return { error: null };
      } catch (err) {
        return { error: 'Failed to clear cart' };
      }
    }
  }

  // Get cart item count for header display
  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Force re-render when cart changes by updating a counter
  const [updateCounter, setUpdateCounter] = useState(0);
  
  useEffect(() => {
    setUpdateCounter(prev => prev + 1);
  }, [cart]);

  return {
    cart,
    loading,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    refetch: user ? fetchCart : loadGuestCart,
    getCartItemCount,
    updateCounter, // This will trigger re-renders in components using the cart
    cartLength: cart.length, // Additional helper for components
    cartCount // Expose cartCount to components
  };
}