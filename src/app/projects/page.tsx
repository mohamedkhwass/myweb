'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { projectsAPI, Project } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectsAPI.getForPortfolio();
        setProjects(data);
      } catch (err) {
        setError('فشل في تحميل المشاريع');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Image navigation functions
  const getProjectImages = (project: Project): string[] => {
    if (project.images && project.images.length > 0) {
      return project.images;
    }
    return ['/api/placeholder/400/250']; // Default placeholder
  };

  const nextImage = (projectId: number, images: string[]) => {
    console.log('Next image clicked for project:', projectId);
    const current = currentImageIndex[projectId] || 0;
    const next = (current + 1) % images.length;
    setCurrentImageIndex(prev => ({ ...prev, [projectId]: next }));
  };

  const prevImage = (projectId: number, images: string[]) => {
    console.log('Previous image clicked for project:', projectId);
    const current = currentImageIndex[projectId] || 0;
    const prevIndex = current === 0 ? images.length - 1 : current - 1;
    setCurrentImageIndex(prev => ({ ...prev, [projectId]: prevIndex }));
  };

  const openImageModal = (imageUrl: string) => {
    console.log('Opening image modal:', imageUrl);
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
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

  const getProjectIcon = (id: number) => {
    const icons = ['🎓', '🍀', '📊', '🛒', '⚙️', '💡', '🔧', '🏢', '🪑', '🛠️', '🕌', '💬'];
    return icons[id - 1] || '📱';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                جميع المشاريع
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                مجموعة شاملة من المشاريع التي عملت عليها
              </p>
            </div>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <ArrowLeft size={20} />
                <span>العودة للرئيسية</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => {
              const images = getProjectImages(project);
              const currentIndex = currentImageIndex[project.id] || 0;
              const currentImage = images[currentIndex];

              return (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Project Image Carousel */}
                  <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden group">
                    {currentImage.includes('placeholder') ? (
                      // Fallback icon if no image
                      <div className="flex items-center justify-center h-full">
                        <div className="text-white text-6xl">
                          {getProjectIcon(project.id)}
                        </div>
                      </div>
                    ) : (
                      // Project image
                      <img
                        src={currentImage}
                        alt={project.title}
                        className="w-full h-full object-contain cursor-pointer bg-gray-100 dark:bg-gray-800"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openImageModal(currentImage);
                        }}
                      />
                    )}

                    {/* Image navigation arrows */}
                    {images.length > 1 && !currentImage.includes('placeholder') && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            prevImage(project.id, images);
                          }}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full group-hover:opacity-100 opacity-70 md:opacity-0 transition-all duration-200 hover:bg-opacity-90 hover:scale-110 z-10"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            nextImage(project.id, images);
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full group-hover:opacity-100 opacity-70 md:opacity-0 transition-all duration-200 hover:bg-opacity-90 hover:scale-110 z-10"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}

                    {/* Zoom icon */}
                    {!currentImage.includes('placeholder') && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openImageModal(currentImage);
                        }}
                        className="absolute top-3 right-3 bg-black bg-opacity-70 text-white p-3 rounded-full group-hover:opacity-100 opacity-70 md:opacity-0 transition-all duration-200 hover:bg-opacity-90 hover:scale-110 z-10"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <ZoomIn size={20} />
                      </button>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                        {project.category}
                      </span>
                    </div>

                    {/* Image counter */}
                    {images.length > 1 && !currentImage.includes('placeholder') && (
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        {currentIndex + 1} / {images.length}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Project Links */}
                    <div className="flex space-x-3 rtl:space-x-reverse">
                      {project.live_url && (
                        <motion.a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                        >
                          <ExternalLink size={14} />
                          <span>معاينة</span>
                        </motion.a>
                      )}
                      {project.github_url && (
                        <motion.a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
                        >
                          <Github size={14} />
                          <span>الكود</span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="صورة مكبرة"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
