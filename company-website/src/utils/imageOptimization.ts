/**
 * Image optimization utilities for better performance
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  progressive?: boolean;
}

export interface OptimizedImage {
  file: File;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  dimensions: {
    width: number;
    height: number;
  };
}

/**
 * Compress and optimize an image file
 */
export const optimizeImage = async (
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImage> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'webp',
    progressive = true
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not compress image'));
              return;
            }

            const optimizedFile = new File([blob], file.name, {
              type: `image/${format}`,
              lastModified: Date.now()
            });

            const compressionRatio = ((file.size - blob.size) / file.size) * 100;

            resolve({
              file: optimizedFile,
              originalSize: file.size,
              optimizedSize: blob.size,
              compressionRatio,
              dimensions: { width, height }
            });
          },
          `image/${format}`,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Could not load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Generate multiple sizes for responsive images
 */
export const generateResponsiveSizes = async (
  file: File,
  sizes: number[] = [400, 800, 1200, 1920]
): Promise<OptimizedImage[]> => {
  const results: OptimizedImage[] = [];

  for (const size of sizes) {
    try {
      const optimized = await optimizeImage(file, {
        maxWidth: size,
        maxHeight: size,
        quality: 0.8,
        format: 'webp'
      });
      results.push(optimized);
    } catch (error) {
      console.error(`Error generating size ${size}:`, error);
    }
  }

  return results;
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'الملف ليس صورة صالحة' };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'حجم الصورة كبير جداً (الحد الأقصى 10 ميجابايت)' };
  }

  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!supportedFormats.includes(file.type)) {
    return { valid: false, error: 'نوع الصورة غير مدعوم' };
  }

  return { valid: true };
};

/**
 * Get image dimensions
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => {
      reject(new Error('Could not load image to get dimensions'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create image thumbnail
 */
export const createThumbnail = async (
  file: File,
  size: number = 150
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        canvas.width = size;
        canvas.height = size;

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate crop dimensions for square thumbnail
        const { width, height } = img;
        const minDimension = Math.min(width, height);
        const x = (width - minDimension) / 2;
        const y = (height - minDimension) / 2;

        ctx.drawImage(img, x, y, minDimension, minDimension, 0, 0, size, size);

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Could not load image for thumbnail'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate srcset for responsive images
 */
export const generateSrcSet = (baseUrl: string, sizes: number[]): string => {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
};

/**
 * Lazy loading intersection observer
 */
export const createLazyLoadObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void
): IntersectionObserver => {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  });
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Convert image to WebP format if supported
 */
export const convertToWebP = async (file: File): Promise<File> => {
  // Check if browser supports WebP
  const canvas = document.createElement('canvas');
  const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

  if (!webpSupported) {
    return file;
  }

  try {
    const optimized = await optimizeImage(file, {
      format: 'webp',
      quality: 0.8
    });
    return optimized.file;
  } catch (error) {
    console.error('Error converting to WebP:', error);
    return file;
  }
};
