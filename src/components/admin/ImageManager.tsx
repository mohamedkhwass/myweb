'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, ZoomIn, Plus, Trash2 } from 'lucide-react';

interface ImageManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingImage: boolean;
}

const ImageManager = ({ images, onImagesChange, onImageUpload, uploadingImage }: ImageManagerProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        صور المشروع
      </label>
      
      {/* Upload Area */}
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onImageUpload}
          className="hidden"
          id="images-upload"
        />
        <label
          htmlFor="images-upload"
          className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          {uploadingImage ? (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 dark:text-gray-400">جاري رفع الصور...</span>
            </div>
          ) : (
            <div className="text-center">
              <Plus size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                إضافة صور جديدة
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                اختر عدة صور أو اسحبها هنا
              </p>
            </div>
          )}
        </label>
      </div>

      {/* Images Grid */}
      {images && images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            الصور المرفوعة ({images.length})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                  <img
                    src={imageUrl}
                    alt={`صورة ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => openImageModal(imageUrl)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      title="تكبير الصورة"
                    >
                      <ZoomIn size={16} />
                    </button>
                    <button
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      title="حذف الصورة"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Image Number */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No Images State */}
      {(!images || images.length === 0) && (
        <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <Upload size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            لم يتم رفع أي صور بعد
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            استخدم منطقة الرفع أعلاه لإضافة صور للمشروع
          </p>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="صورة مكبرة"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ImageManager;
