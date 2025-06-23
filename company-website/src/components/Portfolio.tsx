'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { projectsAPI, Project } from '@/lib/supabase';
import ImageGallery from './ImageGallery';

const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsAPI.getForCompany();
      // Filter featured projects and show only 4
      const featuredProjects = data.filter(project => project.featured);
      setProjects(featuredProjects.slice(0, 4));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
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
    <section id="portfolio" className="section bg-gray-50 dark:bg-gray-800">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="text-primary-600 font-semibold text-lg">أعمالنا</span>
          <h2 className="section-title">
            مشاريع نفخر بإنجازها
          </h2>
          <p className="section-subtitle">
            استعرض مجموعة من أفضل المشاريع التي نفذناها لعملائنا بنجاح
          </p>
        </motion.div>

        {projects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="card group"
              >
                {/* Project Images Gallery */}
                {(project.images && project.images.length > 0) || project.image_url ? (
                  <div className="relative overflow-hidden rounded-t-xl">
                    <ImageGallery
                      images={project.images && project.images.length > 0 ? project.images : project.image_url ? [project.image_url] : []}
                      alt={project.title}
                      autoPlay={true}
                      autoPlayInterval={5000}
                      showThumbnails={false}
                      className="h-48"
                    />
                    {/* روابط المشروع - تظهر في الوسط فقط */}
                    {(project.live_url || project.github_url) && (
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center space-x-4 rtl:space-x-reverse opacity-0 group-hover:opacity-100 z-10 pointer-events-none">
                        <div className="flex space-x-4 rtl:space-x-reverse pointer-events-auto">
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors shadow-lg"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={20} />
                            </a>
                          )}
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors shadow-lg"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github size={20} />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="card-body">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="badge badge-primary">مميز</span>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Category */}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {project.category}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400">
              لا توجد مشاريع متاحة حالياً
            </p>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
          >
            ابدأ مشروعك معنا
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
