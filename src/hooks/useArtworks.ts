import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Artwork } from '../types';

export function useArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArtworks();
  }, []);

  async function fetchArtworks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedArtworks: Artwork[] = data.map(artwork => ({
        id: artwork.id,
        title: artwork.title,
        description: artwork.description || '',
        price: artwork.price,
        medium: artwork.medium,
        category: artwork.category,
        style: artwork.style || '',
        dimensions: artwork.dimensions,
        images: artwork.images,
        inStock: artwork.in_stock,
        stockCount: artwork.stock_count,
        featured: artwork.featured,
        tags: artwork.tags,
        dateCreated: artwork.date_created,
        mainImageIndex: artwork.main_image_index || 0
      }));

      setArtworks(formattedArtworks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return { artworks, loading, error, refetch: fetchArtworks };
}

export async function createArtwork(artwork: Omit<Artwork, 'id' | 'dateCreated'>) {
  const { data, error } = await supabase
    .from('artworks')
    .insert({
      title: artwork.title,
      description: artwork.description,
      price: artwork.price,
      medium: artwork.medium,
      category: artwork.category,
      style: artwork.style,
      dimensions: artwork.dimensions,
      images: artwork.images,
      in_stock: artwork.inStock,
      stock_count: artwork.stockCount,
      featured: artwork.featured,
      tags: artwork.tags,
      main_image_index: artwork.mainImageIndex || 0
    })
    .select()
    .single();

  return { data, error };
}

export async function updateArtwork(id: string, updates: Partial<Artwork>) {
  const { data, error } = await supabase
    .from('artworks')
    .update({
      title: updates.title,
      description: updates.description,
      price: updates.price,
      medium: updates.medium,
      category: updates.category,
      style: updates.style,
      dimensions: updates.dimensions,
      images: updates.images,
      in_stock: updates.inStock,
      stock_count: updates.stockCount,
      featured: updates.featured,
      tags: updates.tags,
      main_image_index: updates.mainImageIndex
    })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteArtwork(id: string) {
  const { error } = await supabase
    .from('artworks')
    .delete()
    .eq('id', id);

  return { error };
}