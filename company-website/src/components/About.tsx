'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, Users, Clock, Shield } from 'lucide-react';
import { companyAPI, CompanyInfo } from '@/lib/supabase';

const About = () => {
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
  const values = [
    {
      icon: Award,
      title: 'الجودة والتميز',
      description: 'نلتزم بأعلى معايير الجودة في جميع مشاريعنا'
    },
    {
      icon: Users,
      title: 'التعاون والشراكة',
      description: 'نؤمن بقوة العمل الجماعي وبناء شراكات طويلة الأمد'
    },
    {
      icon: Clock,
      title: 'الالتزام بالمواعيد',
      description: 'نحترم وقت عملائنا ونلتزم بالتسليم في المواعيد المحددة'
    },
    {
      icon: Shield,
      title: 'الأمان والموثوقية',
      description: 'نضمن أمان وحماية بيانات عملائنا بأحدث التقنيات'
    }
  ];

  return (
    <section id="about" className="section bg-white dark:bg-gray-900">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-primary-600 font-semibold text-lg"
              >
                عن شركتنا
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-6"
              >
                {loading ? `عن Khwass Tech` : `عن ${companyInfo?.company_name || 'Khwass Tech'}`}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                {loading ? (
                  'Khwass Tech هي شركة رائدة في مجال التطوير التقني والبرمجيات. نطور التطبيقات الجوالة، المواقع الإلكترونية، وتطبيقات سطح المكتب بأحدث التقنيات والمعايير العالمية.'
                ) : (
                  companyInfo?.about_description || `${companyInfo?.company_name || 'Khwass Tech'} هي شركة رائدة في مجال التطوير التقني والبرمجيات. نطور التطبيقات الجوالة، المواقع الإلكترونية، وتطبيقات سطح المكتب بأحدث التقنيات والمعايير العالمية.`
                )}
              </motion.p>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl"
              >
                <Target className="w-8 h-8 text-primary-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">رسالتنا</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {loading ? (
                    'نسعى لتقديم حلول تقنية مبتكرة تساعد عملاءنا على تحقيق أهدافهم الرقمية بأعلى معايير الجودة والاحترافية.'
                  ) : (
                    companyInfo?.mission_statement || 'نسعى لتقديم حلول تقنية مبتكرة تساعد عملاءنا على تحقيق أهدافهم الرقمية بأعلى معايير الجودة والاحترافية.'
                  )}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-6 bg-secondary-50 dark:bg-secondary-900/20 rounded-xl"
              >
                <Eye className="w-8 h-8 text-secondary-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">رؤيتنا</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {loading ? (
                    'أن نكون الشركة الرائدة في تطوير التطبيقات الجوالة في المنطقة العربية، ونساهم في التحول الرقمي للشركات والمؤسسات.'
                  ) : (
                    companyInfo?.vision_statement || 'أن نكون الشركة الرائدة في تطوير التطبيقات الجوالة في المنطقة العربية، ونساهم في التحول الرقمي للشركات والمؤسسات.'
                  )}
                </p>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {loading ? '100+' : `${companyInfo?.projects_count || 100}+`}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">مشروع مكتمل</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {loading ? '50+' : `${companyInfo?.clients_count || 50}+`}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">عميل راضي</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center"
            >
              قيمنا الأساسية
            </motion.h3>

            <div className="grid gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start space-x-4 rtl:space-x-reverse p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <value.icon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
