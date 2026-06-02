import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';

// 1. إعداد الإعدادات البيئية
dotenv.config();

// 2. تعريف الـ app والـ Port
const app = express();
const PORT = process.env.PORT || 5000;

// 3. تأمين خدمة الملفات الثابتة (عشان السيرفر ما يكرشش لو المجلدات مش مبنية في فيرسيل)
const publicPathProjects = path.join(__dirname, 'public/projects');
const publicPathPortfolio = path.join(__dirname, 'public/portfolio');
const publicPathUploads = path.join(__dirname, 'public/uploads');

if (fs.existsSync(publicPathProjects)) app.use('/projects', express.static(publicPathProjects));
if (fs.existsSync(publicPathPortfolio)) app.use('/portfolio', express.static(publicPathPortfolio));
if (fs.existsSync(publicPathUploads)) app.use('/uploads', express.static(publicPathUploads));

// 4. إعداد الـ i18next للغات (بدون تعقيد الـ Detector اللي بيكرش في الـ Serverless)
i18next.init({
  lng: 'en', // اللغة الافتراضية
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        "server_running": "OmarXGaming Portfolio Server is running successfully! 🚀🎮",
        "route_not_found": "The requested route was not found!"
      }
    },
    ar: {
      translation: {
        "server_running": "سيرفر محفظة أعمال OmarXGaming يعمل بنجاح! 🚀🎮",
        "route_not_found": "المسار المطلوب غير موجود!"
      }
    }
  }
});

// 5. إعدادات الـ CORS اليدوية (مشرط وصارمة)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Accept-Language'
  );
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json());

// إضافة ترجمة مبسطة بديلة للـ Middleware التقليدي عشان نمنع الكراش
app.use((req, res, next) => {
  req.t = (key) => {
    const lang = req.headers['accept-language']?.startsWith('ar') ? 'ar' : 'en';
    return i18next.getResource(lang, 'translation', key) || key;
  };
  next();
});

// 6. المسارات الأساسية (Routes)
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// 7. المسار الترحيبي الرئيسي
app.get('/', (req, res) => {
  res.json({
    message: req.t('server_running'),
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// 8. معالجة الـ 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: req.t('route_not_found') });
});

// 9. الاستماع محلياً فقط
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running locally on port: ${PORT}`);
  });
}

// 10. التصدير
export default app;
