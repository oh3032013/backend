import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// تعريف الـ __dirname بأمان في الـ ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// استيراد الـ Routes الخاصة بك
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';

// تهيئة الإعدادات البيئية
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. إعدادات الـ CORS الصارمة والمباشرة لمنع أي حظر
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

// 2. مأمن لخدمة الملفات الثابتة (Static Files)
const publicPathProjects = path.join(__dirname, 'public/projects');
const publicPathPortfolio = path.join(__dirname, 'public/portfolio');
const publicPathUploads = path.join(__dirname, 'public/uploads');

if (fs.existsSync(publicPathProjects)) app.use('/projects', express.static(publicPathProjects));
if (fs.existsSync(publicPathPortfolio)) app.use('/portfolio', express.static(publicPathPortfolio));
if (fs.existsSync(publicPathUploads)) app.use('/uploads', express.static(publicPathUploads));

// 3. توجيه المسارات الأساسية للـ API
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// 4. المسار الترحيبي الرئيسي (الموقع بيكلم الدومين مباشرة هنا)
app.get('/', (req, res) => {
  res.json({
    message: "OmarXGaming Portfolio Server is running successfully! 🚀🎮",
    status: 'online',
    node_version: process.version,
    timestamp: new Date().toISOString()
  });
});

// 5. معالجة المسارات غير الموجودة (404)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "The requested route was not found!" });
});

// الاستماع محلياً فقط أثناء التطوير
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running locally on port: ${PORT}`);
  });
}

// تصدير الـ app ليعمل كـ Serverless Function على Vercel
export default app;
