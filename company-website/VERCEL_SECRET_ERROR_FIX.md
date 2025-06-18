# حل مشكلة "references Secret which does not exist" في Vercel

## 🚨 الخطأ المحدد:
```
Environment Variable "NEXT_PUBLIC_SUPABASE_URL" references Secret "supabase_url", which does not exist.
```

## 🔍 سبب المشكلة:
Vercel يحاول الوصول إلى Secret غير موجود بدلاً من استخدام القيمة المباشرة للمتغير.

## 🔧 الحل الشامل (خطوة بخطوة):

### الخطوة 1: حذف كامل للمتغيرات والـ Secrets

1. **اذهب إلى Vercel Dashboard**
   - https://vercel.com/dashboard
   - اختر مشروعك

2. **اذهب إلى Settings > Environment Variables**

3. **احذف جميع المتغيرات الموجودة**:
   - ابحث عن `NEXT_PUBLIC_SUPABASE_URL` واحذفه
   - ابحث عن `NEXT_PUBLIC_SUPABASE_ANON_KEY` واحذفه  
   - ابحث عن `SUPABASE_SERVICE_ROLE_KEY` واحذفه
   - احذف أي متغيرات أخرى متعلقة بـ Supabase

4. **احذف جميع الـ Secrets**:
   - ابحث عن قسم "Secrets" في نفس الصفحة
   - احذف أي secrets مثل:
     - `supabase_url`
     - `supabase_key`
     - `supabase_anon_key`
     - أي secret آخر متعلق بـ Supabase

### الخطوة 2: الحصول على القيم الصحيحة من Supabase

1. **اذهب إلى Supabase Dashboard**:
   - https://supabase.com/dashboard/project/yoveamzpdqepjgafqgjl

2. **اذهب إلى Settings > API**

3. **انسخ القيم التالية**:
   ```
   Project URL: https://yoveamzpdqepjgafqgjl.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdmVhbXpwZHFlcGpnYWZxZ2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzI4NzEsImV4cCI6MjA1MDEwODg3MX0.Qr8rVdCJqKH5-VQZ8wZ9X7Y6V5U4T3S2R1Q0P9O8N7M6L5K4J3I2H1G0F9E8D7C6B5A4
   service_role: [انسخ الـ service role key كاملاً]
   ```

### الخطوة 3: إضافة المتغيرات بالطريقة الصحيحة

1. **في Vercel Dashboard > Settings > Environment Variables**

2. **أضف المتغير الأول**:
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://yoveamzpdqepjgafqgjl.supabase.co
   Environment: Production ✓ Preview ✓ Development ✓
   ```
   - **مهم**: لا تستخدم @ أو $ في القيمة
   - **مهم**: لا تختار "Reference existing secret"

3. **أضف المتغير الثاني**:
   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [الصق anon key كاملاً من Supabase]
   Environment: Production ✓ Preview ✓ Development ✓
   ```

4. **أضف المتغير الثالث**:
   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: [الصق service role key كاملاً من Supabase]
   Environment: Production ✓ Preview ✓ Development ✓
   ```

### الخطوة 4: التحقق من الإعدادات

1. **تأكد من Build Settings**:
   ```
   Framework Preset: Next.js
   Root Directory: company-website
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

2. **تأكد من عدم وجود ملف .env في المشروع يحتوي على references**

### الخطوة 5: إعادة النشر

1. **احفظ جميع المتغيرات**
2. **اذهب إلى Deployments**
3. **انقر على "Redeploy" في آخر deployment**
4. **انتظر انتهاء البناء**

## 🔍 إذا استمرت المشكلة:

### الحل البديل 1: إنشاء مشروع جديد

1. **أنشئ مشروع جديد في Vercel**
2. **اربطه بنفس GitHub repository**
3. **أضف المتغيرات من البداية**

### الحل البديل 2: استخدام CLI

```bash
# تأكد من تسجيل الدخول
vercel login

# اذهب لمجلد المشروع
cd company-website

# احذف المتغيرات القديمة
vercel env rm NEXT_PUBLIC_SUPABASE_URL --yes
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY --yes
vercel env rm SUPABASE_SERVICE_ROLE_KEY --yes

# أضف المتغيرات الجديدة
vercel env add NEXT_PUBLIC_SUPABASE_URL
# أدخل: https://yoveamzpdqepjgafqgjl.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# أدخل anon key

vercel env add SUPABASE_SERVICE_ROLE_KEY
# أدخل service role key

# أعد النشر
vercel --prod
```

### الحل البديل 3: تحقق من ملف vercel.json

إذا كان لديك ملف `vercel.json`، تأكد أنه لا يحتوي على references:

```json
{
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://yoveamzpdqepjgafqgjl.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "your-anon-key-here"
  }
}
```

## ✅ علامات النجاح:

بعد تطبيق الحل، يجب أن ترى:
- ✅ Build ينجح بدون أخطاء
- ✅ لا توجد رسائل خطأ حول Secrets
- ✅ الموقع يعمل ويتصل بـ Supabase
- ✅ لوحة الإدارة تعمل

## 🆘 إذا لم ينجح أي حل:

1. **تواصل مع دعم Vercel**:
   - https://vercel.com/help
   - اذكر الخطأ المحدد والخطوات المتبعة

2. **أو استخدم منصة أخرى مؤقتاً**:
   - Netlify
   - Railway
   - Render

---

**ملاحظة مهمة**: تأكد من عدم مشاركة service role key مع أحد - هو مفتاح سري!
