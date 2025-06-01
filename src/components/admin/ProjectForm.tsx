'use client';

import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import ImageManager from './ImageManager';

interface ProjectFormData {
  title: string;
  description: string;
  technologies: string;
  category: string;
  live_url: string;
  github_url: string;
  featured: boolean;
  images: string[];
}

interface ProjectFormProps {
  formData: ProjectFormData;
  setFormData: (data: ProjectFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingImage: boolean;
  editingProject: unknown;
}

const ProjectForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  onImageUpload,
  uploadingImage,
  editingProject
}: ProjectFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {editingProject ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Project Images */}
        <ImageManager
          images={formData.images || []}
          onImagesChange={(images) => setFormData({ ...formData, images })}
          onImageUpload={onImageUpload}
          uploadingImage={uploadingImage}
        />

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان المشروع *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الفئة
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="">اختر الفئة</option>
              <option value="تعليمي">تعليمي</option>
              <option value="تجاري">تجاري</option>
              <option value="ترفيهي">ترفيهي</option>
              <option value="إداري">إداري</option>
              <option value="اجتماعي">اجتماعي</option>
              <option value="خدمي">خدمي</option>
              <option value="ديني">ديني</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            وصف المشروع *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            required
          />
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            التقنيات المستخدمة (مفصولة بفاصلة)
          </label>
          <input
            type="text"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            placeholder="Flutter, Dart, Firebase, REST APIs"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
          />
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              رابط المعاينة (Google Play / App Store)
            </label>
            <input
              type="url"
              value={formData.live_url}
              onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
              placeholder="https://play.google.com/store/apps/details?id=..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              رابط GitHub
            </label>
            <input
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/username/repository"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            مشروع مميز (يظهر في الصفحة الرئيسية)
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 rtl:space-x-reverse pt-4">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={uploadingImage}
            className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            <span>{editingProject ? 'تحديث المشروع' : 'حفظ المشروع'}</span>
          </motion.button>
          
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            إلغاء
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProjectForm;
