'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Smartphone, Globe, Database, Cloud, Monitor, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ImageGallery from '@/components/ImageGallery';
import ExpandableFeatures from '@/components/ExpandableFeatures';
import { servicesAPI, Service, companyAPI, CompanyInfo } from '@/lib/supabase';

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    fetchServices();
    fetchCompanyInfo();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await servicesAPI.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
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

  const displayServices = services.length > 0 ? services : defaultServices;

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
                خدماتنا التقنية
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                نقدم مجموعة شاملة من الخدمات التقنية المتطورة لتلبية احتياجات عملائنا
              </p>
              <Link href="#services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <span>استكشف خدماتنا</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-16">
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {displayServices.map((service, index) => {
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
                        {service.title || service.name}
                      </h3>

                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                        {service.short_description || service.description}
                      </p>

                      {/* Service Images */}
                      {service.images && service.images.length > 0 && (
                        <div className="mb-4 sm:mb-6 overflow-hidden rounded-lg">
                          <ImageGallery
                            images={service.images}
                            alt={service.title || service.name}
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
                            {service.price_starting_from ? `$${service.price_starting_from}+` : (service.price || 'حسب المشروع')}
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
                        onClick={() => handleServiceRequest(service.title || service.name)}
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
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default ServicesPage;
