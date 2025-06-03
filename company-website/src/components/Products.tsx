'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Download, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { productsAPI, Product } from '@/lib/supabase';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {product.image_url ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center">
                    <div className="text-primary-600 dark:text-primary-400 text-6xl font-bold">
                      {product.name.charAt(0)}
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    {product.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          {product.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      {product.price ? `$${product.price}` : 'مجاني'}
                    </span>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      {product.demo_url && (
                        <Link href={product.demo_url} target="_blank">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-outline text-sm flex items-center space-x-1 rtl:space-x-reverse"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>معاينة</span>
                          </motion.button>
                        </Link>
                      )}
                    </div>
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
