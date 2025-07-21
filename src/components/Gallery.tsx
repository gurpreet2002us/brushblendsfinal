import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import ArtworkCard from './ArtworkCard';
import { Artwork } from '../types';
import { useArtworks } from '../hooks/useArtworks';

interface GalleryProps {
  category?: string | null;
  onNavigate: (page: string, data?: any) => void;
  onShowAuthModal: () => void;
}

export default function Gallery({ category, onNavigate, onShowAuthModal }: GalleryProps) {
  const { artworks, loading } = useArtworks();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredArtworks = useMemo(() => {
    let filtered = artworks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category if specified
    if (category) {
      filtered = filtered.filter(artwork => artwork.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by price range
    filtered = filtered.filter(artwork => artwork.price >= priceRange[0] && artwork.price <= priceRange[1]);

    return filtered;
  }, [artworks, searchTerm, category, priceRange]);

  const sortedArtworks = useMemo(() => {
    let sortable = [...filteredArtworks];
    switch (sortOrder) {
      case 'newest':
        sortable.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
        break;
      case 'oldest':
        sortable.sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());
        break;
      case 'price-low':
        sortable.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortable.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
        sortable.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }
    return sortable;
  }, [filteredArtworks, sortOrder]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(sortedArtworks.length / itemsPerPage);
  const paginatedArtworks = sortedArtworks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (category === 'Fabric Painting') {
      window.scrollTo(0, 0);
    }
  }, [category]);

  // Get unique categories
  const categories = useMemo(() => {
    const allCategories = artworks.map(artwork => artwork.category);
    return Array.from(new Set(allCategories));
  }, [artworks]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getTitle = () => {
    if (category) {
      // Capitalize first letter
      return category.charAt(0).toUpperCase() + category.slice(1) + 's';
    }
    return 'Art Gallery';
  };

  const getDescription = () => {
    if (category === 'fabric') return 'Discover our collection of intricate fabric paintings with embroidery and beadwork';
    if (category === 'oil') return 'Explore our classic oil paintings with rich colors and masterful techniques';
    if (category === 'handcraft') return 'Browse our unique handcrafted items including sculptures, carvings, and decorative pieces';
    return 'Browse our complete collection of handcrafted artworks';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading artworks...</h3>
            <p className="text-gray-600">Please wait while we fetch the data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{getTitle()}</h1>
          <p className="text-lg text-gray-600 mb-6">{getDescription()}</p>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </button>
              <span className="text-sm text-gray-600">
                {sortedArtworks.length} artworks found
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
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
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 bg-white rounded-lg shadow-md p-6 h-fit">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setPriceRange([0, 50000]);
                  setSelectedCategories([]);
                }}
                className="w-full px-4 py-2 text-sm text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Artworks Grid */}
          <div className="flex-1">
            {paginatedArtworks.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {paginatedArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onViewDetails={(id: string) => onNavigate('artwork', id)}
                    onNavigate={onNavigate}
                    onShowAuthModal={onShowAuthModal}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}