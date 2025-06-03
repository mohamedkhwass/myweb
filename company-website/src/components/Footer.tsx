'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github, Instagram } from 'lucide-react';
import { companyAPI, CompanyInfo } from '@/lib/supabase';

const Footer = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

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

  const quickLinks = [
    { name: 'الرئيسية', href: '#home' },
    { name: 'عن الشركة', href: '#about' },
    { name: 'خدماتنا', href: '#services' },
    { name: 'أعمالنا', href: '#portfolio' },
  ];

  const services = [
    { name: 'تطوير تطبيقات جوالة احترافية', href: '#services' },
    { name: 'تصميم مواقع إلكترونية متطورة', href: '#services' },
    { name: 'تطبيقات سطح مكتب قوية', href: '#services' },
    { name: 'دعم فني متواصل', href: '#services' },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: loading ? '#' : (companyInfo?.company_facebook || '#'),
      label: 'Facebook'
    },
    {
      icon: Twitter,
      href: loading ? '#' : (companyInfo?.company_twitter || '#'),
      label: 'Twitter'
    },
    {
      icon: Linkedin,
      href: loading ? '#' : (companyInfo?.company_linkedin || '#'),
      label: 'LinkedIn'
    },
    {
      icon: Instagram,
      href: loading ? '#' : (companyInfo?.company_instagram || '#'),
      label: 'Instagram'
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {loading ? 'Khwass Tech' : (companyInfo?.company_name || 'Khwass Tech')}
                </h3>
                <p className="text-sm text-gray-400">للتطوير التقني</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              شركة متخصصة في تطوير التطبيقات الجوالة والحلول التقنية المبتكرة. 
              نساعدك في تحويل أفكارك إلى واقع رقمي يحقق أهدافك التجارية.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail size={16} className="text-primary-400" />
                <a
                  href={`mailto:${loading ? 'info@khwasstech.com' : (companyInfo?.company_email || 'info@khwasstech.com')}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {loading ? 'info@khwasstech.com' : (companyInfo?.company_email || 'info@khwasstech.com')}
                </a>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone size={16} className="text-primary-400" />
                <a
                  href={`tel:${loading ? '+201234567890' : (companyInfo?.company_phone || '+201234567890')}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {loading ? '+20 123 456 7890' : (companyInfo?.company_phone || '+20 123 456 7890')}
                </a>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPin size={16} className="text-primary-400" />
                <span className="text-gray-400">
                  {loading ? 'القاهرة، مصر' : (companyInfo?.company_address || 'القاهرة، مصر')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
                  >
                    <span className="w-2 h-2 bg-primary-600 rounded-full ml-3 rtl:mr-3 rtl:ml-0"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">خدماتنا</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
                  >
                    <span className="w-2 h-2 bg-primary-600 rounded-full ml-3 rtl:mr-3 rtl:ml-0"></span>
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">تابعنا</h4>
            <p className="text-gray-400 mb-6">
              تابع آخر أخبارنا ومشاريعنا على وسائل التواصل الاجتماعي
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 rtl:space-x-reverse mb-8">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="font-semibold mb-3">اشترك في النشرة الإخبارية</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-r-lg rtl:rounded-l-lg rtl:rounded-r-none focus:outline-none focus:border-primary-600 text-white"
                />
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-l-lg rtl:rounded-r-lg rtl:rounded-l-none transition-colors">
                  اشترك
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-gray-400 text-sm mb-4 md:mb-0"
            >
              © {currentYear} {loading ? 'Khwass Tech للتطوير التقني' : (companyInfo?.company_name || 'Khwass Tech')}. جميع الحقوق محفوظة.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex space-x-6 rtl:space-x-reverse"
            >
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                شروط الاستخدام
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                اتفاقية الخدمة
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
