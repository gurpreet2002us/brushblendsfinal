import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, CartItem, WishlistItem, Artwork } from '../types';
import { mockArtworks } from '../data/mockData';

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

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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