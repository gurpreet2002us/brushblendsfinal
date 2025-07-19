import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, CartItem, WishlistItem, Artwork } from '../types';
import { mockArtworks } from '../data/mockData';
import { supabase } from '../lib/supabase';

interface AppState {
  user: User | null;
  cart: CartItem[];
  wishlist: WishlistItem[];
  artworks: Artwork[];
  isLoading: boolean;
  appliedCoupon: string | null;
  couponDiscount: number;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_TO_CART'; payload: Artwork }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'ADD_ARTWORK'; payload: Artwork }
  | { type: 'UPDATE_ARTWORK'; payload: Artwork }
  | { type: 'DELETE_ARTWORK'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_COUPON' };

const initialState: AppState = {
  user: null,
  cart: [],
  wishlist: [],
  artworks: mockArtworks,
  isLoading: false,
  appliedCoupon: null,
  couponDiscount: 0,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addToCart: (artwork: Artwork, quantity?: number) => Promise<{ error: any } | { error: null }>;
  removeFromCart: (artworkId: string) => Promise<void>;
  updateCartQuantity: (artworkId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  addToWishlist: (artworkId: string) => Promise<void>;
  removeFromWishlist: (artworkId: string) => Promise<void>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.artwork.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.artwork.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { artwork: action.payload, quantity: 1 }],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.artwork.id !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.artwork.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [], appliedCoupon: null, couponDiscount: 0 };
    case 'ADD_TO_WISHLIST':
      if (state.wishlist.some(item => item.artworkId === action.payload)) {
        return state;
      }
      return {
        ...state,
        wishlist: [...state.wishlist, { artworkId: action.payload, dateAdded: new Date().toISOString() }],
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.artworkId !== action.payload),
      };
    case 'ADD_ARTWORK':
      return {
        ...state,
        artworks: [...state.artworks, action.payload],
      };
    case 'UPDATE_ARTWORK':
      return {
        ...state,
        artworks: state.artworks.map(artwork =>
          artwork.id === action.payload.id ? action.payload : artwork
        ),
      };
    case 'DELETE_ARTWORK':
      return {
        ...state,
        artworks: state.artworks.filter(artwork => artwork.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'APPLY_COUPON':
      return {
        ...state,
        appliedCoupon: action.payload.code,
        couponDiscount: action.payload.discount,
      };
    case 'REMOVE_COUPON':
      return {
        ...state,
        appliedCoupon: null,
        couponDiscount: 0,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // --- CART HELPERS ---
  const addToCart = async (artwork: Artwork, quantity: number = 1) => {
    if (state.user) {
      // Logged in: update Supabase
      const { error } = await supabase
        .from('cart')
        .upsert({ user_id: state.user.id, artwork_id: artwork.id, quantity }, { onConflict: 'user_id,artwork_id', ignoreDuplicates: false });
      if (!error) dispatch({ type: 'ADD_TO_CART', payload: artwork });
      return { error };
    } else {
      // Guest: update context and localStorage
      dispatch({ type: 'ADD_TO_CART', payload: artwork });
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const existing = guestCart.find((item: any) => item.artwork.id === artwork.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        guestCart.push({ artwork, quantity });
      }
      localStorage.setItem('guest_cart', JSON.stringify(guestCart));
      window.dispatchEvent(new Event('cartUpdated'));
      return { error: null };
    }
  };

  const removeFromCart = async (artworkId: string) => {
    if (state.user) {
      await supabase.from('cart').delete().eq('user_id', state.user.id).eq('artwork_id', artworkId);
      dispatch({ type: 'REMOVE_FROM_CART', payload: artworkId });
    } else {
      dispatch({ type: 'REMOVE_FROM_CART', payload: artworkId });
      let guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      guestCart = guestCart.filter((item: any) => item.artwork.id !== artworkId);
      localStorage.setItem('guest_cart', JSON.stringify(guestCart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const updateCartQuantity = async (artworkId: string, quantity: number) => {
    if (state.user) {
      await supabase.from('cart').update({ quantity }).eq('user_id', state.user.id).eq('artwork_id', artworkId);
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: artworkId, quantity } });
    } else {
      let guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      guestCart = guestCart.map((item: any) => item.artwork.id === artworkId ? { ...item, quantity } : item);
      localStorage.setItem('guest_cart', JSON.stringify(guestCart));
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: artworkId, quantity } });
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const clearCart = async () => {
    if (state.user) {
      await supabase.from('cart').delete().eq('user_id', state.user.id);
      dispatch({ type: 'CLEAR_CART' });
    } else {
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem('guest_cart');
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  // --- WISHLIST HELPERS ---
  const addToWishlist = async (artworkId: string) => {
    if (state.user) {
      await supabase.from('wishlist').insert({ user_id: state.user.id, artwork_id: artworkId });
      dispatch({ type: 'ADD_TO_WISHLIST', payload: artworkId });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: artworkId });
      const guestWishlist = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
      if (!guestWishlist.includes(artworkId)) guestWishlist.push(artworkId);
      localStorage.setItem('guest_wishlist', JSON.stringify(guestWishlist));
      window.dispatchEvent(new Event('wishlistUpdated'));
    }
  };

  const removeFromWishlist = async (artworkId: string) => {
    if (state.user) {
      await supabase.from('wishlist').delete().eq('user_id', state.user.id).eq('artwork_id', artworkId);
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: artworkId });
    } else {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: artworkId });
      let guestWishlist = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
      guestWishlist = guestWishlist.filter((id: string) => id !== artworkId);
      localStorage.setItem('guest_wishlist', JSON.stringify(guestWishlist));
      window.dispatchEvent(new Event('wishlistUpdated'));
    }
  };

  // --- INIT: Load guest cart/wishlist on mount if not logged in ---
  React.useEffect(() => {
    if (!state.user) {
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      guestCart.forEach((item: any) => {
        for (let i = 0; i < item.quantity; i++) {
          dispatch({ type: 'ADD_TO_CART', payload: item.artwork });
        }
      });
      const guestWishlist = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
      guestWishlist.forEach((id: string) => dispatch({ type: 'ADD_TO_WISHLIST', payload: id }));
    }
  }, [state.user]);

  return (
    <AppContext.Provider value={{ state, dispatch, addToCart, removeFromCart, updateCartQuantity, clearCart, addToWishlist, removeFromWishlist }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}