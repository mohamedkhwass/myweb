'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ImageGallery from '@/components/ImageGallery';
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

  const defaultServices = [
    {
      id: 1,
      name: 'تطوير التطبيقات الجوالة',
      description: 'نطور تطبيقات جوالة احترافية لنظامي Android و iOS باستخدام أحدث التقنيات مثل Flutter و React Native، مع التركيز على تجربة المستخدم وسرعة الأداء.',
      features: ['تطوير تطبيقات جوالة احترافية', 'تصميم مواقع إلكترونية متطورة', 'تطبيقات سطح مكتب قوية', 'دعم فني متواصل'],
      price: 'حسب المشروع',
      image_url: null
    },
    {
      id: 2,
      name: 'تطوير المواقع الإلكترونية',
      description: 'نصمم ونطور مواقع إلكترونية متجاوبة وسريعة باستخدام أحدث تقنيات الويب، مع التركيز على تحسين محركات البحث وتجربة المستخدم المثلى.',
      features: ['تطوير تطبيقات جوالة احترافية', 'تصميم مواقع إلكترونية متطورة', 'تطبيقات سطح مكتب قوية', 'دعم فني متواصل'],
      price: 'حسب المشروع',
      image_url: null
    },
    {
      id: 3,
      name: 'تطوير تطبيقات سطح المكتب',
      description: 'نطور تطبيقات سطح مكتب قوية ومستقرة لأنظمة Windows و macOS و Linux، مع واجهات مستخدم حديثة وأداء عالي.',
      features: ['تطوير تطبيقات جوالة احترافية', 'تصميم مواقع إلكترونية متطورة', 'تطبيقات سطح مكتب قوية', 'دعم فني متواصل'],
      price: 'حسب المشروع',
      image_url: null
    },
    {
      id: 4,
      name: 'الاستشارات التقنية',
      description: 'نقدم استشارات تقنية متخصصة لمساعدة الشركات في اختيار أفضل الحلول التقنية وتطوير استراتيجيات رقمية فعالة.',
      features: ['تطوير تطبيقات جوالة احترافية', 'تصميم مواقع إلكترونية متطورة', 'تطبيقات سطح مكتب قوية', 'دعم فني متواصل'],
      price: 'حسب الساعة',
      image_url: null
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Service Images */}
                  {(service.images && service.images.length > 0) || service.image_url ? (
                    <div className="overflow-hidden rounded-t-xl">
                      <ImageGallery
                        images={service.images && service.images.length > 0 ? service.images : service.image_url ? [service.image_url] : []}
                        alt={service.title || service.name}
                        autoPlay={true}
                        autoPlayInterval={4000}
                        showThumbnails={service.images && service.images.length > 1}
                        className="h-48"
                      />
                    </div>
                  ) : null}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {service.name}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {service.description}
                    </p>

                    {service.features && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">المميزات:</h4>
                        <ul className="space-y-1">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        {service.price || 'حسب المشروع'}
                      </span>
                      <motion.button
                        onClick={() => handleServiceRequest(service.name)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-outline text-sm"
                      >
                        طلب الخدمة
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
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
