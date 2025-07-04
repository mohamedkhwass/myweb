'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, CheckCircle, Star, Users, Award } from 'lucide-react';
import { companyAPI, CompanyInfo } from '@/lib/supabase';

// مكون الأنيميشن المتغير للكلمات
const AnimatedWords = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ['تطبيق مبتكر', 'موقع متطور', 'برنامج قوي'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key={currentWordIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-primary-600 dark:text-primary-400"
    >
      {words[currentWordIndex]}
    </motion.div>
  );
};

const Hero = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const data = await companyAPI.getInfo();
      setCompanyInfo(data);
    } catch (error) {
      console.error('Error fetching company info:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: Users, value: `${companyInfo?.clients_count || 50}+`, label: 'عميل راضي' },
    { icon: Award, value: `${companyInfo?.projects_count || 100}+`, label: 'مشروع مكتمل' },
    { icon: Star, value: '4.9', label: 'تقييم العملاء' },
  ];

  const features = [
    'تطوير تطبيقات جوالة احترافية',
    'تصميم مواقع إلكترونية متطورة',
    'تطبيقات سطح مكتب قوية',
    'دعم فني متواصل'
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 lg:py-0">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 sm:top-40 left-20 sm:left-40 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4 ml-2" />
              الشركة الرائدة في التطوير التقني والبرمجيات
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight"
            >
              <div className="leading-tight">
                {loading ? (
                  <>
                    <div className="mb-3">مرحباً بك في</div>
                    <div className="gradient-text mb-3">Khwass Tech</div>
                    <div>للحلول التقنية</div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">مرحباً بك في</div>
                    <div className="gradient-text mb-3">{companyInfo?.company_name || 'Khwass Tech'}</div>
                    <div>للحلول التقنية</div>
                  </>
                )}
              </div>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 px-4 sm:px-0"
            >
              {loading ? (
                'الشركة الرائدة في التطوير التقني والبرمجيات. نطور التطبيقات الجوالة، المواقع الإلكترونية، وتطبيقات سطح المكتب بأحدث التقنيات.'
              ) : (
                companyInfo?.company_description || 'الشركة الرائدة في التطوير التقني والبرمجيات. نطور التطبيقات الجوالة، المواقع الإلكترونية، وتطبيقات سطح المكتب بأحدث التقنيات.'
              )}
            </motion.p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8 px-4 sm:px-0"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-12 px-4 sm:px-0"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6"
              >
                <span>ابدأ مشروعك الآن</span>
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>

              <motion.a
                href="#portfolio"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>شاهد أعمالنا</span>
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-1 sm:mb-2">
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Image/Illustration */}
            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                {/* Phone Mockup */}
                <div className="w-48 h-72 sm:w-56 sm:h-84 md:w-64 md:h-96 mx-auto bg-gray-900 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <div className="text-white text-center px-2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2">
                        <AnimatedWords />
                      </h3>
                      <p className="text-xs sm:text-sm opacity-90">تجربة مستخدم استثنائية</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  x: [0, 10, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-6 sm:top-10 -left-6 sm:-left-10 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-primary-100 dark:bg-primary-900 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg"
              >
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary-600" />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 15, 0],
                  x: [0, -10, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute bottom-6 sm:bottom-10 -right-6 sm:-right-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-secondary-100 dark:bg-secondary-900 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg"
              >
                <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-secondary-600" />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-1/2 -right-12 sm:-right-16 md:-right-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
