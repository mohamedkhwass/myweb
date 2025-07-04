'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Globe, Database, Cloud, Monitor, Users, ArrowLeft, CheckCircle } from 'lucide-react';
import { servicesAPI, Service, companyAPI, CompanyInfo } from '@/lib/supabase';
import ImageGallery from './ImageGallery';
import ExpandableFeatures from './ExpandableFeatures';

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  // Default services if database is empty
  const defaultServices = [
    {
      id: 1,
      title: 'تطوير تطبيقات Flutter',
      short_description: 'تطوير تطبيقات جوالة متقدمة باستخدام Flutter للأندرويد و iOS',
      description: 'نقدم خدمات تطوير تطبيقات Flutter احترافية مع تصميم عصري وأداء عالي. نضمن تطبيقات سريعة وموثوقة تعمل على جميع المنصات.',
      icon_name: 'Smartphone',
      price_starting_from: 2000,
      currency: 'USD',
      features: ['تطوير تطبيقات جوالة احترافية', 'تصميم مواقع إلكترونية متطورة', 'تطبيقات سطح مكتب قوية', 'دعم فني متواصل'],
      delivery_time: '4-8 أسابيع',
      is_featured: true,
      is_active: true,
      display_order: 1,
      created_at: '',
      updated_at: ''
    },
    {
      id: 2,
      title: 'تطوير مواقع الويب',
      short_description: 'تصميم وتطوير مواقع ويب حديثة ومتجاوبة باستخدام أحدث التقنيات',
      description: 'نصمم ونطور مواقع ويب احترافية باستخدام Next.js و React مع تركيز على الأداء وتجربة المستخدم.',
      icon_name: 'Globe',
      price_starting_from: 1500,
      currency: 'USD',
      features: ['تطوير تطبيقات جوالة احترافية', 'تصميم مواقع إلكترونية متطورة', 'تطبيقات سطح مكتب قوية', 'دعم فني متواصل'],
      delivery_time: '3-6 أسابيع',
      is_featured: true,
      is_active: true,
      display_order: 2,
      created_at: '',
      updated_at: ''
    },
    {
      id: 3,
      title: 'تطوير تطبيقات سطح المكتب',
      short_description: 'إنشاء تطبيقات سطح مكتب قوية ومستقرة لجميع أنظمة التشغيل',
      description: 'نطور تطبيقات سطح مكتب احترافية وقوية لأنظمة Windows و macOS و Linux مع واجهات مستخدم حديثة وأداء عالي.',
      icon_name: 'Monitor',
      price_starting_from: 2500,
      currency: 'USD',
      features: ['تطوير تطبيقات جوالة احترافية', 'تصميم مواقع إلكترونية متطورة', 'تطبيقات سطح مكتب قوية', 'دعم فني متواصل'],
      delivery_time: '6-10 أسابيع',
      is_featured: false,
      is_active: true,
      display_order: 3,
      created_at: '',
      updated_at: ''
    },
    {
      id: 4,
      title: 'الاستشارات التقنية',
      short_description: 'استشارات متخصصة في التطوير التقني والحلول الرقمية المبتكرة',
      description: 'نقدم استشارات تقنية متخصصة لمساعدة الشركات في اختيار أفضل الحلول التقنية وتطوير استراتيجيات رقمية فعالة.',
      icon_name: 'Users',
      price_starting_from: 100,
      currency: 'USD',
      features: ['تطوير تطبيقات جوالة احترافية', 'تصميم مواقع إلكترونية متطورة', 'تطبيقات سطح مكتب قوية', 'دعم فني متواصل'],
      delivery_time: 'حسب المشروع',
      is_featured: false,
      is_active: true,
      display_order: 4,
      created_at: '',
      updated_at: ''
    }
  ];

  useEffect(() => {
    fetchServices();
    fetchCompanyInfo();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await servicesAPI.getAll();
      if (data.length > 0) {
        setServices(data);
      } else {
        setServices(defaultServices);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices(defaultServices);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const data = await companyAPI.getInfo();
      setCompanyInfo(data);
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  const handleServiceRequest = (serviceName: string) => {
    const phoneNumber = companyInfo?.company_phone || '+201234567890';
    let cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    if (cleanPhone.startsWith('+')) {
      cleanPhone = cleanPhone.substring(1);
    }
    const message = encodeURIComponent(`مرحباً، أريد الاستفسار عن خدمة: ${serviceName}`);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return Smartphone;
      case 'Globe':
        return Globe;
      case 'Database':
        return Database;
      case 'Cloud':
        return Cloud;
      case 'Monitor':
        return Monitor;
      case 'Users':
        return Users;
      default:
        return Smartphone;
    }
  };

  if (loading) {
    return (
      <section className="section bg-gray-50 dark:bg-gray-800">
        <div className="container">
          <div className="flex justify-center items-center py-20">
            <div className="spinner w-12 h-12"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="section bg-gray-50 dark:bg-gray-800">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="text-primary-600 font-semibold text-lg">خدماتنا</span>
          <h2 className="section-title">
            نقدم حلول تقنية شاملة
          </h2>
          <p className="section-subtitle">
            نوفر مجموعة متكاملة من الخدمات التقنية المتخصصة لتلبية جميع احتياجاتك الرقمية
            بأعلى معايير الجودة والاحترافية
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {services.slice(0, 4).map((service, index) => {
            const IconComponent = getIcon(service.icon_name || 'Smartphone');

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="card group"
              >
                <div className="card-body">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary-100 dark:bg-primary-900 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    {service.is_featured && (
                      <span className="badge badge-primary text-xs">مميز</span>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    {service.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                    {service.short_description}
                  </p>

                  {/* Service Images */}
                  {service.images && service.images.length > 0 && (
                    <div className="mb-4 sm:mb-6 overflow-hidden rounded-lg">
                      <ImageGallery
                        images={service.images}
                        alt={service.title}
                        autoPlay={true}
                        autoPlayInterval={4000}
                        showThumbnails={false}
                        className="h-24 sm:h-28 md:h-32"
                      />
                    </div>
                  )}

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <div className="mb-4 sm:mb-6">
                      <ExpandableFeatures
                        features={service.features}
                        maxVisible={3}
                        iconType="check"
                        className="feature-list"
                      />
                    </div>
                  )}

                  {/* Price & Delivery */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-600 dark:text-primary-400">
                        ${service.price_starting_from}+
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">يبدأ من</div>
                    </div>
                    {service.delivery_time && (
                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {service.delivery_time}
                        </div>
                        <div className="text-xs text-gray-500">مدة التسليم</div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    onClick={() => handleServiceRequest(service.title)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm sm:text-base py-2 sm:py-3"
                  >
                    <span>اطلب الخدمة</span>
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 px-4 sm:px-0"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            لديك مشروع مخصص؟
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto">
            نحن نقدم حلول مخصصة تماماً لاحتياجاتك. تواصل معنا للحصول على استشارة مجانية وعرض سعر مخصص لمشروعك.
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-outline text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6"
          >
            احصل على استشارة مجانية
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
