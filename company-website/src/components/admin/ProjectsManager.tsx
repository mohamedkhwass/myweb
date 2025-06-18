'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Edit, Trash2, Save, X, Upload, Star,
  ExternalLink, Github, Image as ImageIcon
} from 'lucide-react';
import { projectsAPI, storageAPI, Project } from '@/lib/supabase';
import ImageGallery from '../ImageGallery';
import ImageManager from './ImageManager';

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [] as string[],
    category: '',
    live_url: '',
    github_url: '',
    image_url: '',
    images: [] as string[],
    featured: false,
    display_order: 0,
    show_on_company: true,
    show_on_portfolio: true
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies.filter(tech => tech.trim() !== '')
      };

      if (editingProject) {
        await projectsAPI.update(editingProject.id, projectData);
      } else {
        await projectsAPI.create(projectData);
      }

      await fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies || [],
      category: project.category,
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      image_url: project.image_url || '',
      images: (project as any).images || [],
      featured: project.featured,
      display_order: project.display_order,
      show_on_company: project.show_on_company ?? true,
      show_on_portfolio: project.show_on_portfolio ?? true
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      setLoading(true);
      try {
        await projectsAPI.delete(id);
        await fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await storageAPI.uploadImage(file, 'projects');
      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
          image_url: imageUrl,
          images: [...prev.images, imageUrl]
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = async (imageUrl: string) => {
    try {
      await storageAPI.deleteImage(imageUrl);
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img !== imageUrl),
        image_url: prev.image_url === imageUrl ? '' : prev.image_url
      }));
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: [],
      category: '',
      live_url: '',
      github_url: '',
      image_url: '',
      images: [],
      featured: false,
      display_order: 0,
      show_on_company: true,
      show_on_portfolio: true
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const addTechnology = () => {
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, '']
    }));
  };

  const updateTechnology = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.map((tech, i) => i === index ? value : tech)
    }));
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            إدارة المشاريع
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            إضافة وتعديل وحذف المشاريع في كلا الموقعين
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مشروع جديد</span>
        </motion.button>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            {/* Project Images */}
            {((project.images && project.images.length > 0) || project.image_url) && (
              <div className="relative">
                <ImageGallery
                  images={project.images && project.images.length > 0 ? project.images : project.image_url ? [project.image_url] : []}
                  alt={project.title}
                  autoPlay={true}
                  autoPlayInterval={4000}
                  showThumbnails={project.images && project.images.length > 1}
                  className="h-48"
                />
                {project.featured && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      مميز
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded text-xs"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies && project.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>

              {/* Visibility Status */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">الظهور:</span>
                {project.show_on_company && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                    الشركة
                  </span>
                )}
                {project.show_on_portfolio && (
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                    البورتفوليو
                  </span>
                )}
                {!project.show_on_company && !project.show_on_portfolio && (
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-xs">
                    مخفي
                  </span>
                )}
              </div>

              {/* Links */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 rtl:space-x-reverse">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(project)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <Edit className="w-4 h-4" />
                  <span>تعديل</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(project.id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingProject ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      عنوان المشروع *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الفئة *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    وصف المشروع *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    التقنيات المستخدمة
                  </label>
                  <div className="space-y-2">
                    {formData.technologies.map((tech, index) => (
                      <div key={index} className="flex space-x-2 rtl:space-x-reverse">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => updateTechnology(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="اسم التقنية"
                        />
                        <button
                          type="button"
                          onClick={() => removeTechnology(index)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTechnology}
                      className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 transition-colors"
                    >
                      + إضافة تقنية
                    </button>
                  </div>
                </div>

                {/* URLs */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      رابط المشروع المباشر
                    </label>
                    <input
                      type="url"
                      value={formData.live_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, live_url: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      رابط GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Image Management */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    صور المشروع
                  </label>
                  <ImageManager
                    images={formData.images}
                    onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                    uploadPath="projects"
                    maxImages={10}
                  />
                </div>

                {/* Settings */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ترتيب العرض
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center space-x-3 rtl:space-x-reverse">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        مشروع مميز
                      </span>
                    </label>
                  </div>
                </div>

                {/* Visibility Controls */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    إعدادات الظهور
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <label className="flex items-center space-x-3 rtl:space-x-reverse">
                        <input
                          type="checkbox"
                          checked={formData.show_on_company}
                          onChange={(e) => setFormData(prev => ({ ...prev, show_on_company: e.target.checked }))}
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          عرض في موقع الشركة
                        </span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center space-x-3 rtl:space-x-reverse">
                        <input
                          type="checkbox"
                          checked={formData.show_on_portfolio}
                          onChange={(e) => setFormData(prev => ({ ...prev, show_on_portfolio: e.target.checked }))}
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          عرض في البورتفوليو الشخصي
                        </span>
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    يمكنك التحكم في ظهور المشروع في كل موقع بشكل منفصل
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4 rtl:space-x-reverse pt-6 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{editingProject ? 'تحديث المشروع' : 'حفظ المشروع'}</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={resetForm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <X className="w-5 h-5" />
                    <span>إلغاء</span>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
