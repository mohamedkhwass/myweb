'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Download, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { productsAPI, Product } from '@/lib/supabase';
import ImageGallery from './ImageGallery';
import ExpandableFeatures from './ExpandableFeatures';
import { useWhatsApp } from '@/hooks/useWhatsApp';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { createWhatsAppLink, createProductPurchaseMessage } = useWhatsApp();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      // عرض أول 4 منتجات فقط
      setProducts(data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // منتجات افتراضية في حالة عدم وجود منتجات في قاعدة البيانات
  const defaultProducts = [
    {
      id: 1,
      name: 'تطبيق إدارة المهام',
      description: 'تطبيق ذكي لإدارة المهام اليومية والمشاريع مع واجهة سهلة الاستخدام ومميزات متقدمة للتنظيم والتذكير.',
      price: 29.99,
      rating: 4.8,
      image_url: null,
      demo_url: '#',
      download_url: '#',
      created_at: '',
      updated_at: ''
    },
    {
      id: 2,
      name: 'نظام إدارة المخزون',
      description: 'حل متكامل لإدارة المخزون والمبيعات مع تقارير تفصيلية وإشعارات تلقائية عند نفاد المخزون.',
      price: 99.99,
      rating: 4.9,
      image_url: null,
      demo_url: '#',
      download_url: '#',
      created_at: '',
      updated_at: ''
    },
    {
      id: 3,
      name: 'تطبيق التجارة الإلكترونية',
      description: 'منصة تجارة إلكترونية شاملة مع نظام دفع آمن وإدارة الطلبات وتتبع الشحنات.',
      price: 199.99,
      rating: 4.7,
      image_url: null,
      demo_url: '#',
      download_url: '#',
      created_at: '',
      updated_at: ''
    },
    {
      id: 4,
      name: 'نظام إدارة المحتوى',
      description: 'نظام إدارة محتوى متطور وسهل الاستخدام مع إمكانيات تخصيص واسعة ولوحة تحكم بديهية.',
      price: 129.99,
      rating: 4.6,
      image_url: null,
      demo_url: '#',
      download_url: '#',
      created_at: '',
      updated_at: ''
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  return (
    <section className="section bg-white dark:bg-gray-900">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="text-primary-600 font-semibold text-lg">منتجاتنا</span>
          <h2 className="section-title">
            تطبيقات وحلول جاهزة للاستخدام
          </h2>
          <p className="section-subtitle">
            اكتشف مجموعة من التطبيقات والحلول الجاهزة التي طورناها لتلبية احتياجات مختلفة
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg animate-pulse">
                <div className="h-32 sm:h-40 md:h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 sm:mb-4"></div>
                <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 sm:mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {(product.images && product.images.length > 0) || product.image_url ? (
                  <div className="overflow-hidden rounded-t-xl">
                    <ImageGallery
                      images={product.images && product.images.length > 0 ? product.images : product.image_url ? [product.image_url] : []}
                      alt={product.name}
                      autoPlay={true}
                      autoPlayInterval={5000}
                      showThumbnails={false}
                      className="h-32 sm:h-40 md:h-48"
                    />
                  </div>
                ) : (
                  <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center rounded-t-xl">
                    <div className="text-primary-600 dark:text-primary-400 text-3xl sm:text-4xl md:text-6xl font-bold">
                      {product.name.charAt(0)}
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      {product.product_type && (
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                          {product.product_type}
                        </span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="flex items-center">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1">
                          {product.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Product Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      <ExpandableFeatures
                        features={product.features}
                        maxVisible={3}
                        iconType="dot"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-1 sm:space-x-2 rtl:space-x-reverse mb-3 sm:mb-4">
                    {product.demo_url && (
                      <Link href={product.demo_url} target="_blank" className="flex-1">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-center text-xs sm:text-sm font-medium flex flex-col items-center"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mb-1" />
                          تجربة
                        </motion.button>
                      </Link>
                    )}
                    <Link
                      href={createWhatsAppLink(createProductPurchaseMessage(
                        product.name,
                        product.product_type || '',
                        product.price,
                        product.currency
                      ))}
                      target="_blank"
                      className="flex-1"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-center text-xs sm:text-sm font-medium flex flex-col items-center"
                      >
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 mb-1" />
                        {product.product_type === 'اشتراك' ? 'اشتراك' : 'شراء'}
                      </motion.button>
                    </Link>
                  </div>

                  {/* Price and Product Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-base sm:text-lg font-bold text-primary-600">
                          {product.price ? `$${product.price}` : 'مجاني'}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">{product.currency}</span>
                      </div>
                      {product.product_type && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                          {product.product_type}
                        </span>
                      )}
                    </div>
                    {product.subscription_type && product.subscription_type !== 'دفعة واحدة' && (
                      <div className="flex justify-end">
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded text-xs font-medium">
                          {product.subscription_type}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Products Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline inline-flex items-center space-x-2 rtl:space-x-reverse"
            >
              <span>عرض جميع المنتجات</span>
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
