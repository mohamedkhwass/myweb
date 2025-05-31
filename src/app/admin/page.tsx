'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Upload, User, Settings, BarChart3, FolderOpen, LogOut } from 'lucide-react';
import { projectsAPI, skillsAPI, personalInfoAPI, Project, Skill, PersonalInfo, supabase } from '@/lib/supabase';
import ProjectForm from '@/components/admin/ProjectForm';
import AuthGuard from '@/components/AuthGuard';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('projects');
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    category: '',
    live_url: '',
    github_url: '',
    featured: false,
    images: [] as string[]
  });

  // Personal info form
  const [personalFormData, setPersonalFormData] = useState({
    name: '',
    title: '',
    description: '',
    email: '',
    phone: '',
    location: '',
    github_url: '',
    linkedin_url: ''
  });

  // Skills form
  const [skillFormData, setSkillFormData] = useState({
    category: '',
    skill_name: '',
    display_order: 0
  });
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showSkillForm, setShowSkillForm] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [projectsData, skillsData, personalData] = await Promise.all([
        projectsAPI.getAll(),
        skillsAPI.getAll(),
        personalInfoAPI.get().catch(() => null)
      ]);

      setProjects(projectsData);
      setSkills(skillsData);
      setPersonalInfo(personalData);

      if (personalData) {
        setPersonalFormData({
          name: personalData.name || '',
          title: personalData.title || '',
          description: personalData.description || '',
          email: personalData.email || '',
          phone: personalData.phone || '',
          location: personalData.location || '',
          github_url: personalData.github_url || '',
          linkedin_url: personalData.linkedin_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Image upload function
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);

      setFormData({
        ...formData,
        images: [...(formData.images || []), ...imageUrls]
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('فشل في رفع الصور');
    } finally {
      setUploadingImage(false);
    }
  };



  // Project handlers
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()),
        display_order: projects.length + 1
      };

      if (editingProject) {
        await projectsAPI.update(editingProject.id, projectData);
      } else {
        await projectsAPI.create(projectData);
      }

      await fetchAllData();
      resetProjectForm();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  // Personal info handlers
  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await personalInfoAPI.update(personalFormData);
      await fetchAllData();
      alert('تم تحديث المعلومات الشخصية بنجاح');
    } catch (error) {
      console.error('Error updating personal info:', error);
      alert('فشل في تحديث المعلومات الشخصية');
    }
  };

  // Skills handlers
  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await skillsAPI.update(editingSkill.id, skillFormData);
      } else {
        await skillsAPI.create(skillFormData);
      }
      await fetchAllData();
      resetSkillForm();
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      try {
        await projectsAPI.delete(id);
        await fetchAllData();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه المهارة؟')) {
      try {
        await skillsAPI.delete(id);
        await fetchAllData();
      } catch (error) {
        console.error('Error deleting skill:', error);
      }
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      category: project.category,
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      featured: project.featured,
      images: (project as any).images || []
    });
    setShowAddForm(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillFormData({
      category: skill.category,
      skill_name: skill.skill_name,
      display_order: skill.display_order
    });
    setShowSkillForm(true);
  };

  const resetProjectForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      category: '',
      live_url: '',
      github_url: '',
      featured: false,
      images: []
    });
    setEditingProject(null);
    setShowAddForm(false);
  };

  const resetSkillForm = () => {
    setSkillFormData({
      category: '',
      skill_name: '',
      display_order: 0
    });
    setEditingSkill(null);
    setShowSkillForm(false);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              لوحة التحكم
            </h1>

            <nav className="space-y-2">
              {[
                { id: 'projects', label: 'المشاريع', icon: FolderOpen },
                { id: 'skills', label: 'المهارات', icon: Settings },
                { id: 'personal', label: 'المعلومات الشخصية', icon: User },
                { id: 'stats', label: 'الإحصائيات', icon: BarChart3 }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-6 left-6 right-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={20} />
                <span>تسجيل الخروج</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'projects' && renderProjectsTab()}
              {activeTab === 'skills' && renderSkillsTab()}
              {activeTab === 'personal' && renderPersonalTab()}
              {activeTab === 'stats' && renderStatsTab()}
            </>
          )}
        </div>
        </div>
      </div>
    </AuthGuard>
  );

  // Projects Tab
  function renderProjectsTab() {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            إدارة المشاريع
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>إضافة مشروع جديد</span>
          </motion.button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <ProjectForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleProjectSubmit}
            onCancel={resetProjectForm}
            onImageUpload={handleImageUpload}
            uploadingImage={uploadingImage}
            editingProject={editingProject}
          />
        )}

        {/* Projects List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                  {project.description.substring(0, 100)}...
                </p>

                {/* Project Images Preview */}
                {(project as any).images && (project as any).images.length > 0 && (
                  <div className="mb-3">
                    <div className="flex space-x-2 rtl:space-x-reverse overflow-x-auto">
                      {(project as any).images.slice(0, 3).map((imageUrl: string, index: number) => (
                        <div key={index} className="flex-shrink-0">
                          <img
                            src={imageUrl}
                            alt={`صورة ${index + 1}`}
                            className="w-12 h-12 object-cover rounded border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      ))}
                      {(project as any).images.length > 3 && (
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            +{(project as any).images.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
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

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                      مميز
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Skills Tab
  function renderSkillsTab() {
    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            إدارة المهارات
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSkillForm(true)}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>إضافة مهارة جديدة</span>
          </motion.button>
        </div>

        {/* Add/Edit Skill Form */}
        {showSkillForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingSkill ? 'تعديل المهارة' : 'إضافة مهارة جديدة'}
              </h3>
              <button
                onClick={resetSkillForm}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSkillSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الفئة
                  </label>
                  <select
                    value={skillFormData.category}
                    onChange={(e) => setSkillFormData({ ...skillFormData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                    required
                  >
                    <option value="">اختر الفئة</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Backend & Database">Backend & Database</option>
                    <option value="Tools & Others">Tools & Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اسم المهارة
                  </label>
                  <input
                    type="text"
                    value={skillFormData.skill_name}
                    onChange={(e) => setSkillFormData({ ...skillFormData, skill_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 rtl:space-x-reverse">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save size={20} />
                  <span>{editingSkill ? 'تحديث' : 'حفظ'}</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={resetSkillForm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  إلغاء
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Skills by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {category}
              </h3>
              <div className="space-y-2">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">{skill.skill_name}</span>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => handleEditSkill(skill)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Personal Info Tab
  function renderPersonalTab() {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          المعلومات الشخصية
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={personalFormData.name}
                  onChange={(e) => setPersonalFormData({ ...personalFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المسمى الوظيفي
                </label>
                <input
                  type="text"
                  value={personalFormData.title}
                  onChange={(e) => setPersonalFormData({ ...personalFormData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الوصف الشخصي
              </label>
              <textarea
                value={personalFormData.description}
                onChange={(e) => setPersonalFormData({ ...personalFormData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={personalFormData.email}
                  onChange={(e) => setPersonalFormData({ ...personalFormData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={personalFormData.phone}
                  onChange={(e) => setPersonalFormData({ ...personalFormData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الموقع
                </label>
                <input
                  type="text"
                  value={personalFormData.location}
                  onChange={(e) => setPersonalFormData({ ...personalFormData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رابط GitHub
                </label>
                <input
                  type="url"
                  value={personalFormData.github_url}
                  onChange={(e) => setPersonalFormData({ ...personalFormData, github_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رابط LinkedIn
                </label>
                <input
                  type="url"
                  value={personalFormData.linkedin_url}
                  onChange={(e) => setPersonalFormData({ ...personalFormData, linkedin_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save size={20} />
              <span>حفظ التغييرات</span>
            </motion.button>
          </form>
        </div>
      </div>
    );
  }

  // Stats Tab
  function renderStatsTab() {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          الإحصائيات
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mr-4 rtl:ml-4 rtl:mr-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي المشاريع</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Settings className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="mr-4 rtl:ml-4 rtl:mr-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي المهارات</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{skills.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <BarChart3 className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="mr-4 rtl:ml-4 rtl:mr-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المشاريع المميزة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {projects.filter(p => p.featured).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="mr-4 rtl:ml-4 rtl:mr-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">فئات المهارات</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(skills.map(s => s.category)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AdminPage;
