import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Trash2, Check, Grid, List } from 'lucide-react';
import { useImageUpload, getMediaGallery, deleteImage, UploadedImage } from '../hooks/useImageUpload';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImages: (images: string[]) => void;
  selectedImages: string[];
  multiple?: boolean;
  title?: string;
}

export default function ImageUploadModal({ 
  isOpen, 
  onClose, 
  onSelectImages, 
  selectedImages,
  multiple = true,
  title = "Select Images"
}: ImageUploadModalProps) {
  const { uploading, uploadProgress, uploadMultipleImages } = useImageUpload();
  const [mediaGallery, setMediaGallery] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedInModal, setSelectedInModal] = useState<string[]>(selectedImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadMediaGallery();
      setSelectedInModal(selectedImages);
    }
  }, [isOpen, selectedImages]);

  const loadMediaGallery = async () => {
    setLoading(true);
    const { data, error } = await getMediaGallery();
    if (error) {
      console.error('Error loading media gallery:', error);
    } else {
      setMediaGallery(data);
    }
    setLoading(false);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const { data: uploadedImages, errors } = await uploadMultipleImages(files);
    
    if (errors.length > 0) {
      alert('Some uploads failed:\n' + errors.join('\n'));
    }

    if (uploadedImages.length > 0) {
      // Refresh gallery
      await loadMediaGallery();
      
      // Auto-select newly uploaded images
      const newImageUrls = uploadedImages.map(img => img.url);
      if (multiple) {
        setSelectedInModal(prev => [...prev, ...newImageUrls]);
      } else {
        setSelectedInModal(newImageUrls.slice(0, 1));
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    if (multiple) {
      setSelectedInModal(prev => 
        prev.includes(imageUrl) 
          ? prev.filter(url => url !== imageUrl)
          : [...prev, imageUrl]
      );
    } else {
      setSelectedInModal([imageUrl]);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    const { error } = await deleteImage(imageId);
    if (error) {
      alert('Error deleting image: ' + error);
    } else {
      // Remove from selected if it was selected
      const imageToDelete = mediaGallery.find(img => img.id === imageId);
      if (imageToDelete) {
        setSelectedInModal(prev => prev.filter(url => url !== imageToDelete.url));
      }
      
      // Refresh gallery
      await loadMediaGallery();
    }
  };

  const handleConfirm = () => {
    onSelectImages(selectedInModal);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center space-x-4">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upload New Images</h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Choose Files'}
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {uploading && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600">
            Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB per image.
          </p>
        </div>

        {/* Media Gallery */}
        <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: '60vh' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Media Gallery ({mediaGallery.length} images)
            </h3>
            {selectedInModal.length > 0 && (
              <span className="text-sm text-blue-600 font-medium">
                {selectedInModal.length} selected
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : mediaGallery.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
              <p className="text-gray-600">Upload your first image to get started</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
              : 'space-y-2'
            }>
              {mediaGallery.map((image) => {
                const isSelected = selectedInModal.includes(image.url);
                
                if (viewMode === 'list') {
                  return (
                    <div
                      key={image.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleImageSelect(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={image.filename}
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{image.filename}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(image.size)} • {new Date(image.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="h-5 w-5 text-blue-600 ml-2" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(image.id);
                        }}
                        className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={image.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleImageSelect(image.url)}
                  >
                    <div className="aspect-square">
                      <img
                        src={image.url}
                        alt={image.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.id);
                          }}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}

                    {/* Image info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                      <p className="text-xs truncate">{image.filename}</p>
                      <p className="text-xs opacity-75">{formatFileSize(image.size)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {multiple 
              ? `Select multiple images (${selectedInModal.length} selected)`
              : 'Select one image'
            }
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedInModal.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select {selectedInModal.length > 0 ? `(${selectedInModal.length})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}