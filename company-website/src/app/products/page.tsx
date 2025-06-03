'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { productsAPI, Product } from '@/lib/supabase';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                منتجاتنا التقنية
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                اكتشف مجموعة منتجاتنا المبتكرة التي طورناها لتلبية احتياجات السوق
              </p>
              <Link href="#products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <span>استكشف منتجاتنا</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-16">
        <div className="container">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
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
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center">
                    <div className="text-primary-600 dark:text-primary-400 text-6xl font-bold">
                      {product.name.charAt(0)}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      {product.is_featured && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                            مميز
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {product.short_description || product.description}
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
                        {product.download_url && (
                          <Link href={product.download_url} target="_blank">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="btn-primary text-sm flex items-center space-x-1 rtl:space-x-reverse"
                            >
                              <Download className="w-4 h-4" />
                              <span>تحميل</span>
                            </motion.button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Download className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  قريباً...
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  نعمل حالياً على تطوير منتجات مبتكرة. ترقبوا إطلاقها قريباً!
                </p>
                <Link href="#contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    تواصل معنا للمزيد
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default ProductsPage;
