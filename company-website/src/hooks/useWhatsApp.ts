'use client';

import { useState, useEffect } from 'react';
import { companyAPI, CompanyInfo } from '@/lib/supabase';

export const useWhatsApp = () => {
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const data = await companyAPI.get();
      if (data && data.company_phone) {
        // تنظيف رقم الهاتف وتحويله لصيغة واتساب
        const cleanNumber = data.company_phone.replace(/[^\d+]/g, '');
        setWhatsappNumber(cleanNumber);
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
      // رقم افتراضي في حالة الخطأ
      setWhatsappNumber('+201234567890');
    } finally {
      setLoading(false);
    }
  };

  const createWhatsAppLink = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

  const createProductPurchaseMessage = (productName: string, productType: string, price?: number, currency?: string) => {
    const action = productType === 'اشتراك' ? 'الاشتراك في' : 'شراء';
    let message = `مرحباً، أريد ${action} ${productName}`;

    if (price && currency) {
      message += `\n💰 السعر: ${price} ${currency}`;
    }

    message += `\n📱 نوع المنتج: ${productType}`;
    message += `\n\nيرجى تزويدي بالتفاصيل والخطوات التالية.`;

    return message;
  };

  return {
    whatsappNumber,
    loading,
    createWhatsAppLink,
    createProductPurchaseMessage
  };
};
