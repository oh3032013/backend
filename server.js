import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';

// 1. إعداد الإعدادات البيئية أولاً
dotenv.config();

// 2. تعريف الـ app والـ Port
const app = express();
const PORT = process.env.PORT || 5000;

// 3. خدمة الملفات الثابتة (للصور)
app.use('/projects', express.static(path.join(__dirname, 'public/projects')));
app.use('/portfolio', express.static(path.join(__dirname, 'public/portfolio')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 4. إعداد الـ i18next للغات
i18next.use(middleware.LanguageDetector).init({
  preload: ['en', 'ar'],
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        "server_running": "OmarXGaming Portfolio Server is running successfully! 🚀🎮",
        "route_not_found": "The requested route was not found!",
        "password_required": "Please enter the password.",
        "incorrect_password": "Incorrect password! Please try again.",
        "login_success": "Logged in successfully! Welcome back, Omar 🎮"
      }
    },
    ar: {
      translation: {
        "server_running": "سيرفر محفظة أعمال OmarXGaming يعمل بنجاح! 🚀🎮",
        "route_not_found": "المسار المطلوب غير موجود!",
        "password_required": "يرجى إدخال كلمة المرور.",
        "incorrect_password": "كلمة المرور غير صحيحة! يرجى المحاولة مجدداً.",
        "login_success": "تم تسجيل الدخول بنجاح! مرحباً بعودتك يا عمر 🎮"
      }
    }
  }
});

// 5. إعدادات الـ CORS اليدوية الصارمة (لإجبار Vercel على تمرير الـ Headers)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Accept-Language'
  );
  
  // معالجة طلب الـ Preflight (OPTIONS) اللي المتصفح بيبعته تلقائياً
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json());
app.use(middleware.handle(i18next));

// 6. المسارات الأساسية (Routes)
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// 7. المسار الترحيبي الرئيسي (يقبل الـ / مباشرة)
app.get('/', (req, res) => {
  res.json({
    message: req.t('server_running'),
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// 8. معالجة المسارات غير الموجودة (404)
app.use((req, res) => {
  res.status(404).json({ success: false, message: req.t('route_not_found') });
});

// 9. تشغيل الـ listen محلياً فقط (عشان ما يضربش كراش على Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Server is flying locally on port: ${PORT}`);
    console.log(`🎮 Welcome to OmarXGaming Backend API hub`);
    console.log(`==================================================`);
  });
}

// 10. تصدير الـ app لـ Vercel
export default app;
