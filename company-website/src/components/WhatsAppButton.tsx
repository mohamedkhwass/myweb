'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { companyAPI, CompanyInfo } from '@/lib/supabase';

const WhatsAppButton = () => {
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

  const handleWhatsAppClick = () => {
    console.log('WhatsApp button clicked!'); // للتأكد من أن الزر يعمل

    const phoneNumber = companyInfo?.company_phone || '+201234567890';
    console.log('Phone number from DB:', phoneNumber);

    // Remove any non-digit characters except +, then remove + from the beginning
    let cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    if (cleanPhone.startsWith('+')) {
      cleanPhone = cleanPhone.substring(1);
    }

    // التأكد من وجود رقم صحيح
    if (!cleanPhone || cleanPhone.length < 10) {
      cleanPhone = '201234567890'; // رقم افتراضي
    }

    console.log('Clean phone:', cleanPhone);

    const message = encodeURIComponent('مرحباً، أريد الاستفسار عن خدماتكم');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    console.log('WhatsApp URL:', whatsappUrl); // للتأكد من الرابط

    // محاولة فتح WhatsApp
    try {
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      // في حالة الفشل، محاولة فتح WhatsApp Web
      window.open(`https://web.whatsapp.com/send?phone=${cleanPhone}&text=${message}`, '_blank');
    }
  };

  // عرض الزر حتى لو لم تكن هناك معلومات شركة (استخدام رقم افتراضي)
  if (loading) {
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors duration-300 flex items-center space-x-2 rtl:space-x-reverse"
        title="تواصل معنا عبر WhatsApp"
      >
        <MessageCircle size={24} />
        <span className="hidden md:block font-medium">واتساب</span>
      </motion.button>
      
      {/* Pulse animation */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
    </motion.div>
  );
};

export default WhatsAppButton;
