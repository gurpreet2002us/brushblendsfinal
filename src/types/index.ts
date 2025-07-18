export interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  medium: 'fabric' | 'oil' | 'handcraft';
  category: string;
  style: string;
  dimensions: {
    width: number;
    height: number;
    unit: 'cm' | 'inches';
  };
  images: string[];
  inStock: boolean;
  stockCount: number;
  featured: boolean;
  tags: string[];
  dateCreated: string;
  mainImageIndex?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isAdmin: boolean;
}

export interface CartItem {
  artwork: Artwork;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderDate: string;
  trackingNumber?: string;
}

export interface WishlistItem {
  artworkId: string;
  dateAdded: string;
}