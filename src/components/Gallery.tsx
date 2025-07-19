import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import ArtworkCard from './ArtworkCard';
import { Artwork } from '../types';

interface GalleryProps {
  onNavigate: (page: string, id?: string) => void;
  medium?: 'fabric' | 'oil' | 'handcraft';
  artworks: Artwork[];
}

export default function Gallery({ onNavigate, medium, artworks }: GalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-low' | 'price-high' | 'featured'>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (medium === 'fabric') {
      window.scrollTo(0, 0);
    }
  }, [medium]);

  // Filter artworks based on medium prop and other filters
  const filteredArtworks = useMemo(() => {
    let filtered = artworks;

    // Filter by medium if specified
    if (medium) {
      filtered = filtered.filter(artwork => artwork.medium === medium);
    }

    // Filter by price range
    filtered = filtered.filter(artwork => 
      artwork.price >= priceRange[0] && artwork.price <= priceRange[1]
    );

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(artwork => 
        selectedCategories.includes(artwork.category)
      );
    }

    return filtered;
  }, [artworks, medium, priceRange, selectedCategories]);

  // Sort artworks
  const sortedArtworks = useMemo(() => {
    const sorted = [...filteredArtworks];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'featured':
        return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      default:
        return sorted;
    }
  }, [filteredArtworks, sortBy]);

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
    if (medium === 'fabric') return 'Fabric Paintings';
    if (medium === 'oil') return 'Oil Paintings';
    if (medium === 'handcraft') return 'Handcraft Items';
    return 'Art Gallery';
  };

  const getDescription = () => {
    if (medium === 'fabric') return 'Discover our collection of intricate fabric paintings with embroidery and beadwork';
    if (medium === 'oil') return 'Explore our classic oil paintings with rich colors and masterful techniques';
    if (medium === 'handcraft') return 'Browse our unique handcrafted items including sculptures, carvings, and decorative pieces';
    return 'Browse our complete collection of handcrafted artworks';
  };

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
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
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
                  max="5000"
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
                  setPriceRange([0, 5000]);
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
            {sortedArtworks.length === 0 ? (
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
                {sortedArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onViewDetails={(id) => onNavigate('artwork', id)}
                    onNavigate={onNavigate}
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