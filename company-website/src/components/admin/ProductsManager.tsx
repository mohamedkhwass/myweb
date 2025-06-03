'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Save, X, Upload, Package, 
  DollarSign, Star, Eye, EyeOff 
} from 'lucide-react';
import { productsAPI, storageAPI, Product } from '@/lib/supabase';

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    price: 0,
    currency: 'USD',
    product_type: 'app' as 'app' | 'service' | 'subscription',
    category: '',
    features: [] as string[],
    images: [] as string[],
    demo_url: '',
    download_url: '',
    is_featured: false,
    is_active: true,
    project_id: null as number | null,
    subscription_type: 'one-time' as 'monthly' | 'yearly' | 'one-time',
    display_order: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        features: formData.features.filter(feature => feature.trim() !== '')
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
      } else {
        await productsAPI.create(productData);
      }

      await fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      short_description: product.short_description || '',
      price: product.price || 0,
      currency: product.currency,
      product_type: product.product_type,
      category: product.category || '',
      features: product.features || [],
      images: product.images || [],
      demo_url: product.demo_url || '',
      download_url: product.download_url || '',
      is_featured: product.is_featured,
      is_active: product.is_active,
      project_id: product.project_id,
      subscription_type: product.subscription_type || 'one-time',
      display_order: product.display_order
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setLoading(true);
      try {
        await productsAPI.delete(id);
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
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
      const imageUrl = await storageAPI.uploadImage(file, 'products');
      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
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
        images: prev.images.filter(img => img !== imageUrl)
      }));
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      short_description: '',
      price: 0,
      currency: 'USD',
      product_type: 'app',
      category: '',
      features: [],
      images: [],
      demo_url: '',
      download_url: '',
      is_featured: false,
      is_active: true,
      project_id: null,
      subscription_type: 'one-time',
      display_order: 0
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case 'app': return 'تطبيق';
      case 'service': return 'خدمة';
      case 'subscription': return 'اشتراك';
      default: return type;
    }
  };

  if (loading && products.length === 0) {
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
            إدارة المنتجات
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            إضافة وتعديل المنتجات والتطبيقات للبيع
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة منتج جديد</span>
        </motion.button>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            {/* Product Image */}
            {product.images && product.images.length > 0 && (
              <div className="relative h-48">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2 rtl:space-x-reverse">
                  {product.is_featured && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      مميز
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs flex items-center ${
                    product.is_active 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {product.is_active ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                    {product.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded text-xs">
                  {getProductTypeLabel(product.product_type)}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {product.short_description || product.description}
              </p>

              {/* Price */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {product.price} {product.currency}
                </span>
                {product.subscription_type !== 'one-time' && (
                  <span className="text-sm text-gray-500">
                    / {product.subscription_type === 'monthly' ? 'شهر' : 'سنة'}
                  </span>
                )}
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {product.features.slice(0, 2).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {feature}
                      </div>
                    ))}
                    {product.features.length > 2 && (
                      <div className="text-xs text-gray-500 mt-1">
                        +{product.features.length - 2} ميزة أخرى
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 rtl:space-x-reverse">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <Edit className="w-4 h-4" />
                  <span>تعديل</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(product.id)}
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
                  {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
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
                      اسم المنتج *
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
                      الفئة
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Product Type & Price */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      نوع المنتج *
                    </label>
                    <select
                      value={formData.product_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, product_type: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="app">تطبيق</option>
                      <option value="service">خدمة</option>
                      <option value="subscription">اشتراك</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      السعر
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      العملة
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="EGP">EGP</option>
                    </select>
                  </div>
                </div>

                {/* Subscription Type */}
                {formData.product_type === 'subscription' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      نوع الاشتراك
                    </label>
                    <select
                      value={formData.subscription_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, subscription_type: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="monthly">شهري</option>
                      <option value="yearly">سنوي</option>
                      <option value="one-time">دفعة واحدة</option>
                    </select>
                  </div>
                )}

                {/* Descriptions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    وصف مختصر
                  </label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="وصف قصير يظهر في البطاقة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الوصف التفصيلي
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الميزات
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex space-x-2 rtl:space-x-reverse">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="ميزة المنتج"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 transition-colors"
                    >
                      + إضافة ميزة
                    </button>
                  </div>
                </div>

                {/* URLs */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      رابط التجربة
                    </label>
                    <input
                      type="url"
                      value={formData.demo_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      رابط التحميل
                    </label>
                    <input
                      type="url"
                      value={formData.download_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, download_url: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Settings */}
                <div className="grid md:grid-cols-3 gap-6">
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
                        checked={formData.is_featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        منتج مميز
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center space-x-3 rtl:space-x-reverse">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        منتج نشط
                      </span>
                    </label>
                  </div>
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
                        <span>{editingProduct ? 'تحديث المنتج' : 'حفظ المنتج'}</span>
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

export default ProductsManager;
