'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { personalInfoAPI, PersonalInfo } from '@/lib/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: loading ? 'mohamedalikwass@gmail.com' : (personalInfo?.email || 'mohamedalikwass@gmail.com'),
      href: loading ? 'mailto:mohamedalikwass@gmail.com' : `mailto:${personalInfo?.email || 'mohamedalikwass@gmail.com'}`
    },
    {
      icon: Phone,
      title: 'رقم الهاتف',
      value: loading ? '+201551425194' : (personalInfo?.phone || '+201551425194'),
      href: loading ? 'tel:+201551425194' : `tel:${personalInfo?.phone || '+201551425194'}`
    },
    {
      icon: MapPin,
      title: 'الموقع',
      value: loading ? 'القاهرة، مصر' : (personalInfo?.location || 'القاهرة، مصر'),
      href: '#'
    }
  ];

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
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            تواصل معي
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            هل لديك مشروع في ذهنك؟ دعنا نتحدث ونحوله إلى واقع
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.h3
              variants={itemVariants}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
            >
              معلومات التواصل
            </motion.h3>

            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.href}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <info.icon className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {info.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {info.value}
                  </p>
                </div>
              </motion.a>
            ))}

            <motion.div
              variants={itemVariants}
              className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                متاح للعمل
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                أبحث عن فرص جديدة ومشاريع مثيرة للاهتمام. دعنا نتعاون!
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الاسم
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors duration-200"
                    placeholder="اسمك الكامل"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors duration-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الموضوع
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors duration-200"
                  placeholder="موضوع الرسالة"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الرسالة
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors duration-200 resize-none"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <Send size={20} />
                <span>إرسال الرسالة</span>
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
