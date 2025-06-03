'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Eye, ExternalLink } from 'lucide-react';
import { personalInfoAPI, PersonalInfo } from '@/lib/supabase';

const CVSection = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  const fetchPersonalInfo = async () => {
    try {
      const data = await personalInfoAPI.get();
      setPersonalInfo(data);
    } catch (error) {
      console.error('Error fetching personal info:', error);
    } finally {
      setLoading(false);
    }
  };

  // إذا لم يكن هناك رابط CV، لا نعرض القسم
  if (!loading && (!personalInfo?.cv_url || personalInfo.cv_url.trim() === '')) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleDownload = () => {
    if (personalInfo?.cv_url) {
      window.open(personalInfo.cv_url, '_blank');
    }
  };

  const handlePreview = () => {
    if (personalInfo?.cv_url) {
      // فتح في نافذة جديدة للمعاينة
      window.open(personalInfo.cv_url, '_blank', 'width=800,height=600');
    }
  };

  return (
    <section id="cv" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              السيرة الذاتية
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              تحميل السيرة الذاتية الكاملة للاطلاع على تفاصيل الخبرات والمهارات
            </p>
          </motion.div>

          {/* CV Card */}
          <motion.div
            variants={itemVariants}
            className="max-w-md mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              {/* CV Icon */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <FileText className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* CV Info */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  السيرة الذاتية
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {loading ? 'محمد علي خواص' : (personalInfo?.name || 'محمد علي خواص')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {loading ? 'مهندس برمجيات' : (personalInfo?.title || 'مهندس برمجيات')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleDownload}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  <span>تحميل السيرة الذاتية</span>
                </motion.button>

                <motion.button
                  onClick={handlePreview}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 py-3 px-6 rounded-lg font-medium hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="w-5 h-5" />
                  <span>معاينة السيرة الذاتية</span>
                </motion.button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm text-gray-500 dark:text-gray-400">
                  <ExternalLink className="w-4 h-4" />
                  <span>سيتم فتح الملف في نافذة جديدة</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              variants={itemVariants}
              className="mt-8 flex justify-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CVSection;
