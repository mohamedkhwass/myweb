'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { projectsAPI, Project } from '@/lib/supabase';

const Portfolio = () => {
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
                {/* Project Image */}
                {project.image_url && (
                  <div className="relative overflow-hidden rounded-t-xl">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4 rtl:space-x-reverse">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                          <ExternalLink size={20} />
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                          <Github size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="card-body">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="badge badge-primary">مميز</span>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

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
