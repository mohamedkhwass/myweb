'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { companyAPI, CompanyInfo } from '@/lib/supabase';

const Contact = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: ''
  });

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

  const handleWhatsAppContact = () => {
    const phoneNumber = companyInfo?.company_phone || '+201234567890';
    let cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    if (cleanPhone.startsWith('+')) {
      cleanPhone = cleanPhone.substring(1);
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      cleanPhone = '201234567890';
    }

    const message = encodeURIComponent('مرحباً، أريد التواصل معكم بخصوص مشروع جديد');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // إنشاء رسالة WhatsApp من بيانات النموذج
    const projectTypeNames = {
      'mobile-app': 'تطبيق جوال',
      'website': 'موقع ويب',
      'desktop-app': 'تطبيق سطح مكتب',
      'consultation': 'استشارة تقنية',
      'other': 'أخرى'
    };

    const projectTypeName = projectTypeNames[formData.projectType as keyof typeof projectTypeNames] || formData.projectType;

    let message = `مرحباً، أريد التواصل معكم بخصوص مشروع جديد:\n\n`;
    message += `الاسم: ${formData.name}\n`;
    message += `البريد الإلكتروني: ${formData.email}\n`;
    message += `رقم الهاتف: ${formData.phone}\n`;
    message += `نوع المشروع: ${projectTypeName}\n\n`;
    message += `تفاصيل المشروع:\n${formData.message}`;

    const phoneNumber = companyInfo?.company_phone || '+201234567890';
    let cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    if (cleanPhone.startsWith('+')) {
      cleanPhone = cleanPhone.substring(1);
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      cleanPhone = '201234567890';
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // فتح WhatsApp
    window.open(whatsappUrl, '_blank');

    // إعادة تعيين النموذج
    setFormData({
      name: '',
      email: '',
      phone: '',
      projectType: '',
      message: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: loading ? 'info@khwasstech.com' : (companyInfo?.company_email || 'info@khwasstech.com'),
      link: loading ? 'mailto:info@khwasstech.com' : `mailto:${companyInfo?.company_email || 'info@khwasstech.com'}`
    },
    {
      icon: Phone,
      title: 'رقم الهاتف',
      value: loading ? '+20 123 456 7890' : (companyInfo?.company_phone || '+20 123 456 7890'),
      link: loading ? 'tel:+201234567890' : `tel:${companyInfo?.company_phone || '+201234567890'}`
    },
    {
      icon: MapPin,
      title: 'الموقع',
      value: loading ? 'القاهرة، مصر' : (companyInfo?.company_address || 'القاهرة، مصر'),
      link: '#'
    }
  ];

  return (
    <section id="contact" className="section bg-white dark:bg-gray-900">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="text-primary-600 font-semibold text-lg">تواصل معنا</span>
          <h2 className="section-title">
            لنبدأ مشروعك القادم معاً
          </h2>
          <p className="section-subtitle">
            نحن هنا لمساعدتك في تحويل أفكارك إلى واقع رقمي. تواصل معنا اليوم للحصول على استشارة مجانية
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              معلومات التواصل
            </h3>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 rtl:space-x-reverse"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <info.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {info.title}
                    </h4>
                    {info.link !== '#' ? (
                      <a
                        href={info.link}
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">
                        {info.value}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl"
            >
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                استشارة مجانية
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                احصل على استشارة مجانية لمشروعك واكتشف كيف يمكننا مساعدتك في تحقيق أهدافك الرقمية.
              </p>
              <motion.button
                onClick={handleWhatsAppContact}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                اتصل بنا الآن
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="card">
              <div className="card-body">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  أرسل لنا رسالة
                </h3>

                <form className="space-y-6" onSubmit={handleFormSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الاسم الكامل
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="أدخل اسمك الكامل"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="أدخل بريدك الإلكتروني"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="أدخل رقم هاتفك"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      نوع المشروع
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">اختر نوع المشروع</option>
                      <option value="mobile-app">تطبيق جوال</option>
                      <option value="website">موقع ويب</option>
                      <option value="desktop-app">تطبيق سطح مكتب</option>
                      <option value="consultation">استشارة تقنية</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      تفاصيل المشروع
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="أخبرنا عن مشروعك ومتطلباتك..."
                      required
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <Send className="w-5 h-5" />
                    <span>إرسال عبر WhatsApp</span>
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
