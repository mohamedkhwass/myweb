'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, ImageIcon, Move, Eye, Zap, AlertCircle } from 'lucide-react';
import { storageAPI } from '@/lib/supabase';
import { optimizeImage, validateImageFile, formatFileSize } from '@/utils/imageOptimization';

interface ImageManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  uploadPath: string;
  maxImages?: number;
  className?: string;
}

const ImageManager = ({
  images,
  onImagesChange,
  uploadPath,
  maxImages = 10,
  className = ''
}: ImageManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [errors, setErrors] = useState<string[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setOptimizing(true);
    setErrors([]);

    try {
      const validFiles: File[] = [];
      const newErrors: string[] = [];

      // Validate files
      for (const file of files.slice(0, maxImages - images.length)) {
        const validation = validateImageFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          newErrors.push(`${file.name}: ${validation.error}`);
        }
      }

      if (newErrors.length > 0) {
        setErrors(newErrors);
      }

      if (validFiles.length === 0) {
        return;
      }

      // Optimize images
      const optimizedFiles: File[] = [];
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadProgress(prev => ({ ...prev, [file.name]: 25 }));

        try {
          const optimized = await optimizeImage(file, {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 0.85,
            format: 'webp'
          });
          optimizedFiles.push(optimized.file);
          setUploadProgress(prev => ({ ...prev, [file.name]: 50 }));
        } catch (error) {
          console.error(`Error optimizing ${file.name}:`, error);
          optimizedFiles.push(file); // Use original if optimization fails
          setUploadProgress(prev => ({ ...prev, [file.name]: 50 }));
        }
      }

      setOptimizing(false);

      // Upload optimized images
      const uploadPromises = optimizedFiles.map(async (file, index) => {
        try {
          setUploadProgress(prev => ({ ...prev, [file.name]: 75 }));
          const url = await storageAPI.uploadImage(file, uploadPath);
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          return url;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
          return null;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null) as string[];

      onImagesChange([...images, ...validUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      setErrors(['حدث خطأ أثناء رفع الصور']);
    } finally {
      setUploading(false);
      setOptimizing(false);
      setUploadProgress({});
    }
  };

  const removeImage = async (imageUrl: string) => {
    try {
      await storageAPI.deleteImage(imageUrl);
      onImagesChange(images.filter(img => img !== imageUrl));
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];

    // Remove dragged item
    newImages.splice(draggedIndex, 1);

    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);

    onImagesChange(newImages);
    setDraggedIndex(null);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newImages = [...images];
    const movedImage = newImages.splice(fromIndex, 1)[0];
    newImages.splice(toIndex, 0, movedImage);

    onImagesChange(newImages);
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Upload Area */}
        {images.length < maxImages && (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-primary-500 transition-colors">
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                    اختر صور أو اسحبها هنا
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                    يمكنك رفع {maxImages - images.length} صور إضافية • WebP, JPEG, PNG
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              {uploading && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    {optimizing ? (
                      <>
                        <Zap className="w-4 h-4 text-primary-600 animate-pulse" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">جاري تحسين الصور...</span>
                      </>
                    ) : (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">جاري رفع الصور...</span>
                      </>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {Object.keys(uploadProgress).length > 0 && (
                    <div className="space-y-1">
                      {Object.entries(uploadProgress).map(([fileName, progress]) => (
                        <div key={fileName} className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600 dark:text-gray-400 truncate max-w-32">
                              {fileName}
                            </span>
                            <span className="text-gray-500">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                            <div
                              className="bg-primary-600 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <div className="flex items-start space-x-2 rtl:space-x-reverse">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                  أخطاء في رفع الصور:
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setErrors([])}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                الصور المرفوعة ({images.length}/{maxImages})
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                اسحب الصور لإعادة ترتيبها
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimatePresence>
                {images.map((imageUrl, index) => (
                  <motion.div
                    key={imageUrl}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className={`relative group cursor-move ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={imageUrl}
                        alt={`صورة ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Image Index */}
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => setPreviewImage(imageUrl)}
                            className="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-full transition-colors"
                            title="معاينة"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeImage(imageUrl)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                            title="حذف"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Drag Handle */}
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Move className="w-4 h-4 text-white drop-shadow-lg" />
                      </div>
                    </div>

                    {/* Move Buttons for Mobile */}
                    <div className="flex justify-center space-x-2 rtl:space-x-reverse mt-2 md:hidden">
                      {index > 0 && (
                        <button
                          onClick={() => moveImage(index, index - 1)}
                          className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                        >
                          ←
                        </button>
                      )}
                      {index < images.length - 1 && (
                        <button
                          onClick={() => moveImage(index, index + 1)}
                          className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                        >
                          →
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <ImageIcon className="mx-auto h-16 w-16 mb-4 opacity-50" />
            <p>لم يتم رفع أي صور بعد</p>
            <p className="text-sm">ابدأ برفع الصور لعرضها هنا</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImage}
                alt="معاينة الصورة"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageManager;
