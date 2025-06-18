'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, User, FolderOpen, Settings, Package,
  BarChart3, LogOut, Globe, Smartphone
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase, companyAPI, CompanyInfo } from '@/lib/supabase';
import AuthGuard from '@/components/AuthGuard';
import ProjectsManager from '@/components/admin/ProjectsManager';
import CompanyManager from '@/components/admin/CompanyManager';
import ProductsManager from '@/components/admin/ProductsManager';
import ServicesManager from '@/components/admin/ServicesManager';
import PortfolioManager from '@/components/admin/PortfolioManager';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'لوحة المعلومات', icon: BarChart3 },
    { id: 'company', label: 'معلومات الشركة', icon: Building2 },
    { id: 'projects', label: 'إدارة المشاريع', icon: FolderOpen },
    { id: 'products', label: 'إدارة المنتجات', icon: Package },
    { id: 'services', label: 'إدارة الخدمات', icon: Settings },
    { id: 'portfolio', label: 'معلومات البورتفوليو', icon: User },
    { id: 'websites', label: 'إدارة المواقع', icon: Globe },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
            <div className="p-6 flex flex-col h-screen">
              {/* Logo */}
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-8">
                <div className="p-2 bg-primary-600 text-white rounded-lg">
                  <Building2 size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    لوحة التحكم الموحدة
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    إدارة شاملة
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1">
                <nav className="space-y-2">
                  {sidebarItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </nav>

                {/* Website Links */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    المواقع
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="http://localhost:3001"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Building2 size={16} />
                      <span>موقع الشركة</span>
                    </a>
                    <a
                      href="http://localhost:3003"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <User size={16} />
                      <span>البورتفوليو الشخصي</span>
                    </a>
                  </div>
                </div>
              </div>



              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'company' && renderCompanyInfo()}
                {activeTab === 'projects' && renderProjects()}
                {activeTab === 'products' && renderProducts()}
                {activeTab === 'services' && renderServices()}
                {activeTab === 'portfolio' && renderPortfolio()}
                {activeTab === 'websites' && renderWebsites()}
              </>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );

  // Dashboard Tab
  function renderDashboard() {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            لوحة المعلومات
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            نظرة عامة على جميع المواقع والمحتوى
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mr-4 rtl:ml-4 rtl:mr-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المشاريع</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="mr-4 rtl:ml-4 rtl:mr-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المنتجات</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="mr-4 rtl:ml-4 rtl:mr-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الخدمات</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <Globe className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="mr-4 rtl:ml-4 rtl:mr-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المواقع</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('projects')}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FolderOpen className="w-8 h-8 text-primary-600 mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">إضافة مشروع جديد</div>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Package className="w-8 h-8 text-primary-600 mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">إضافة منتج جديد</div>
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Building2 className="w-8 h-8 text-primary-600 mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">تحديث معلومات الشركة</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Company Info Tab
  function renderCompanyInfo() {
    return <CompanyManager />;
  }

  // Projects Tab
  function renderProjects() {
    return <ProjectsManager />;
  }

  // Products Tab
  function renderProducts() {
    return <ProductsManager />;
  }

  // Services Tab
  function renderServices() {
    return <ServicesManager />;
  }

  // Portfolio Tab
  function renderPortfolio() {
    return <PortfolioManager />;
  }

  function renderWebsites() {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          إدارة المواقع
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <Building2 className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  موقع الشركة
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  localhost:3001
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">الحالة:</span>
                <span className="text-sm text-green-600">نشط</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">آخر تحديث:</span>
                <span className="text-sm text-gray-900 dark:text-white">اليوم</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <User className="w-8 h-8 text-secondary-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  البورتفوليو الشخصي
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  localhost:3003
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">الحالة:</span>
                <span className="text-sm text-green-600">نشط</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">آخر تحديث:</span>
                <span className="text-sm text-gray-900 dark:text-white">أمس</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AdminPage;
