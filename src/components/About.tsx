'use client';

import { motion } from 'framer-motion';
import { Code, Palette, Zap, Users } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Code,
      title: 'تطوير نظيف',
      description: 'أكتب كود نظيف وقابل للصيانة باستخدام أفضل الممارسات'
    },
    {
      icon: Palette,
      title: 'تصميم إبداعي',
      description: 'أصمم واجهات جميلة وسهلة الاستخدام'
    },
    {
      icon: Zap,
      title: 'أداء سريع',
      description: 'أحسن الأداء لضمان تجربة مستخدم سريعة'
    },
    {
      icon: Users,
      title: 'تعاون فعال',
      description: 'أعمل بفعالية ضمن الفرق وأتواصل بوضوح'
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
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
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
            عني
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            مطور ويب شغوف بالتقنيات الحديثة والتصميم الجميل
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.h3
              variants={itemVariants}
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
            >
              مرحباً! أنا محمد علي خواص، مهندس برمجيات
            </motion.h3>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
            >
              مطور Flutter متحمس مع خلفية قوية في تطوير Android. بدأت رحلتي التقنية مع Android باستخدام Java،
              ثم انتقلت إلى تطوير الواجهة الخلفية وربطها مع تطبيقات Flutter لإنتاج تطبيقات أكثر قوة ومتانة.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
            >
              حاصل على بكالوريوس علوم الحاسوب (2018-2022) بتقدير جيد جداً (3.06/4).
              لدي خبرة عملية في Data C Company (مايو 2024 - يناير 2025) وAdvance Systems Company (أكتوبر 2022 - مارس 2024) كمطور Flutter.
              ملتزم بالبقاء في المقدمة التقنية وشغوف بالتطوير الذاتي والمساهمة في مشاريع ديناميكية في عالم Flutter.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">الخبرة العملية</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-gray-800 dark:text-gray-200">Data C Company</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">مطور Flutter | مايو 2024 - يناير 2025</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 dark:text-gray-200">Advance Systems Company</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">مطور Flutter | أكتوبر 2022 - مارس 2024</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3"
            >
              {['Flutter', 'Dart', 'Firebase', 'Java', 'Android', 'Git', 'REST APIs', 'SQLite'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
