# دليل الاستخدام - نظام معرض الصور

## 🚀 البدء السريع

### 1. تشغيل المشروع
```bash
cd company-website
npm install
npm run dev
```

### 2. الوصول للموقع
- الموقع الرئيسي: `http://localhost:3001`
- لوحة الإدارة: `http://localhost:3001/admin`

## 📋 إدارة الصور في لوحة التحكم

### إضافة صور للمشاريع

1. **الدخول لإدارة المشاريع**
   - اذهب إلى `/admin`
   - اختر "إدارة المشاريع"

2. **إضافة مشروع جديد**
   - انقر على "إضافة مشروع جديد"
   - املأ البيانات الأساسية

3. **رفع الصور**
   - في قسم "صور المشروع"
   - اسحب الصور أو انقر لاختيارها
   - يمكن رفع حتى 10 صور لكل مشروع

4. **ترتيب الصور**
   - اسحب الصور لإعادة ترتيبها
   - الصورة الأولى ستكون الصورة الرئيسية

### إضافة صور للمنتجات

1. **الدخول لإدارة المنتجات**
   - اختر "إدارة المنتجات" من القائمة

2. **إضافة منتج جديد**
   - انقر على "إضافة منتج جديد"
   - املأ معلومات المنتج

3. **رفع صور المنتج**
   - في قسم "صور المنتج"
   - رفع حتى 8 صور لكل منتج
   - الصور ستُحسن تلقائياً

### إضافة صور للخدمات

1. **الدخول لإدارة الخدمات**
   - اختر "إدارة الخدمات"

2. **إضافة خدمة جديدة**
   - انقر على "إضافة خدمة جديدة"
   - أدخل تفاصيل الخدمة

3. **رفع صور الخدمة**
   - في قسم "صور الخدمة"
   - رفع حتى 6 صور لكل خدمة

## 🎨 استخدام مكون عرض الصور

### في الكود
```tsx
import ImageGallery from '@/components/ImageGallery';

// استخدام أساسي
<ImageGallery
  images={['image1.jpg', 'image2.jpg', 'image3.jpg']}
  alt="وصف الصور"
/>

// استخدام متقدم
<ImageGallery
  images={imageArray}
  alt="صور المشروع"
  autoPlay={true}
  autoPlayInterval={5000}
  showThumbnails={true}
  className="h-64"
/>
```

### الخصائص المتاحة
- `images`: مصفوفة روابط الصور
- `alt`: النص البديل للصور
- `autoPlay`: تفعيل التقليب التلقائي (افتراضي: true)
- `autoPlayInterval`: فترة التقليب بالميلي ثانية (افتراضي: 4000)
- `showThumbnails`: عرض الصور المصغرة (افتراضي: true)
- `className`: فئات CSS إضافية

## 🛠️ إدارة الصور المتقدمة

### استخدام مكون إدارة الصور
```tsx
import ImageManager from '@/components/admin/ImageManager';

<ImageManager
  images={currentImages}
  onImagesChange={setImages}
  uploadPath="projects"
  maxImages={10}
/>
```

### الخصائص
- `images`: الصور الحالية
- `onImagesChange`: دالة تحديث الصور
- `uploadPath`: مسار التخزين في Supabase
- `maxImages`: العدد الأقصى للصور

## 📊 عرض الإحصائيات

### إضافة مكون الإحصائيات
```tsx
import ImageStats from '@/components/admin/ImageStats';

// في صفحة لوحة التحكم
<ImageStats />
```

## 🔧 تخصيص التصميم

### تخصيص الألوان
```css
/* في ملف CSS المخصص */
.image-gallery {
  --primary-color: #your-color;
  --secondary-color: #your-secondary;
}
```

### تخصيص الحركات
```tsx
// تخصيص مدة الانتقال
<ImageGallery
  images={images}
  autoPlayInterval={3000} // 3 ثوانٍ
/>
```

## 📱 الاستجابة للأجهزة

### نقاط التوقف
- **الهواتف**: أقل من 768px
- **الأجهزة اللوحية**: 768px - 1024px
- **سطح المكتب**: أكبر من 1024px

### التخصيص للأجهزة
```tsx
<ImageGallery
  images={images}
  showThumbnails={window.innerWidth > 768}
  className="h-48 md:h-64 lg:h-80"
/>
```

## 🎯 أفضل الممارسات

### 1. أحجام الصور المثلى
- **العرض الأقصى**: 1920px
- **الارتفاع الأقصى**: 1080px
- **الصيغة المفضلة**: WebP
- **الجودة**: 80-85%

### 2. تسمية الصور
```
project-name-01.webp
product-showcase-main.webp
service-demo-before-after.webp
```

### 3. ترتيب الصور
- ضع أهم صورة أولاً
- رتب الصور منطقياً
- استخدم صور عالية الجودة

### 4. النصوص البديلة
```tsx
<ImageGallery
  images={images}
  alt="صور مشروع تطوير موقع إلكتروني للشركة"
/>
```

## 🔍 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. الصور لا تظهر
```bash
# تحقق من رابط الصورة
console.log('Image URL:', imageUrl);

# تحقق من صلاحيات Supabase
# في لوحة تحكم Supabase > Storage > Policies
```

#### 2. رفع الصور يفشل
```typescript
// تحقق من حجم الصورة
if (file.size > 10 * 1024 * 1024) {
  console.error('الصورة كبيرة جداً');
}

// تحقق من نوع الصورة
if (!file.type.startsWith('image/')) {
  console.error('الملف ليس صورة');
}
```

#### 3. التقليب التلقائي لا يعمل
```tsx
// تأكد من تمرير autoPlay
<ImageGallery
  images={images}
  autoPlay={true}
  autoPlayInterval={4000}
/>
```

### تسجيل الأخطاء
```typescript
// في بيئة التطوير
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', debugData);
}
```

## 📈 تحسين الأداء

### 1. تحميل الصور الكسول
```tsx
// الصور تُحمل تلقائياً عند الحاجة
<ImageGallery
  images={images}
  loading="lazy" // افتراضي
/>
```

### 2. ضغط الصور
```typescript
// يتم تلقائياً عند الرفع
const optimized = await optimizeImage(file, {
  quality: 0.8,
  format: 'webp'
});
```

### 3. التخزين المؤقت
```typescript
// استخدام Service Worker للتخزين المؤقت
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 🔒 الأمان

### 1. فحص الملفات
```typescript
// يتم تلقائياً قبل الرفع
const validation = validateImageFile(file);
if (!validation.valid) {
  throw new Error(validation.error);
}
```

### 2. حماية الروابط
```typescript
// استخدام Supabase RLS
-- في قاعدة البيانات
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');
```

## 📞 الدعم والمساعدة

### الحصول على المساعدة
1. راجع هذا الدليل أولاً
2. تحقق من ملف `GALLERY_FEATURES.md`
3. ابحث في الكود عن أمثلة
4. تحقق من وحدة التحكم للأخطاء

### الإبلاغ عن المشاكل
```typescript
// معلومات مفيدة للإبلاغ
console.log({
  browser: navigator.userAgent,
  images: images.length,
  error: errorMessage
});
```

---

**ملاحظة**: هذا النظام مطور خصيصاً لموقع الشركة ويدعم جميع المتطلبات المطلوبة مع إمكانيات توسع مستقبلية.
