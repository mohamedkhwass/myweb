'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, User, Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';
import { portfolioAPI, storageAPI, PortfolioInfo } from '@/lib/supabase';

const PortfolioManager = () => {
  const [portfolioInfo, setPortfolioInfo] = useState<PortfolioInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    profile_image_url: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    skills: [] as string[],
    years_experience: 0,
    projects_completed: 0,
    happy_clients: 0,
    cv_url: ''
  });

  useEffect(() => {
    fetchPortfolioInfo();
  }, []);

  const fetchPortfolioInfo = async () => {
    try {
      const data = await portfolioAPI.getInfo();
      if (data) {
        setPortfolioInfo(data);
        setFormData({
          name: data.name || '',
          title: data.title || '',
          description: data.description || '',
          profile_image_url: data.profile_image_url || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          website: data.website || '',
          github_url: data.github_url || '',
          linkedin_url: data.linkedin_url || '',
          twitter_url: data.twitter_url || '',
          skills: data.skills || [],
          years_experience: data.years_experience || 0,
          projects_completed: data.projects_completed || 0,
          happy_clients: data.happy_clients || 0,
          cv_url: data.cv_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching portfolio info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const portfolioData = {
        ...formData,
        skills: formData.skills.filter(skill => skill.trim() !== '')
      };

      await portfolioAPI.updateInfo(portfolioData);
      await fetchPortfolioInfo();
      alert('تم حفظ معلومات البورتفوليو بنجاح!');
    } catch (error) {
      console.error('Error saving portfolio info:', error);
      alert('حدث خطأ أثناء حفظ المعلومات');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await storageAPI.uploadImage(file, 'portfolio');
      if (imageUrl) {
        setFormData(prev => ({ ...prev, profile_image_url: imageUrl }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          معلومات البورتفوليو
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          تحديث المعلومات الشخصية والمهنية للبورتفوليو الشخصي (localhost:3003)
        </p>
        <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full inline-block">
          يتحكم في السجل ID: 1 في جدول personal_info
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <User className="w-6 h-6 mr-3" />
            المعلومات الشخصية
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الاسم الكامل *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المسمى الوظيفي *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                placeholder="مثال: مهندس برمجيات متخصص في Flutter"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                نبذة شخصية
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="اكتب نبذة مختصرة عن نفسك..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الصورة الشخصية
              </label>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                {formData.profile_image_url && (
                  <img
                    src={formData.profile_image_url}
                    alt="الصورة الشخصية"
                    className="w-20 h-20 object-cover rounded-full border border-gray-300 dark:border-gray-600"
                  />
                )}
                <label className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse">
                  {uploadingImage ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>رفع صورة</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Phone className="w-6 h-6 mr-3" />
            معلومات التواصل
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رقم الهاتف
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الموقع
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الموقع الإلكتروني
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            وسائل التواصل الاجتماعي
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                LinkedIn
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twitter
              </label>
              <input
                type="url"
                value={formData.twitter_url}
                onChange={(e) => setFormData(prev => ({ ...prev, twitter_url: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>
        </div>

        {/* Skills & Experience */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            المهارات والخبرة
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                سنوات الخبرة
              </label>
              <input
                type="number"
                value={formData.years_experience}
                onChange={(e) => setFormData(prev => ({ ...prev, years_experience: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المشاريع المكتملة
              </label>
              <input
                type="number"
                value={formData.projects_completed}
                onChange={(e) => setFormData(prev => ({ ...prev, projects_completed: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                العملاء السعداء
              </label>
              <input
                type="number"
                value={formData.happy_clients}
                onChange={(e) => setFormData(prev => ({ ...prev, happy_clients: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              المهارات التقنية
            </label>
            <div className="space-y-2">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex space-x-2 rtl:space-x-reverse">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="اسم المهارة"
                  />
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSkill}
                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 transition-colors"
              >
                + إضافة مهارة
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            معلومات إضافية
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              رابط السيرة الذاتية (CV)
            </label>
            <input
              type="url"
              value={formData.cv_url}
              onChange={(e) => setFormData(prev => ({ ...prev, cv_url: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="رابط ملف السيرة الذاتية"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary-600 text-white py-3 px-8 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 rtl:space-x-reverse"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default PortfolioManager;
