import React, { useState } from 'react';
import { Search, ShoppingCart, Heart, User, Menu, X, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useArtworks } from '../hooks/useArtworks';
import { useEffect, useMemo } from 'react';
import Logo from './Logo';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, id?: string) => void;
  onLogout: () => void;
  user: any;
  userProfile: any;
}

export default function Header({ currentPage, onNavigate, onLogout, user, userProfile }: HeaderProps) {
  const { state } = useApp();
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = state.wishlist.length;
  const { artworks } = useArtworks();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [_, setForceUpdate] = useState(0);

  useEffect(() => {
    setForceUpdate(f => f + 1);
  }, [cartCount, wishlistCount]);

  useEffect(() => {
    const handleUpdate = () => setForceUpdate(f => f + 1);
    window.addEventListener('cartUpdated', handleUpdate);
    window.addEventListener('wishlistUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleUpdate);
      window.removeEventListener('wishlistUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Use cartCount from useCart hook for real-time updates
  const navItems = [
    { id: 'home', label: 'Home' },
      { id: 'about', label: 'About' },
    { id: 'gallery', label: 'Shop' },
    { id: 'fabric', label: 'Fabric Paintings' },
    { id: 'oil', label: 'Oil Paintings' },
    { id: 'handcraft', label: 'Handcraft Items' }, 
    { id: 'skin-care', label: 'Skin Care' },
    { id: 'contact', label: 'Contact' },
  ];

  // Search functionality
  const searchResults = searchQuery.trim() 
    ? artworks.filter(artwork =>
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  };

  const handleSearchResultClick = (artworkId: string) => {
    setSearchQuery('');
    setShowSearchResults(false);
    onNavigate('artwork', artworkId);
  };

  const handleUserMenuClick = () => {
    if (!user) {
      onNavigate('login');
    } else {
      setShowUserMenu(!showUserMenu);
    }
  };

  const handleUserAction = (action: string) => {
    setShowUserMenu(false);
    if (action === 'logout') {
      onLogout();
    } else {
      onNavigate(action);
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <Logo size="md" variant="dark" />
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-50">
                  {searchResults.map((artwork) => (
                    <div
                      key={artwork.id}
                      onClick={() => handleSearchResultClick(artwork.id)}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <img
                        src={artwork.images[0]}
                        alt={artwork.title}
                        className="w-12 h-12 object-cover rounded-lg mr-3"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{artwork.title}</h4>
                        <p className="text-xs text-gray-600">{artwork.category}</p>
                        <p className="text-sm font-semibold text-amber-600">₹{artwork.price}</p>
                      </div>
                    </div>
                  ))}
                  {searchQuery.trim() && (
                    <div className="p-3 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchQuery('');
                          onNavigate('gallery');
                        }}
                        className="text-sm text-amber-600 hover:text-amber-700"
                      >
                        View all results in gallery →
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {showSearchResults && searchQuery.trim() && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-4 z-50">
                  <p className="text-gray-600 text-sm">No artworks found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-700 hover:text-amber-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <button
              onClick={() => user ? onNavigate('profile') : alert('Please login to view wishlist')}
              className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={handleUserMenuClick}
                className="p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
              >
                <User className="h-5 w-5" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{userProfile?.name || user.email}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleUserAction('profile')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </button>
                  {userProfile?.is_admin && (
                    <button
                      onClick={() => handleUserAction('admin')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => handleUserAction('logout')}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search artworks..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            
            {/* Mobile Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                {searchResults.map((artwork) => (
                  <div
                    key={artwork.id}
                    onClick={() => handleSearchResultClick(artwork.id)}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <img
                      src={artwork.images[0]}
                      alt={artwork.title}
                      className="w-10 h-10 object-cover rounded-lg mr-3"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{artwork.title}</h4>
                      <p className="text-xs text-gray-600">{artwork.category}</p>
                      <p className="text-sm font-semibold text-amber-600">₹{artwork.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}