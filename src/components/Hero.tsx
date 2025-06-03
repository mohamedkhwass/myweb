'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { personalInfoAPI, PersonalInfo } from '@/lib/supabase';

const Hero = () => {
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

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Profile Image */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1"
              >
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl">📱</span>
                </div>
              </motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-full border-2 border-dashed border-blue-300 dark:border-blue-600"
              />
            </div>
          </motion.div>

          {/* Name and Title */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white">
              مرحباً، أنا{' '}
              <span className="gradient-text">
                {loading ? 'محمد علي خواص' : (personalInfo?.name || 'محمد علي خواص')}
              </span>
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 font-medium">
              {loading ? 'مهندس برمجيات متخصص في Flutter' : (personalInfo?.title || 'مهندس برمجيات متخصص في Flutter')}
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            {loading ?
              'مطور Flutter متحمس مع خلفية في تطوير Android. بدأت رحلتي التقنية مع Android باستخدام Java، ثم انتقلت إلى تطوير الواجهة الخلفية وربطها مع تطبيقات Flutter لإنتاج تطبيقات أكثر قوة ومتانة. ملتزم بالبقاء في المقدمة التقنية وشغوف بالتطوير الذاتي.' :
              (personalInfo?.description || 'مطور Flutter متحمس مع خلفية في تطوير Android. بدأت رحلتي التقنية مع Android باستخدام Java، ثم انتقلت إلى تطوير الواجهة الخلفية وربطها مع تطبيقات Flutter لإنتاج تطبيقات أكثر قوة ومتانة. ملتزم بالبقاء في المقدمة التقنية وشغوف بالتطوير الذاتي.')
            }
          </motion.p>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center space-x-6 rtl:space-x-reverse"
          >
            {[
              {
                icon: Github,
                href: loading ? 'https://github.com/mohamedalikwass' : (personalInfo?.github_url || 'https://github.com/mohamedalikwass'),
                label: 'GitHub'
              },
              {
                icon: Linkedin,
                href: loading ? 'https://linkedin.com/in/mohamedalikwass' : (personalInfo?.linkedin_url || 'https://linkedin.com/in/mohamedalikwass'),
                label: 'LinkedIn'
              },
              {
                icon: Mail,
                href: loading ? 'mailto:mohamedalikwass@gmail.com' : `mailto:${personalInfo?.email || 'mohamedalikwass@gmail.com'}`,
                label: 'Email'
              },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <social.icon size={24} />
              </motion.a>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              استعرض أعمالي
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-full font-medium hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors duration-300"
            >
              تواصل معي
            </motion.a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="pt-8"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center"
            >
              <ArrowDown className="text-gray-400 dark:text-gray-600" size={24} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
