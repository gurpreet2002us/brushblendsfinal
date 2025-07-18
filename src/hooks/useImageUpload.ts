import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File): Promise<{ data: UploadedImage | null; error: string | null }> => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Validate file
      if (!file.type.startsWith('image/')) {
        return { data: null, error: 'Please select an image file' };
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return { data: null, error: 'Image size must be less than 5MB' };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `artwork-images/${fileName}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Save image metadata to database
      const imageMetadata = {
        id: uploadData.id || uploadData.path,
        url: publicUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };

      const { error: dbError } = await supabase
        .from('media_gallery')
        .insert({
          id: uploadData.id || uploadData.path,
          filename: file.name,
          original_filename: file.name,
          file_path: filePath,
          public_url: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (dbError) {
        console.warn('Error saving image metadata:', dbError);
        // Continue anyway since the image was uploaded successfully
      }

      setUploadProgress(100);
      return { data: imageMetadata, error: null };

    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(0);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Upload failed. Please try again.' 
      };
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const uploadMultipleImages = async (files: FileList): Promise<{ 
    data: UploadedImage[]; 
    errors: string[] 
  }> => {
    const results: UploadedImage[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await uploadImage(file);
      
      if (result.data) {
        results.push(result.data);
      } else if (result.error) {
        errors.push(`${file.name}: ${result.error}`);
      }
    }

    return { data: results, errors };
  };

  return {
    uploading,
    uploadProgress,
    uploadImage,
    uploadMultipleImages
  };
}

export async function getMediaGallery(): Promise<{ data: UploadedImage[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('media_gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const images: UploadedImage[] = data.map(item => ({
      id: item.id,
      url: item.public_url,
      filename: item.filename,
      size: item.file_size,
      type: item.mime_type,
      uploadedAt: item.created_at
    }));

    return { data: images, error: null };
  } catch (error) {
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'Failed to load media gallery' 
    };
  }
}

export async function deleteImage(imageId: string): Promise<{ error: string | null }> {
  try {
    // Try to get image details first
    const { data: imageData } = await supabase
      .from('media_gallery')
      .select('file_path')
      .eq('id', imageId)
      .maybeSingle();

    // Delete from storage if we have the file path
    if (imageData?.file_path) {
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([imageData.file_path]);
      
      if (storageError) {
        console.warn('Storage deletion error:', storageError);
        // Continue with database deletion even if storage fails
      }
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('media_gallery')
      .delete()
      .eq('id', imageId);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      throw dbError;
    }

    return { error: null };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Failed to delete image' 
    };
  }
}