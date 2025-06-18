'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, FolderOpen, HardDrive, TrendingUp } from 'lucide-react';
import { projectsAPI, productsAPI, servicesAPI, storageAPI } from '@/lib/supabase';

interface ImageStatsData {
  totalImages: number;
  projectImages: number;
  productImages: number;
  serviceImages: number;
  storageUsed: string;
  recentUploads: number;
}

const ImageStats = () => {
  const [stats, setStats] = useState<ImageStatsData>({
    totalImages: 0,
    projectImages: 0,
    productImages: 0,
    serviceImages: 0,
    storageUsed: '0 MB',
    recentUploads: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImageStats();
  }, []);

  const fetchImageStats = async () => {
    try {
      setLoading(true);
      
      // Fetch data from all sources
      const [projects, products, services] = await Promise.all([
        projectsAPI.getAll(),
        productsAPI.getAll(),
        servicesAPI.getAll()
      ]);

      // Count images
      const projectImages = projects.reduce((count, project) => 
        count + (project.images?.length || 0) + (project.image_url ? 1 : 0), 0
      );
      
      const productImages = products.reduce((count, product) => 
        count + (product.images?.length || 0), 0
      );
      
      const serviceImages = services.reduce((count, service) => 
        count + (service.images?.length || 0), 0
      );

      const totalImages = projectImages + productImages + serviceImages;

      // Calculate recent uploads (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const recentProjects = projects.filter(p => new Date(p.updated_at) > weekAgo);
      const recentProducts = products.filter(p => new Date(p.updated_at) > weekAgo);
      const recentServices = services.filter(s => new Date(s.updated_at) > weekAgo);
      
      const recentUploads = recentProjects.length + recentProducts.length + recentServices.length;

      setStats({
        totalImages,
        projectImages,
        productImages,
        serviceImages,
        storageUsed: `${(totalImages * 0.5).toFixed(1)} MB`, // Estimated
        recentUploads
      });
    } catch (error) {
      console.error('Error fetching image stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'إجمالي الصور',
      value: stats.totalImages,
      icon: ImageIcon,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'صور المشاريع',
      value: stats.projectImages,
      icon: FolderOpen,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'صور المنتجات',
      value: stats.productImages,
      icon: FolderOpen,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'صور الخدمات',
      value: stats.serviceImages,
      icon: FolderOpen,
      color: 'bg-orange-500',
      change: '+5%'
    },
    {
      title: 'مساحة التخزين',
      value: stats.storageUsed,
      icon: HardDrive,
      color: 'bg-red-500',
      change: '+3%'
    },
    {
      title: 'رفع حديث',
      value: stats.recentUploads,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      change: '+25%'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          إحصائيات الصور
        </h3>
        <motion.button
          onClick={fetchImageStats}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-outline text-sm"
        >
          تحديث الإحصائيات
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                    من الشهر الماضي
                  </span>
                </div>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Storage Usage Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
      >
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          توزيع الصور حسب النوع
        </h4>
        <div className="space-y-4">
          {[
            { name: 'المشاريع', count: stats.projectImages, color: 'bg-green-500' },
            { name: 'المنتجات', count: stats.productImages, color: 'bg-purple-500' },
            { name: 'الخدمات', count: stats.serviceImages, color: 'bg-orange-500' }
          ].map((item) => {
            const percentage = stats.totalImages > 0 ? (item.count / stats.totalImages) * 100 : 0;
            return (
              <div key={item.name} className="flex items-center">
                <div className="w-20 text-sm text-gray-600 dark:text-gray-400">
                  {item.name}
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className={`${item.color} h-2 rounded-full`}
                    />
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-900 dark:text-white text-right">
                  {item.count} ({percentage.toFixed(1)}%)
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-6 text-white"
      >
        <h4 className="text-lg font-semibold mb-2">
          نصائح لإدارة الصور
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="mb-2">• استخدم صور عالية الجودة لأفضل عرض</p>
            <p className="mb-2">• رتب الصور حسب الأهمية</p>
            <p>• احذف الصور غير المستخدمة لتوفير المساحة</p>
          </div>
          <div>
            <p className="mb-2">• استخدم أسماء وصفية للصور</p>
            <p className="mb-2">• اضغط الصور لتقليل حجم التحميل</p>
            <p>• اعمل نسخ احتياطية دورية</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageStats;
